<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use ErrorHandler;
use DB;
use Log;
use RequestHelper;
use Helpers;
use App\Enums\ErrorType;
use App\Exceptions\System\ResourceNotFoundException;
use App\Exceptions\System\ServerErrorException;
use App\Enums\RequestType;
use LocalizationHelper;
use App\Http\Resources\IntakeResource;
use App\Http\Resources\IntakeResourceCollection;


use App\Models\Intake;


class IntakeController extends Controller
{

    public function create(Request $request){

        Log::info($request->all());
        DB::beginTransaction();
        try{

            $newObj = new Intake();
            $newObj->name = $request->input('name');
            $newObj->code = $request->input('code');
            $newObj->graduation_year = $request->input('graduation_year');

            $newObj->save();
            DB::commit();

            Log::info($newObj);

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_201,
                    LocalizationHelper::getTranslatedText('response.success_create'),
                    new IntakeResource($newObj)
                ), RequestType::CODE_201);

        }
        catch (Exception $e)
        {
            DB::rollBack();
            ErrorHandler::log($e);
        }

    }

    public function update(Request $request){

        DB::beginTransaction();
        try{

            $id = Helpers::decodeHashedID($request->input('id'));

            $rowObj = $this->findById($id);

            $rowObj->name = $request->input('name');
            $rowObj->code = $request->input('code');
            $rowObj->graduation_year = $request->input('graduation_year');

            $rowObj->update();

            DB::commit();


            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_201,
                    LocalizationHelper::getTranslatedText('response.success_update'),
                    new IntakeResource($rowObj)
                ), RequestType::CODE_201);

        }
        catch (Exception $e)
        {
            DB::rollBack();
            ErrorHandler::log($e);
        }

    }

    public function list(Request $request){

        try
        {
            $intakeList = Intake::orderBy('id', 'asc')->get();
        }
        catch (Exception $e)
        {
            ErrorHandler::log($e);

            $intakeList = [];
        }

         return (new IntakeResourceCollection($intakeList))
             ->response()
             ->setStatusCode(RequestType::CODE_200);

    }

    public function delete(Request $request){

        DB::beginTransaction();

        try
        {
            $id = Helpers::decodeHashedID($request->input('id'));

            $rowObj = $this->findById($id);

        if ($rowObj->deleted_at != null)
        {
            $rowObj->forceDelete();
        }
        else
        {
            $rowObj->delete();
        }
            DB::commit();

            return response()->json(
                RequestHelper::sendResponse(
                    RequestType::CODE_200,
                    LocalizationHelper::getTranslatedText('response.success_delete')
                ), RequestType::CODE_200);
        }
        catch (Exception $e)
        {
            DB::rollBack();

            throw new ServerErrorException($e->getMessage(), $e->getCode(), $e);
        }
    }

    public function findById($id)
    {
        $intake = Intake::where('id', $id)
            ->withTrashed()
            ->first();

        if (is_null($intake))
        {
            throw new ResourceNotFoundException('resource not found exception', ErrorType::NotFound);
        }

        return $intake;
    }

}
