<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class ErrorType extends Enum
{
    const NotFound = 00404; // resource not found

    const CustomValidationErrorCode = 10404; // resource not found
}
