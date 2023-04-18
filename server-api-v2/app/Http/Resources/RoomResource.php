<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    private $params;


    public function __construct($resource, $params = [])
    {
        // Ensure you call the parent constructor
        parent::__construct($resource);

        $this->resource = $resource;

        $this->params = $params;
    }

    public function toArray($request)
    {
        if (is_null($this->resource))
        {
            return [];
        }
        if(array_key_exists("short", $this->params) && $this->params['short'])
        {
            $prop = [
                'id' => $this->index,
                'name' => $this->name,
            ];
        }
        else{

            $prop = [
                'id' => $this->index,
                'name' => $this->name,
                'desc' => $this->desc,
                'department' => new DepartmentResource($this->department),
                'intake'=> new IntakeResource($this->intake),
                'status'=> $this->status,
                'creator'=> new UserResource($this->creator),
                'students'=> new UserResourceCollection($this->students),
                'staff'=> new UserResourceCollection($this->staff),
                'project'=> new ProjectResource($this->project),
            ];
        }
        return $prop;
    }
}
