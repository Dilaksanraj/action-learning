<?php

$event = '$event';

return [

    'invalid_uri' => "<h1>Link Not Available!</h1> <h3>The requested link does not represent any resource on the server.</h3> <div class=\"ui buttons mb-8\"> <button class=\"ui button\" ng-click=\"vm.goToSubscriptionForm($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUBSCRIBE\"></span> </button> <div class=\"or\"></div> <button class=\"ui positive button\" ng-click=\"vm.goToKinderm8Support($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUPPORT\"></span> </button> </div> <h3>for more enquiry contact support team.</h3>",
    'activation_link_expired' => "<h1>Link Expired!</h1> <h3>The verification link has expired. click below button to resend activation email.</h3> <div class=\"ui buttons mb-8\"> <button class=\"ui button\" ng-click=\"vm.goToSubscriptionForm($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUBSCRIBE\"></span> </button> <div class=\"or\"></div> <button class=\"ui positive button\" ng-click=\"vm.goToKinderm8Support($event)\"> <span translate=\"SUBSCRIPTION.GO_TO_SUPPORT\"></span> </button> </div> <h3>for more enquiry contact support team.</h3>",

    'code_send_successfully' => "Subscription code has been successfully sent."
];

