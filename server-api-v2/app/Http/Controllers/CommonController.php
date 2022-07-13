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



class CommonController extends Controller
{
    public function checkValueExists(Request $request)
    {
        Log::info($request->all());
        Log::info(Auth()->user());
        $exists = false;

        try
        {
            $value = rtrim($request->input('value'));
            $type = rtrim($request->input('type'));
            $index = ($request->input('id') != '') ? Helpers::decodeHashedID($request->input('id')) : null;
            $query = null;

            if ($value != '' && $type != '')
            {
                if ($type == 'invitation.email')
                {
                    $query = Invitation::withTrashed()->where('email', '=', $value);
                }
                $exists = ($query->get()->count() > 0) ? true : false;

            }

        }
        catch (Exception $e)
        {
            ErrorHandler::log($e);
        }

        return response()->json(
            RequestHelper::sendResponse(
                RequestType::CODE_200,
                LocalizationHelper::getTranslatedText('response.success_request'),
                [ 'found' => $exists,
                  'name' => ($exists && $type == 'user.phone')? $userName->full_name : ' ',
                  'type' => ($exists && $type == 'user.phone')? $userType : ' ']
            ), RequestType::CODE_200);
    }
}
