<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function(){

    Route::post('login', 'App\Http\Controllers\ApiAuthController@login');
    Route::post('register', 'App\Http\Controllers\ApiAuthController@register');

    // verify invitation
    Route::get('/auth_verify_invitation', 'App\Http\Controllers\InvitationController@verifyInvitation')
    ->name('verify-client-invitation');

    Route::post('/auth_accept_invitation', 'App\Http\Controllers\InvitationController@acceptInvitation')
    ->name('accept-client-invitation');
    

    //this is only for auth user
    Route::group(['middleware' => ['auth:api']], function () {

    //auth_user_routes
    Route::get('/auth_user', 'App\Http\Controllers\ApiAuthController@getUser')->name('get-auth-user-info');
    Route::get('logout', 'App\Http\Controllers\ApiAuthController@logout');

    // get all staff only
    Route::get('/get-all-staff', 'App\Http\Controllers\UserController@getAllStaff')->name('get-all-staff');

    // get all students only
    Route::get('/get-all-student', 'App\Http\Controllers\UserController@getAllStudent')->name('get-all-student');
    
    // common routes
    Route::get('/value-exists', 'App\Http\Controllers\CommonController@checkValueExists')->name('check-value-exists');

    // Intake routes
    Route::post('create-intake', 'App\Http\Controllers\IntakeController@create')
    ->name('create-intake');

    Route::get('get-intake-list', 'App\Http\Controllers\IntakeController@list')
    ->name('get-intake-list');

    Route::delete('delete-intake', 'App\Http\Controllers\IntakeController@delete')
    ->name('delete-intake');

    Route::post('update-intake', 'App\Http\Controllers\IntakeController@update')
    ->name('update-intake');


    // department routes
    Route::post('create-department', 'App\Http\Controllers\DepartmentController@create')
    ->name('create-department');

    Route::get('get-department-list', 'App\Http\Controllers\DepartmentController@list')
    ->name('get-department-list');

    Route::delete('delete-department', 'App\Http\Controllers\DepartmentController@delete')
    ->name('delete-department');

    Route::post('update-department', 'App\Http\Controllers\DepartmentController@update')
    ->name('update-department');

    // invitation routes
    Route::post('/create-invitation', 'App\Http\Controllers\InvitationController@create')
    ->name('create-invitation');

    Route::get('get-invitation-list', 'App\Http\Controllers\InvitationController@list')
    ->name('get-invitation-list');


    // Project routes
    
    Route::post('/create-project', 'App\Http\Controllers\ProjectController@create')
    ->name('create-project');

    Route::get('get-project-list', 'App\Http\Controllers\ProjectController@list')
    ->name('get-project-list');

    Route::post('update-project', 'App\Http\Controllers\ProjectController@update')
    ->name('update-project');

    Route::delete('delete-project', 'App\Http\Controllers\ProjectController@delete')
    ->name('delete-project');

    // room routes
    Route::post('/create-room', 'App\Http\Controllers\RoomController@create')
    ->name('create-room');

    
    Route::get('get-room-list', 'App\Http\Controllers\RoomController@list')
    ->name('get-room-list');

    });

   });


   
   


