<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class IntakeResource extends JsonResource
{

    private $params;

    /**
     * Create a new resource instance.
     *
     * @param mixed $resource
     * @param array $params
     */
    public function __construct($resource, $params = [])
    {
        // Ensure you call the parent constructor
        parent::__construct($resource);

        $this->resource = $resource;

        $this->params = $params;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
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
                'url' => PathHelper::getBranchUrls($request->fullUrl(), $this)
            ];
        }
        else{

            $prop = [
                'id' => $this->index,
                'name' => $this->name,
                'code' => $this->code,
                'graduation_year' => $this->graduation_year
            ];
        }
        return $prop;
    }
}
