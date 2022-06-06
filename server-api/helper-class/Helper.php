<?php

use Carbon\Carbon;
use Illuminate\Contracts\Container\BindingResolutionException;
use Kinderm8\Enums\AWSConfigType;

class Helpers
{
    public static function IsNullOrEmpty($str)
    {
        return (!isset($str) || trim($str) === '' || trim($str) === 'null');
    }

    public static function IsValidArrayInput($str)
    {
        return (!isset($str) || trim($str) === '');
    }

    public static function hxCode($value)
    {
        if(is_array($value))
        {
            return array_map(function($item) { return Hashids::encode($item); }, $value);
        }
        else
        {
            return Hashids::encode($value);
        }
    }

    public static function decodeHashedID($value)
    {
        if(is_array($value))
        {
            return array_map(function($value) { return (int) array_values(Hashids::decode($value))[0]; }, $value);
        }
        else
        {
            return (int) array_values(Hashids::decode($value))[0];
        }
    }

    /**
     * @param string $name
     * @param string $option [AWSConfigType]
     * @return string]
     */
    public static function getConfig(string $name, string $option): string
    {
        $key = $option . (app()->environment('production') ? '' : '_dev');

        return config(trim(strtolower("aws.${key}.${name}")));
    }

    public static function generateToken()
    {
        return hash_hmac('sha256', Str::random(40), config('app.key'));
    }

    /**
     * Retrieves the best guess of the client's actual IP address.
     * Takes into account numerous HTTP proxy headers due to variations
     * in how different ISPs handle IP addresses in headers between hops.
     */
    public static function get_ip_address()
    {
        // check for shared internet/ISP IP
        if (!empty($_SERVER['HTTP_CLIENT_IP']) && self::validate_ip($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }

        // check for IPs passing through proxies
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // check if multiple ips exist in var
            if (strpos($_SERVER['HTTP_X_FORWARDED_FOR'], ',') !== false) {
                $iplist = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
                foreach ($iplist as $ip) {
                    if (self::validate_ip($ip))
                        return $ip;
                }
            } else {
                if (self::validate_ip($_SERVER['HTTP_X_FORWARDED_FOR']))
                    return $_SERVER['HTTP_X_FORWARDED_FOR'];
            }
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED']) && self::validate_ip($_SERVER['HTTP_X_FORWARDED']))
            return $_SERVER['HTTP_X_FORWARDED'];
        if (!empty($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']) && self::validate_ip($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']))
            return $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
        if (!empty($_SERVER['HTTP_FORWARDED_FOR']) && self::validate_ip($_SERVER['HTTP_FORWARDED_FOR']))
            return $_SERVER['HTTP_FORWARDED_FOR'];
        if (!empty($_SERVER['HTTP_FORWARDED']) && self::validate_ip($_SERVER['HTTP_FORWARDED']))
            return $_SERVER['HTTP_FORWARDED'];

        // return unreliable ip since all else failed
        return $_SERVER['REMOTE_ADDR'];
    }

    /**
     * Ensures an ip address is both a valid IP and does not fall within
     * a private network range.
     */
    public static function validate_ip($ip)
    {
        if (strtolower($ip) === 'unknown')
            return false;

        // generate ipv4 network address
        $ip = ip2long($ip);

        // if the ip is set and not equivalent to 255.255.255.255
        if ($ip !== false && $ip !== -1) {
            // make sure to get unsigned long representation of ip
            // due to discrepancies between 32 and 64 bit OSes and
            // signed numbers (ints default to signed in PHP)
            $ip = sprintf('%u', $ip);
            // do private network range checking
            if ($ip >= 0 && $ip <= 50331647) return false;
            if ($ip >= 167772160 && $ip <= 184549375) return false;
            if ($ip >= 2130706432 && $ip <= 2147483647) return false;
            if ($ip >= 2851995648 && $ip <= 2852061183) return false;
            if ($ip >= 2886729728 && $ip <= 2887778303) return false;
            if ($ip >= 3221225984 && $ip <= 3221226239) return false;
            if ($ip >= 3232235520 && $ip <= 3232301055) return false;
            if ($ip >= 4294967040) return false;
        }

        return true;
    }

    /**
     * @param $dayarray
     * @return string
     */
    public static function arraytoSqlSting($dayarray)
    {
        $date_Sqlstring = "";

        for ($i=0; $i < count($dayarray); $i++)
        {
            $date_Sqlstring .= ($i == count($dayarray)-1) ? "'". $dayarray[$i] ."'" : "'". $dayarray[$i] ."', ";
        }

        return $date_Sqlstring;
    }

    /**
     * generate unique uuid
     * @return string
     */
    public static function generateSerialCode()
    {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',

                // 32 bits for "time_low"
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),

                // 16 bits for "time_mid"
                mt_rand(0, 0xffff),

                // 16 bits for "time_hi_and_version",
                // four most significant bits holds version number 4
                mt_rand(0, 0x0fff) | 0x4000,

