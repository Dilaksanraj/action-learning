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
    Route::get('logout', 'App\Http\Controllers\ApiAuthController@logout');



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

    
    // common routes

    //Check if value exists
    Route::group(['middleware' =>['auth:api']], function () {

        Route::get('/value-exists', 'App\Http\Controllers\CommonController@checkValueExists')->name('check-value-exists');
        
    });

    Route::group(['middleware' => ['auth:api', 'api_auth_user']], function () {
        Route::get('/auth_user', 'App\Http\Controllers\ApiAuthController@getUser')->name('get-auth-user-info');
    });

    
    

    
    
   });

//    Route::group(['prefix' => 'v1', 'middleware' => ['auth.user']], function () {

//     Route::get('adjustment-item-list', 'AdjustmentItemController@list')
//          ->middleware('permission:child-access')
//         ->name('adjustment-item-list');

//     Route::post('adjustment-item-create', 'AdjustmentItemController@create')
//         ->name('adjustment-item-create');

//     Route::post('adjustment-item-update', 'AdjustmentItemController@update')
//         ->name('adjustment-item-update');

//     Route::post('adjustment-item-delete', 'AdjustmentItemController@delete')
//         ->name('adjustment-item-delete');

// });


   
   


