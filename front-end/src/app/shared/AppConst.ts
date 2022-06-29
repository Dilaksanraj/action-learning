import {environment} from 'environments/environment';
export class AppConst {

    static readonly apiBaseUrl = environment.apiBaseUrl;

    static readonly templatePath = '/assets/templates';

    static readonly client_secret = 'JfqP2ck0gZiAo16lsXfYY9PZo6avq1EX8lxekS08';

    static readonly urlPrefix = {
        CLIENT: '',
        APP: 'portal'
    };

    static readonly auth = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        userObj: 'user_object',
        userPerms: 'user_permissions',
        currentRole: 'current_role',
        currentLevel: 'current_level',
        orgObj: 'org_object',
        language: 'lang',
        kinderConnectPath: 'kc_path'
    };

    static readonly appKeys = {
        subscriptionKey: 'active-token',
        subscriptionVerifyKey: 'verify-token',
    };

    static readonly image = {
        LOADING: '/assets/loading/magnify.svg',
        DEFAULT_LOGO: 'assets/images/logos/KMLOGO.png',
        PROFILE_CALLBACK: 'assets/images/avatars/profile.jpg',
        PROFILE_PP_CALLBACK: 'assets/icons/flat/ui_set/custom_icons/family.svg',
        PROFILE_AP_CALLBACK: 'assets/icons/flat/ui_set/custom_icons/employees.svg',
        PROFILE_ROOM_CALLBACK: 'assets/icons/flat/ui_set/custom_icons/child/room.svg',
    };

    static readonly appStart = {
        PORTAL: {
            LOGIN_URL: '/portal-login',
            DEFAULT_AUTH_URL: '/dashboard',
            NAME: 'portal'
        },
        SITE_MANAGER: {
            LOGIN_URL: '/sm-login',
            DEFAULT_AUTH_URL: '/sm-dashboard',
            NAME: 'site-manager'
        },
        CLIENT: {
            LOGIN_URL: '/login',
            DEFAULT_AUTH_URL: '/dashboard',
            DEFAULT_AUTH_PARENT_URL: '/home',
            NAME: ''
        },
        FORGOT_PASSWORD: {
            BASE_URL: '/forgot-password'
        },
        RESET_PASSWORD: {
            BASE_URL: '/reset-password'
        },
        INVITATION: {
            BASE_URL: '/invitation',
            NAME: 'invite'
        },
        PAYMENT: {
            BASE_URL: '/manage-payment',
            PAYMENT_STARTUP: 'payment-startup'
        },
        SUBSCRIPTION: {
            PAYMENT_STARTUP: '/manage-payment/payment-startup'
        },
        MARKET_PLACE: {
            BASE_URL: '/market-place',
            SUBSCRIBE_URL: '/subscribe',
            CUST_PLAN_URL: '/cust_plan',
            QUOTE_VERIFY_URL: '/quotation-verify',
            SUBSCRIBE_PAYMENT_URL: '/subscription-payment-info',
            NAME: 'marketplace'
        },
        ENQUIRY: {
            BASE_URL: '/enquiry-form',
            NAME: 'enquiry',
            EMAIL_NOTIFICATION: '0'
        },
        ENROLLMENT: {
            BASE_URL: '/enrolment-form',
            NAME: 'enrolment',
            EMAIL_NOTIFICATION: '2'
        },
        WAITLIST: {
            BASE_URL: '/waitlist-form',
            NAME: 'waitlist',
            EMAIL_NOTIFICATION: '1'
        },
        SUPPORT_LINK: 'https://epita.com.fr/support/',
        MAINTENANCE: {
            URL: '/under-maintenance'
        },
        ERROR: {
            NOT_FOUND: {
                URL: '/not-found'
            },
            SERVER_ERROR: {
                URL: '/internal-error'
            }
        },
        PASSWORD_SETUP: {
            BASE_URL: '/password',
            NAME: 'password-setup'
        },
        KISOK_SETUP: {
            BASE_URL: '/kiosk',
            NAME: 'kiosk-setup'
        },
    };

    static readonly notificationTitle = {
        SUCCESS: 'Success',
        ERROR: 'Error',
        WARNING: 'Warning',
        INFO: 'Information',
        TIPS: 'Tip'
    };

    static readonly mediaType = {
        IMAGE: 'image',
        AUDIO: 'audio',
        DOC: 'document',
        OTHERS: 'others',
        PROFILE: 'profile',
        VIDEO: 'video',
        YOUTUBE: 'youtube',
        VIMEO: 'vimeo',
    };

    static readonly modalActionTypes = {
        NEW: 'new',
        EDIT: 'edit',
        DELETE: 'delete'
    };

    static readonly modalUpdateTypes = {
        SINGLE: 'single',
        BULK: 'bulk',
    };

    static readonly dialogContent = {
        DELETE: {
            'TITLE': 'Are you sure want to delete this?',
            'BODY': 'If this was the action that you wanted to do, please confirm your choice, or cancel.'
        },
        PERMANENT_DELETE: {
            'TITLE': 'Are you sure want to delete this permanently?',
            'BODY': 'You are about to permanently delete this item. This operation can not be undone. Would you like to proceed?'
        },
        CONFIRM_EMAIL: {
            'TITLE': 'Are you sure you want to email the enrolment form to the parent?',
            'BODY': ''
        },
        CONFIRM_WAITLIST_EMAIL: {
            'TITLE': 'Are you sure you want to email the waitlist form to the parent?',
            'BODY': ''
        },
        CONFIRM_ACTIVATION: {
            'TITLE': 'Are you sure you want to activate?',
            'BODY': ''
        },
        UPDATE: {
            'TITLE': 'Are you sure want to update this?',
            'BODY': 'If this was the action that you wanted to do, please confirm your choice, or cancel.'
        },
        APP_UPDATE: {
            'TITLE': 'Updates Available',
            'BODY': 'New and improved version of updates available. please click reload to update!'
        }
    };

    static readonly payment = {
        PAYMENT_FREQUENCY: {
            OWNER: [
                // 'weekly',
                // 'fortnightly',
                'monthly',
                'quaterly',
                'annually'
            ],
            CLIENT: [
                'annually',
                'monthly'
            ]
        },
        PARENT_PAYMENT_PROVIDERS: {
            STRIPE: 'stripe',
            EZIDEBIT: 'ezidebit',
            BPAY: 'bpay'
        }
    };

    static readonly ipTrack = 'http://ip-api.com/json';

    static readonly roleLevel = {
        ROOT: 'root',
        OWNER: 'owner',
        ADMINISTRATION: 'administration',
        PARENT: 'parent'
    };

    static readonly stripeLibraryUrl = 'https://js.stripe.com/v2/';

    static readonly queryParamKeys = {
        MARKET_PLACE: {
            emailVerifyToken: 'verify-token',
            productId: 'product',
            orgId: 'org',
            quotationVerifyToken: 'quotation-token',
            subscriptionCycle: 'subscription_cycle'
        },
        ENROLMENT: {
            orgId: 'orgId'
        },
        ENQUIRY: {
            orgId: 'orgId'
        }
    };

    static readonly dateTimeFormats = {
        dateOnly: 'YYYY-MM-DD',
        time24Only: 'HH:mm:ss',
        time12Only: 'h:mm:ss A',
        dateTime: 'YYYY-MM-DD HH:mm:ss',
        yearOnly: 'YYYY',

        // others
        longDateFormat: 'MMMM Do YYYY'
    };

    static readonly timePickerSteps = {
        Default: 1,
        OPTION_5: 5,
        OPTION_15: 15,
        OPTION_30: 30,
    };

    static readonly timePickerDefaultValues = {
        START: 540,
        END: 1080
    };

    static readonly bookingTypes = [
        {
            name: 'Booked',
            value: '0'
        },
        {
            name: 'Attendance',
            value: '1'
        },
        {
            name: 'Absence',
            value: '2'
        },
        {
            name: 'Holiday',
            value: '3'
        },
        {
            name: 'Casual',
            value: '4'
        }
    ];
    
}