                // 16 bits, 8 bits for "clk_seq_hi_res",
                // 8 bits for "clk_seq_low",
                // two most significant bits holds zero and one for variant DCE1.1
                mt_rand(0, 0x3fff) | 0x8000,

                // 48 bits for "node"
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)

            ) . "-" . Carbon::now()->timestamp;
    }

    /**
     * generate random string
     *
     * @param int $length
     * @param bool $noserial
     * @return string
     */
    public static function generateRandomString($length = 10, $noserial = true)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        if ($noserial) {
            return 'KM8_' . $randomString;
        } else {
            return $randomString . Carbon::now()->timestamp;
        }
    }

    /**
     * @return string
     */
    public static function getAttrId()
    {
        return uniqid(rand() . 'cattr.', true);
    }

    public static function removeJsScripts($string)
    {
        return preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $string);
    }

    public static function is_html($string)
    {
        return preg_match("/<[^<]+>/", $string) != 0;
    }

    /**
     * clear input string
     *
     * @param $value
     * @param bool $removeHtmlTags
     * @return null|string
     */
    public static function sanitizeInputString($value, $removeHtmlTags = false)
    {
        //clear all scripts
        $value = Helpers::removeJsScripts($value);

        return ($removeHtmlTags) ? strip_tags($value) : $value;
    }

    public static function filter_by_key_array($array, $member, $value)
    {
        for ($i=0; $i < count($array); $i++)
        {
            if(isset($array[$i][$member]) && $array[$i][$member] == $value)
            {
                return array(
                    'key' => $i,
                    'data' => $array[$i]
                );

                break;
            }
        }
        return null;
    }

    public static function searchArrayForValue($array, $key, $value)
    {
        $results = array();

        if (is_array($array))
        {
            if (isset($array[$key]) && $array[$key] == $value)
            {
                $results[] = $array;
            }

            foreach ($array as $subarray)
            {
                $results = array_merge($results, self::searchArrayForValue($subarray, $key, $value));
            }
        }

        return $results;
    }

    public static function arrayDeepMerge($default, $specific)
    {
        foreach($specific as $key=>$val)
        {
            if(isset($default[$key]))
            {
                if(!is_array($default[$key]))
                {
                    $default[$key] = $val;
                }
                elseif(array_keys($default[$key]) === range(0, count($default[$key]) - 1))
                {
                    $default[$key] = array_unique(array_merge($default[$key], $val));
                }
                else
                {
                    $default[$key] = self::arrayDeepMerge($default[$key], $val);
                }
            }
            else
            {
                $default[$key] = $val;
            }
        }

        return $default;
    }

    /**
     * Groups an array by a given key.
     *
     * Groups an array into arrays by a given key, or set of keys, shared between all array members.
     *
     * Based on {@author Jake Zatecky}'s {@link https://github.com/jakezatecky/array_group_by array_group_by()} function.
     * This variant allows $key to be closures.
     *
     * @param array $array   The array to have grouping performed on.
     * @param mixed $key,... The key to group or split by. Can be a _string_,
     *                       an _integer_, a _float_, or a _callable_.
     *
     *                       If the key is a callback, it must return
     *                       a valid key from the array.
     *
     *                       If the key is _NULL_, the iterated element is skipped.
     *
     *                       ```
     *                       string|int callback ( mixed $item )
     *                       ```
     *
     * @return array|null Returns a multidimensional array or `null` if `$key` is invalid.
     */
    public static function array_group_by(array $array, $key)
    {
        if (!is_string($key) && !is_int($key) && !is_float($key) && !is_callable($key) )
        {
            trigger_error('array_group_by(): The key should be a string, an integer, or a callback', E_USER_ERROR);
            return null;
        }

        $func = (!is_string($key) && is_callable($key) ? $key : null);
        $_key = $key;

        // Load the new array, splitting by the target key
        $grouped = [];
        foreach ($array as $value)
        {
            $key = null;

            if (is_callable($func))
            {
                $key = call_user_func($func, $value);
            }
            elseif (is_object($value) && property_exists($value, $_key))
            {
                $key = $value->{$_key};
            }
            elseif (isset($value[$_key]))
            {
                $key = $value[$_key];
            }

            if ($key === null)
            {
                continue;
            }

            $grouped[$key][] = $value;
        }

        // Recursively build a nested grouping if more parameters are supplied
        // Each grouped array value is grouped according to the next sequential key
        if (func_num_args() > 2)
        {
            $args = func_get_args();

            foreach ($grouped as $key => $value)
            {
                $params = array_merge([ $value ], array_slice($args, 2, func_num_args()));
                $grouped[$key] = call_user_func_array('array_group_by', $params);
            }
        }

        return $grouped;
    }

    /**
     * Returns an array with the differences between $array1 and $array2
     *
     * @param $array1
     * @param $array2
     * @return array
     */
    public static function compareArrays($array1, $array2)
    {
        $result = array();

        foreach ($array1 as $key => $value)
        {
            if (!is_array($array2) || !array_key_exists($key, $array2))
            {
                $result[$key] = $value;
                continue;
            }

            if (is_array($value))
            {
                $recursiveArrayDiff = static::compareArrays($value, $array2[$key]);

                if (count($recursiveArrayDiff))
                {
                    $result[$key] = $recursiveArrayDiff;
                }

                continue;
            }

            if ($value != $array2[$key])
            {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * remove duplicate from multidimensional array
     * @param $array
     * @return array
     */
    public static function uniqueMulti($array)
    {
        if(is_null($array))
        {
            return [];
        }

        return array_map("unserialize", array_unique(array_map("serialize", $array)));
    }

    /**
     * Return array of constants for a class
     *
     * @param string $class Class name
     * @param null|string $prefix Prefix like e.g. "KEY_"
     * @param boolean $assoc Return associative array with constant name as key
     * @param array $exclude Array of excluding values
     * @return array Assoc array of constants
     */
    public static function getConstants($class, $prefix = null, $assoc = false, $exclude = [])
    {
        $values = [];

        try
        {
            $reflector = new ReflectionClass($class);
            $constants = $reflector->getConstants();

            foreach($constants as $constant => $value)
            {
                if (($prefix && strpos($constant, $prefix) !==false) || $prefix === null)
                {
                    if(in_array($value, $exclude))
                    {
                        continue;
                    }

                    if($assoc)
                    {
                        $values[$constant] = $value;
                    }
                    else
                    {
                        $values[] = $value;
                    }
                }
            }
        }
        catch(ReflectionException $e)
        {
            ErrorHandler::log($e);
        }

        return $values;
    }

    /**
     * @param $array
     * @param $column
     * @param int $direction
     */
    public static function array_sort_by_column(&$array, $column, $direction = SORT_ASC)
    {
        $reference_array = array();

        foreach($array as $key => $row)
        {
            $reference_array[$key] = $row[$column];
        }

        array_multisort($reference_array, $direction, $array);
    }

    /**
     * @param $array1
     * @param $array2
     * @return array
     */
    public static function array_diff_assoc_recursive($array1, $array2)
    {
        foreach($array1 as $key => $value)
        {
            if(is_array($value))
            {
                if(!isset($array2[$key]))
                {
                    $difference[$key] = $value;
                }
                elseif(!is_array($array2[$key]))
                {
                    $difference[$key] = $value;
                }
                else
                {
                    $new_diff = self::array_diff_assoc_recursive($value, $array2[$key]);

                    if($new_diff != FALSE)
                    {
                        $difference[$key] = $new_diff;
                    }
                }
            }
            elseif(!isset($array2[$key]) || $array2[$key] != $value)
            {
                $difference[$key] = $value;
            }
        }
        return !isset($difference) ? [] : $difference;
    }

    /**
     * Returns an pincode
     *
     * @param integer $digits
     * @param string $user_model
     * @param $organization_id
     * @return string
     * @throws BindingResolutionException
     */
    public static function generatePinCode($digits, $user_model, $organization_id)
    {
        $pinCodeList = array();

        $org_users = app()->make("Kinderm8\\{$user_model}")
            ->where('organization_id', '=', $organization_id)
            ->where('pincode', '!=', null)->get();

        foreach ($org_users as $user)
        {
            array_push($pinCodeList, $user['pincode']);
        }

        $x = 0;
        while($x < 50)
        {
            $generated_pin_code = rand(pow(10, $digits-1), pow(10, $digits)-1);

            if(!in_array($generated_pin_code, $pinCodeList))
            {
                return $generated_pin_code;
            }

            $x++;
        }

        return null;
    }

    public static function getJsonDecodeError()
    {
        switch (json_last_error())
        {
            case JSON_ERROR_NONE:
                $error = 'No errors';
                break;
            case JSON_ERROR_DEPTH:
                $error = 'Maximum stack depth exceeded';
                break;
            case JSON_ERROR_STATE_MISMATCH:
                $error = 'Underflow or the modes mismatch';
                break;
            case JSON_ERROR_CTRL_CHAR:
                $error = 'Unexpected control character found';
                break;
            case JSON_ERROR_SYNTAX:
                $error = 'Syntax error, malformed JSON';
                break;
            case JSON_ERROR_UTF8:
                $error = 'Malformed UTF-8 characters, possibly incorrectly encoded';
                break;
            case JSON_ERROR_RECURSION:
                $error = 'One or more recursive references in the value to be encoded';
                break;
            case JSON_ERROR_INF_OR_NAN:
                $error = 'One or more NAN or INF values in the value to be encoded';
                break;
            case JSON_ERROR_UNSUPPORTED_TYPE:
                $error = 'A value of a type that cannot be encoded was given';
                break;
            case JSON_ERROR_INVALID_PROPERTY_NAME:
                $error = 'A property name that cannot be encoded was given';
                break;
            case JSON_ERROR_UTF16:
                $error = 'Malformed UTF-16 characters, possibly incorrectly encoded';
                break;
            default:
                $error = 'Unknown error';
                break;
        }

        return $error;
    }

    public static function getSign($n)
    {
        /**
         * Positive 1
         * Negative -1
         * Zero 0
         */
        return ($n > 0) - ($n < 0);
    }
}
