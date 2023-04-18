<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
                'end_date' => $this->end_date
            ];
        }
        return $prop;
    }
}
