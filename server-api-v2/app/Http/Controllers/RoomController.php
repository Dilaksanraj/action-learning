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
use App\Models\Room;
use App\Models\RoomToUser;
use App\Http\Resources\RoomResource;
use App\Http\Resources\RoomResourceCollection;


class RoomController extends Controller
{
    public function create(Request $request)
    {
        DB::beginTransaction();
        try{

            Log::info($request->all());
            $roomObj = new Room();
            $roomObj->name = $request->input('name');
            $roomObj->desc = $request->input('desc');
            $roomObj->project_id = Helpers::decodeHashedID($request->input('project_id'));
            $roomObj->intake_id = Helpers::decodeHashedID($request->input('intake_id'));
            $roomObj->department_id = Helpers::decodeHashedID($request->input('dep_id'));
            $roomObj->status = $request->input('status');
            $roomObj->created_by = Auth('api')->user()->id;

            $roomObj->save();
            $roomObj->refresh();

            // attache student
            foreach($request->input('stu_id') as $id){
                
                $roomStd = new RoomToUser();
                $roomStd->user_id = Helpers::decodeHashedID($id);
                $roomStd->room_id = $roomObj->id;
                $roomStd->save();

            }

            // sttache user
            foreach($request->input('staff_id') as $id){

                $roomUser = new RoomToUser();
                $roomUser->user_id = Helpers::decodeHashedID($id);
                $roomUser->room_id = $roomObj->id;
                $roomObj->save();

            }
            $roomObj->refresh();

            DB::commit();

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_201,
                    LocalizationHelper::getTranslatedText('response.success_create'),
                    new RoomResource($roomObj)
                ), RequestType::CODE_201);

        }
        catch (Exception $e)
        {
            DB::rollBack();
            ErrorHandler::log($e);
        }

    }

    public function list(Request $request){


        try {

            $projectList = Room::orderBy('id', 'asc')->get();
            
            return (new RoomResourceCollection($projectList))
             ->response()
             ->setStatusCode(RequestType::CODE_200);

        }
        catch(Exception $e){

            DB::rollBack();
            ErrorHandler::log($e);
            $projectList = [];

        }
    }
}
