<?php

return [

    'ezidebit_reference_undefined' => 'Ezidebit Reference Undefined',

    //ezidebit error codes
    '1' => 'You must provide a value for the ‘DigitalKey’ parameter.',
    '2' => 'You must provide a value for either the ‘EziDebitCustomerID’ parameter or the ‘YourSystemReference’ parameter.',
    '102' => 'Invalid DigitalKey.',
    '201' => 'Please fill the form in order to proceed.',
    '1000' => 'Ezidebit Reference Undefined',
    '12364' => 'Customer not Active',

    //stripe error codes
    '1001' => 'Stripe Token Undefined',
    '1002' => 'Card Error',
    '1003' => 'Request Limit Reached',
    '1004' => 'Invalid Request',
    '1005' => 'Authentication Error',
    '1006' => 'API Connection Error',

    'card_ending_in' => 'Card ending in',
    'account_ending_in' => 'Account ending in',
    'cash_payment' => 'Cash Payment',
    'expires_on' => 'Expires on',


    'delete_active_payment_method' => 'Cannot delete default payement method, make another payment method as default and try deleting again.',
    'payment_method_not_found' => 'There are no active payment methods, please add a payment method',
    'invoice_paid_success' => 'Invoice paid successfully',
    'invoice_paid_fail' => 'Invoice payment failed',

    'parent_payment_providers_missing' => 'Payment providers not found. Please contact center administrator',
    'parent_statement_emailed' => 'Parent statement will be emailed shortly',
    'parent_statement_not_found' => 'No statements found',

    'parent_payment_balance_adjustment_not_allowed' => 'Account transactions are present for this user, please use the financial adjustment for chaning balance',
    'financial_adjustment_reversed' => 'Adjustment reversed sucessfully',

    'parent_payment_scheduled_ok' => 'Payment scheduled',
    'parent_payment_refund_success' => 'Refund Success',

    'parent_ezidebit_mail_sent' => 'Ezidebit eDDR form link emailed successfully',
    'parent_payment_method_synced' => 'Payment method synced successfully',
    'parent_payment_status_synced' => 'Payment status will be updated shortly, please check the status after few minutes',
    'booking_transaction_invoke' => 'Booking fees and CCS estimates will be synced with account transactions shortly, please check transactions after few minutes',
    'fee_waived_off' => 'Waive gap fee done successfully'
];
