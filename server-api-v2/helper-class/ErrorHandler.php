<?php

use Carbon\Carbon;

class ErrorHandler
{
    const CUSTOM_ERROR = "custom-exception";
    const CUSTOM_ERROR_CODE = 101;

    public static function log(Exception $e)
    {
        try
        {
            Log::error($e);
        }
        catch(Exception $err)
        {
             Log::error($err);
        }
    }

}
