<?php

namespace App\Http\Controllers;
use App\Models\User; 
use Validator;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Log;
use Illuminate\Validation\ValidationException;
use ErrorHandler;
use DB;
use RequestHelper;
use Helpers;
use App\Enums\ErrorType;
use App\Exceptions\System\ResourceNotFoundException;
use App\Exceptions\System\ServerErrorException;
use App\Enums\RequestType;
use LocalizationHelper;
use App\Models\Invitation;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\InvitationResourceCollection;
use App\Mail\SendUserInvitation;
use PathHelper;

class InvitationController extends Controller
{

    public function verifyInvitation(Request $request)
    {
        try
        {
            $token = (!Helpers::IsNullOrEmpty($request->input('token'))) ? trim($request->input('token')) : null;

            if (is_null($token))
            {
                return response()->json(
                    RequestHelper::sendResponse(
                        RequestType::CODE_200,
                        LocalizationHelper::getTranslatedText('system.missing_parameters')
                    ),
                    RequestType::CODE_200
                );
            }

            $invitation = $this->findByToken($token);

            return (new InvitationResource($invitation, ['basic' => true]))
                ->response()
                ->setStatusCode(RequestType::CODE_200);

        }
        catch (Exception $e)
        {
            throw new ServerErrorException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function acceptInvitation(Request $request)
    {
        DB::beginTransaction();

        try
        {


            // get invitation
            $invitationObj = $this->findById(Helpers::decodeHashedID($request->input('reference')));

            // create user accounts
            
            $userAcc = new User();

            $userAcc->email = $invitationObj->email;
            $userAcc->first_name = $request->input('first');
            $userAcc->last_name = $request->input('last');
            $userAcc->dob = $request->input('dob');
            $userAcc->password = bcrypt($request->input('password'));
            $userAcc->phone = (!Helpers::IsNullOrEmpty($request->input('phone'))) ? $request->input('phone') : null;
            $userAcc->address_1 = (!Helpers::IsNullOrEmpty($request->input('address1'))) ? $request->input('address1') : null;
            $userAcc->type = $invitationObj->is_staff;
            $userAcc->status = '0';
            $userAcc->login_access = '0';
            $userAcc->email_verified = true;

            // attach forign key
            $userAcc->department_id = $invitationObj->department_id;
            $userAcc->intake_id = $invitationObj->intake_id;


            $userAcc->save();

            //set user reference
            $firstUserAcc = $userAcc;


            // get all attributes
            $userAcc->refresh();

            /*------------- Send Mail --------------*/

            \Mail::to('dilaksanraj@gmail.com')->send(new \App\Mail\SendUserInvitationAccept($userAcc));

            /*------------- delete invitation --------------*/

            $invitationObj->delete();

            DB::commit();


            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_200,
                    LocalizationHelper::getTranslatedText('response.success_request')
                ),
                RequestType::CODE_200
            );
        }
        catch (Exception $e)
        {
            DB::rollBack();

            if ($e instanceof ValidationException)
            {
                throw new ValidationException($e->validator);
            }

            throw new ServerErrorException($e->getMessage(), $e->getCode(), $e);
        }
    }


    public function findByToken(string $token)
    {
        $invitation = Invitation::where('token', $token)
            ->first();

        return $invitation;
    }

    public function findById(int $id){
        $invitation = Invitation::where('id', $id)
            ->first();

        return $invitation;
    }


    public function create(Request $request)
    {
        DB::beginTransaction();
        try{

            $newObj = new Invitation();

            $newObj->email = $request->input('email');
            $newObj->expires_at = $request->input('expiry_date');

            $newObj->is_staff = $request->input('type');
            $newObj->admin_privileges = 1;
            $newObj->department_id = Helpers::decodeHashedID($request->input('department'));
            $newObj->intake_id = Helpers::decodeHashedID($request->input('intake'));

            $newObj->token = Helpers::generateToken();
            $newObj->created_by = auth('api')->user()->id;
            $newObj->save();

           

            Log::info($newObj);

            \Mail::to('dilaksanraj@gmail.com')->send(new \App\Mail\SendUserInvitation($newObj,PathHelper::getUserInvitationPath(request()->fullUrl(), $newObj->token)));


            DB::commit();

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_201,
                    LocalizationHelper::getTranslatedText('response.success_create'),
                    new InvitationResource($newObj)
                ), RequestType::CODE_201);

        }
        catch (Exception $e)
        {
            DB::rollBack();
            ErrorHandler::log($e);
        }

    }

    public function list(Request $request){

        Log::info('requested');
        try
        {
            $intakeList = Invitation::orderBy('id', 'asc')->get();
        }
        catch (Exception $e)
        {
            ErrorHandler::log($e);

            $intakeList = [];
        }

         return (new InvitationResourceCollection($intakeList))
             ->response()
             ->setStatusCode(RequestType::CODE_200);

    }
}
