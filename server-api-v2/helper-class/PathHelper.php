<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class PathHelper
{

    public static function getProductionPath()
    {
        return config('app.production_path');
    }

    public static function isDevelopmentEnv()
    {
        return (!in_array($_SERVER['REMOTE_ADDR'], array('127.0.0.1','::1'))) ? false : true;
    }

    public static function getDevelopmentPort($url)
    {
        try
        {
            return parse_url($url)['port'];
        }
        catch (Exception $r)
        {
            return '4200';
        }
    }

    public static function getPortalPath($url)
    {
        $result = parse_url($url);

        if (self::isDevelopmentEnv())
        {
            return $result['scheme'] . "://portal.localhost:" . self::getDevelopmentPort($url) . "/";
        }
        else
        {
            return $result['scheme'] . "://portal." . self::getProductionPath() . "/";
        }
    }

    public static function getUserInvitationPath($url, $token)
    {
        $result = parse_url($url);

        return $result['scheme']. ((self::isDevelopmentEnv()) ? 'localhost:' . self::getDevelopmentPort($url) : self::getProductionPath()) . '/invitation-auth?token=' . $token;
    }


    public static function getUserPasswordSetupInvitationPath($url, $token)
    {
        $result = parse_url($url);

        return $result['scheme'] . '://password-setup.' . ((self::isDevelopmentEnv()) ? 'localhost:' . self::getDevelopmentPort($url) : self::getProductionPath()) . '/password?id=' . $token;
    }

    public static function getForgotPasswordLink(string $url, Model $user, string $token)
    {
        $result = parse_url($url);
        $link = $result['scheme'] . '://'. ((self::isDevelopmentEnv()) ? 'localhost:' . self::getDevelopmentPort($url) : self::getProductionPath());

        return $link . '/reset-password?token=' . $token . '&ref=' . $user->index;
    }

}
