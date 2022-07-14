<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'failed' => 'These credentials do not match our records.',
    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',

    'invalid_credentials' => 'The user name or password you entered is not correct. please try again.',
    'invalid_pincode' => 'The pincode you entered is not correct. please try again.',
    'invalid_phone' => 'The Mobile Number you entered is not correct. please try again.',
    'invalid_email' => 'The Email you entered is not correct. please try again.',
    'invalid_qr_code' => 'The QR code you scan is not correct. please try again.',
    'user_does_not_have_role' => 'You do not have access to the account.',
    'user_does_not_have_permission' => 'Currently you don\'t have any permission to access this system.',
    'unauthorized_user' => 'Authentication error! please contact the support for further details.',
    'user_not_exists' => 'Your user account or request is associated with a client which does not exist in the system.',
    'invalid_user' => 'invalid user.',
    'user_inactive' => 'The specified account is inactive.',
    'user_does_not_have_login_access' => 'User doesn\'t have login access to this site.',
    'token_create_error' => 'Could not create token.',
    'token_not_provided' => 'Invalid authorization.',
    'token_invalid' => 'Invalid token.',
    'token_expired' => 'Your session has expired. please login to continue.',
    'refresh_token_missing' => 'Refresh token not found.',
    'jwt_unhandled_exception' => 'Failed to get token from origin.',
    'logout_success' => 'You\'ve been logged out successfully!',
    'email_exists' => 'This email already exist.',
    'user_email_not_verified' => 'You have not yet verified your email address. please check your inbox.',
    'verify_email_error' => 'Subscription code not found. please contact support team : <br> <a href="" target="_blank"></a>.',

    'forgot_password_success' => 'An email has been sent to the address you have provided. Please follow the link in the email to complete your password reset request.',
    'forgot_password_error' => 'The email address you entered is incorrect or the account does not exist.',

    'reset_password_token_invalid' => 'Password reset link is not valid or expired please request another one.',
    'reset_password_success' => 'Password update successful! You can now login to your account with the new password.',
    'reset_password_error' => 'Something went wrong while resetting the password.',
    'reset_password_parent_hint' => 'Your password for all the childcare services will be changed.',
    'reset_password_administrative_hint' => 'Password will be changes for all the branches you are registered with.',

    'password_reset_success' => 'Password reset successfully'
];
