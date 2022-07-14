<?php
namespace App\Http\Controllers;
use App\Models\User; 
use Validator;
use Exception;
use Illuminate\Support\Facades\Auth;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use RequestHelper;
use Helpers;
use App\Enums\ErrorType;
use App\Enums\RequestType;
use LocalizationHelper;
use App\Exceptions\System\ServerErrorException;
use Laravel\Passport\Client as OClient;
use Laravel\Passport\RefreshToken;
use Log;
use App\Http\Resources\UserResource;

class ApiAuthController extends Controller
{
    public $successStatus = 200;
    public function login(Request $request) { 

        Log::info(trim($request->input('email')));

        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) { 
            $oClient = OClient::where('password_client', 1)->first();

            // Log::info("working post man");

            return $this->getTokenAndRefreshToken($oClient, request('email'), request('password'));
        } 
        else { 
            return response()->json(['error'=>'Unauthorised'], 401); 
        } 
    }
    public function register(Request $request) {

        $validator = Validator::make($request->all(), [ 
            'name' => 'required', 
            'email' => 'required|email|unique:users', 
            'password' => 'required', 
            'c_password' => 'required|same:password', 
        ]);
        if ($validator->fails()) { 
            return response()->json(['error'=>$validator->errors()], 401);            
        }
        $password = $request->password;
        $input = $request->all(); 
        $input['password'] = bcrypt($input['password']); 
        $user = User::create($input); 
        $oClient = OClient::where('password_client', 1)->first();
        return $this->getTokenAndRefreshToken($oClient, $user->id, $password);
    }
    public function getTokenAndRefreshToken(OClient $oClient, $id, $password) { 
        $oClient = OClient::where('password_client', 1)->first();
        $http = new Client;

        $req = Request::create('/oauth/token', 'POST', [
            'grant_type' => 'password',
            'client_id' => $oClient->id,
            'client_secret' => $oClient->secret,
            'username' => $id,
            'password' => $password,
            'scope' => '*',
        ]);

        $response = app()->handle($req);
        Log::info($response);
        Log::info(Auth()->user()->email);

        $data = ($response->status() === 200) ? json_decode($response->getContent(), true) : null;

        if (is_null($data))
                {
                    return response()->json(
                        RequestHelper::sendResponse(
                            RequestType::CODE_400,
                            LocalizationHelper::getTranslatedText('system.request_forbidden')
                    ), RequestType::CODE_400);
                }
        $send_response = [
            'access_token' => $data['access_token'],
            'refresh_token' => $data['refresh_token'],
        ];

        // login successful
        return response()->json(
            RequestHelper::sendResponse(
                RequestType::CODE_200,
                LocalizationHelper::getTranslatedText('response.success_request'),
                $send_response
            ), RequestType::CODE_200);
    }

    public function logout()
    {
        try
        {
            $user = auth()->user();

            //delete refresh token
            RefreshToken::where('access_token_id', auth()->user()->token()->id)->delete();

            //delete access token
            auth()->user()->token()->delete();

            //dispatch events
            // event(new AuthLogEventHandler($user, AuthLogType::Logout));

            unset($user);

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_200,
                    LocalizationHelper::getTranslatedText('auth.logout_success')
            ), RequestType::CODE_200);
        }
        catch (Exception $e)
        {
            throw new ServerErrorException($e);
        }
    }

    public function getUser()
    {
        Log::info('get user started');

        Log::info(auth('api')->user());

        
        try
        {
            if (!auth('api')->check())
            {
                return response()->json(
                    RequestHelper::sendResponse(
                        RequestType::CODE_401,
                        LocalizationHelper::getTranslatedText('auth.invalid_user')
                    ), RequestType::CODE_401);
            }


            $response = new UserResource(auth('api')->user(), [ 'isAuth' => true ]);


            return $response
                ->response()
                ->setStatusCode(RequestType::CODE_200);
        }
        catch (AuthException $e)
        {
            return response()->json(
                RequestHelper::sendResponse($e->getCode(), $e->getMessage()
            ), $e->getCode());
        }
        catch (Exception $e)
        {
            throw new ServerErrorException($e);
        }
    }

}