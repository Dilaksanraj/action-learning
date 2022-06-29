<?php

class RequestHelper
{
    public static function sendResponse($statusCode, $message = null, $data = null)
    {
        $return = [
            'code' => $statusCode,
            'message' => $message,
        ];

        if(!is_null($data))
        {
            if(is_object($data) && get_class($data) === 'Illuminate\Validation\Validator')
            {
                $return['errors'] = $data->errors();
            }
            else
            {
                $return['data'] = $data;
            }
        }

        return $return;
    }

    /**
     * get domain from url
     * @return mixed
     */
    public static function getDomain()
    {
        $items = parse_url(self::getformatHeaderRequest()['referer']);
        $subdomain = explode('.', $items['host'])[0];
        return $subdomain;
    }

    /**
     * get organization id from request header
     * @return array|int|null
     */
    public static function getOrgId()
    {
        try
        {
            return !Helpers::IsNullOrEmpty(self::getformatHeaderRequest()['client-ref']) ? Helpers::decodeHashedID(self::getformatHeaderRequest()['client-ref']) : null;
        }
        catch (Exception $e)
        {
            return null;
        }
    }

    /**
     * get branch id from request header
     * @return array|int|null
     */
    public static function getBranchId()
    {
        try
        {
            return !Helpers::IsNullOrEmpty(self::getformatHeaderRequest()['client']) ? Helpers::decodeHashedID(self::getformatHeaderRequest()['client']) : null;
        }
        catch (Exception $e)
        {
            return null;
        }
    }

    public static function getformatHeaderRequest()
    {
        return array_change_key_case(getallheaders(), CASE_LOWER);
    }
}
