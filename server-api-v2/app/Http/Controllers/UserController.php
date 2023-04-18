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
use App\Http\Resources\UserResource;
use App\Http\Resources\UserResourceCollection;

class UserController extends Controller
{
    
    public function getAllStaff(Request $request){


        try {

            $userList = User::where('type', '1')->orderBy('id', 'asc')->get();
            
        }
        catch(Exception $e){

            DB::rollBack();
            ErrorHandler::log($e);
            $userList = [];

        }

        return (new UserResourceCollection($userList))
             ->response()
             ->setStatusCode(RequestType::CODE_200);
    }


    public function getAllStudent(Request $request){


        try {

            $userList = User::where('type', '2')->orderBy('id', 'asc')->get();
            
        }
        catch(Exception $e){

            DB::rollBack();
            ErrorHandler::log($e);
            $userList = [];

        }

        return (new UserResourceCollection($userList))
             ->response()
             ->setStatusCode(RequestType::CODE_200);
    }

    
}
