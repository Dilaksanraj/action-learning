<?php
namespace App\Http\Controllers;
use App\Models\User; 
use Validator;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Laravel\Passport\Client as OClient;
use Laravel\Passport\RefreshToken;
use Log;

class ApiAuthController extends Controller
{
    public $successStatus = 200;
    public function login(Request $request) { 

        Log::info(trim($request->input('email')));
        Log::info(trim($request->input('email')));

        if (Auth::attempt(['email' => 'dilaksan510@gmail.com', 'password' => '123456'])) { 
            $oClient = OClient::where('password_client', 1)->first();

            Log::info("working post man");
            return $this->getTokenAndRefreshToken($oClient, 'dilaksan510@gmail.com', '123456');

            // return $this->getTokenAndRefreshToken($oClient, request('email'), request('password'));
        } 
        else { 
            return response()->json(['error'=>'Unauthorised'], 401); 
        } 
    }
    public function register(Request $request) {

        Log::info($request->all());

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
        return $this->getTokenAndRefreshToken($oClient, $user->email, $password);
    }
    public function getTokenAndRefreshToken(OClient $oClient, $email, $password) { 
        $oClient = OClient::where('password_client', 1)->first();
        $http = new Client;

        $req = Request::create('/oauth/token', 'POST', [
            'grant_type' => 'password',
            'client_id' => $oClient->id,
            'client_secret' => $oClient->secret,
            'username' => $email,
            'password' => $password,
            'scope' => '*',
        ]);

        $response = app()->handle($req);
        Log::info($response);
        Log::info(Auth()->user()->email);

        return ($response->status() === 200) ? json_decode($response->getContent(), true) : null;
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

            return true;
            // return response()->json(
            //     RequestHelper::sendResponse(
            //         RequestType::CODE_200,
            //         LocalizationHelper::getTranslatedText('auth.logout_success')
            // ), RequestType::CODE_200);
        }
        catch (Exception $e)
        {
            throw new ServerErrorException($e);
        }
    }

}