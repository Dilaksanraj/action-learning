<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exceptions\System\ServerErrorException;
use \App\Models\User;
use Exception;
use Log;
use Auth;

class IntakeController extends Controller
{
    public function create(Request $request){

        try{

            Log::info(Auth::user()->email);
        }
        catch(Exception $e){

            throw new ServerErrorException($e->getMessage(), $e->getCode(), $e);
        }
        
    }
}
