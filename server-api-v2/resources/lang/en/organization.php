<?php

$event = '$event';

return [

    'invalid_uri' => "<h1>Link Not Available!</h1> <h3>The requested link does not represent any resource on the server.</h3> <div class=\"ui buttons mb-8\"> <button type=\"button\" class=\"ui button\" ng-click=\"vm.goToSubscriptionForm($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUBSCRIBE\"></span> </button> <div class=\"or\"></div> <button type=\"button\" class=\"ui positive button\" ng-click=\"vm.goToKinderm8Support($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUPPORT\"></span> </button> </div> <h3>for more enquiry contact support team.</h3>",
    'activation_link_expired' => "<h1>Link Expired!</h1> <h3>The verification link has expired. click below button to resend activation email.</h3> <div class=\"ui buttons mb-8\"> <button type=\"button\" class=\"ui button\" ng-click=\"vm.goToSubscriptionForm($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUBSCRIBE\"></span> </button> <div class=\"or\"></div> <button type=\"button\" class=\"ui positive button\" ng-click=\"vm.goToKinderm8Support($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUPPORT\"></span> </button> </div> <h3>for more enquiry contact support team.</h3>",
    'activation_success' => "<h1>Activation Completed!</h1> <h3>Your account has been successfully activated. Thank you for activating your account. You will shortly recieve an email that contains your login details.</h3> <button type=\"button\" class=\"ui positive button mb-8\" ng-click=\"vm.goToSiteManager($event)\"> <span translate=\"SUBSCRIPTION.START_MANAGER\"></span> </button> <h3>If you require help logging in please contact us.</h3>",

    'branch_access_linked' => 'Branch access successfully updated.',
    'admin_role_not_found' => 'Administrator role not found.'
];
