<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class RoomResourceCollection extends ResourceCollection
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
        if (is_null($this->resource) || empty($this->resource) || is_null($this->collection))
        {
            return [];
        }

        $this->collection->transform(function ($data)
        {
            return (new RoomResource($data, $this->params));
        });

        return parent::toArray($request);
    }
}