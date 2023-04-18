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
use App\Models\Project;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\ProjectResourceCollection;


class ProjectController extends Controller
{
    public function create(Request $request){

        DB::beginTransaction();

        try {

            $projectObj = new Project();
            $projectObj->name = $request->input('name');
            $projectObj->desc = $request->input('desc');
            $projectObj->end_date = $request->input('end_date');

            $projectObj->save();

            DB::commit();

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_201,
                    LocalizationHelper::getTranslatedText('response.success_create'),
                    new ProjectResource($projectObj)
                ), RequestType::CODE_201);

        }
        catch(Exception $e){

            DB::rollBack();
            ErrorHandler::log($e);

        }
    }

    public function update(Request $request){

        DB::beginTransaction();

        try {

            $projectObj = $this->findById(Helpers::decodeHashedID($request->input('id')));
            $projectObj->name = $request->input('name');
            $projectObj->desc = $request->input('desc');
            $projectObj->end_date = $request->input('end_date');

            $projectObj->update();

            DB::commit();

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_201,
                    LocalizationHelper::getTranslatedText('response.success_update'),
                    new ProjectResource($projectObj)
                ), RequestType::CODE_201);

        }
        catch(Exception $e){

            DB::rollBack();
            ErrorHandler::log($e);

        }
    }

    public function delete(Request $request){

        DB::beginTransaction();

        try {

            $projectObj = $this->findById(Helpers::decodeHashedID($request->input('id')));
            
        if ($projectObj->deleted_at != null)
        {
            $projectObj->forceDelete();
        }
        else
        {
            $projectObj->delete();
        }

            $projectObj->delete();

            DB::commit();

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_200,
                    LocalizationHelper::getTranslatedText('response.success_delete')
                ), RequestType::CODE_200);

        }
        catch(Exception $e){

            DB::rollBack();
            ErrorHandler::log($e);

        }
    }

    public function list(Request $request){


        try {

            $projectList = Project::orderBy('id', 'asc')->get();
            
            return (new ProjectResourceCollection($projectList))
             ->response()
             ->setStatusCode(RequestType::CODE_200);

        }
        catch(Exception $e){

            DB::rollBack();
            ErrorHandler::log($e);
            $projectList = [];

        }
    }

    public function findById($id)
    {
        $project = Project::where('id', $id)
            ->withTrashed()
            ->first();

        if (is_null($project))
        {
            throw new ResourceNotFoundException('resource not found exception', ErrorType::NotFound);
        }

        return $project;
    }
}
