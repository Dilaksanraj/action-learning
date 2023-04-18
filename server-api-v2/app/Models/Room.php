<?php

namespace App\Models;

use Helpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory;

    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'rooms';


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'desc',
        'project_id',
        'intake_id',
        'created_by'
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id'
    ];

        /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'index'
    ];

    public function getIndexAttribute()
    {
        return ($this->attributes['id'] != null) ? Helpers::hxCode($this->attributes['id']) : $this->attributes['id'];
    }

    public function department()
    {
        return $this->belongsTo(Department::class)->withTrashed();
    }

    public function intake()
    {
        return $this->belongsTo(Intake::class)->withTrashed();
    }

    public function project()
    {
        return $this->belongsTo(Project::class)->withTrashed();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by')->withTrashed();
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'room_to_users')->withTrashed();
    }

    public function staff()
    {
        return $this->belongsToMany(User::class, 'room_to_users')->withTrashed();
    }

}
