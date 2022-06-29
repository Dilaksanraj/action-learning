<?php

class LocalizationHelper
{
    public static function getTranslatedText($value)
    {
        if (Lang::has($value))
        {
            $string = Lang::get($value);
        }
        else
        {
            $string = (Lang::has($value, config('fallback_locale')))
                ? Lang::get($value, array(), config('fallback_locale'))
                : 'Language not found (' . $value . ')';
        }

        return $string;
    }
}
