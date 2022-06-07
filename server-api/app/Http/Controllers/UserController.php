<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\User;
use Log;
use Auth;

class UserController extends Controller
{
    public function index(){
        Log::info("controller");
        return User::all();
    }

    public function get(Request $request){
        Log::info(Auth::user()->email);
        return $request->user();
    }
}
