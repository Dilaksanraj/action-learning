<?php

use App\Enums\RoleType;

class EmailHelper
{
    public static function getMailTemplateProps($userType = null)
    {
        $returnData = [];

        if ($userType == RoleType::ORGADMIN)
        {
            $returnData = [
                'logo' => \ImageHelper::getProductLogo(),
                'title' => 'Welcome to ' . config('app.name'),
                'name' => config('mail.from.name')
            ];
        }
        else
        {

        }

        return $returnData;
    }

    public static function getMailTemplatePropsAppsImage($userType = null)
    {
        $returnData = [];

        if ($userType == RoleType::ORGADMIN)
        {
            $returnData = [
                'name' => config('app.name'),
            ];
        }
        else
        {

        }

        return $returnData;
    }

}
