<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Http\Resources\IntakeResource;

class IntakeResourceCollection extends ResourceCollection
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
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if (is_null($this->resource) || empty($this->resource) || is_null($this->collection))
        {
            return [];
        }

        $this->collection->transform(function ($data)
        {
            return (new IntakeResource($data, $this->params));
        });

        return parent::toArray($request);
    }
}
