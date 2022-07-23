<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    private $params;


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
        if(array_key_exists("isAuth", $this->params) && $this->params['isAuth'])
        {
            $prop = [
                'id' => $this->index,
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'email' => $this->email,
                'dob' => $this->dob,
                'phone' => $this->phone,
                'address_1' => $this->address_1,
                'type'=>$this->type
            ];
        }
        else{

            $prop = [
                'id' => $this->index,
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'email' => $this->email,
                'dob' => $this->dob,
                'phone' => $this->phone,
                'address_1' => $this->address_1,
                'type'=>$this->type
            ];
        }
        return $prop;
    }
}
