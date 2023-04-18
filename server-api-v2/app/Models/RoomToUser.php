<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomToUser extends Model
{

           protected $table = 'room_to_users';
    
           protected $dates = ['deleted_at'];
       

       
           protected $fillable = [
               'room_id',
               'user_id'
           ];

           protected $hidden = ['id', 'pivot'];

           protected $appends = [
               'index'
           ];
}
