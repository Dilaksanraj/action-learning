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

class InvitationController extends Controller
{
    

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

            $newObj->token = '';//$request->input('department_id');
            $newObj->created_by = auth('api')->user()->id;
            $newObj->save();

            DB::commit();

            Log::info($newObj);

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
