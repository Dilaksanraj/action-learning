<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class RequestType extends Enum
{
    const CODE_200 = 200;   // request ok
    const CODE_201 = 201;   // created

    const CODE_204 = 204;   // no content dont use
    const CODE_400 = 400;	// Bad request (something wrong with URL or parameters)
    const CODE_401 = 401;	// Not authorized (not logged in)
    const CODE_403 = 403;	// Logged in but access to requested area is forbidden
    const CODE_404 = 404;	// Not Found (page or other resource doesn’t exist)
    const CODE_405 = 405;   // The request type is not allowed
    const CODE_422 = 422;	// Unprocessable Entity (validation failed)
    const CODE_429 = 429;   // Too many attempts
    const CODE_500 = 500;   // General server error
    const CODE_503 = 503;   // On maintenance mode

    const ACTION_TYPE_NEW = 'new';
    const ACTION_TYPE_EDIT = 'edit';
    const ACTION_TYPE_DELETE = 'delete';
}
