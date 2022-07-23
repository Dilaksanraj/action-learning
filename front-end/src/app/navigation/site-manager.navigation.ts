import { FuseNavigation } from "@fuse/types";

export const siteManagerNavigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'EPI-PROJECT',
        type     : 'group',
        icon     : 'assets/icons/flat/png/group.png',
        children : [
            {
                id       : 'Home',
                title    : 'Dashboard',
                type     : 'item',
                icon     : 'assets/icons/flat/web-hosting/svg/021-speedometer.svg',
                url  : '/dashboard'
            },
            {
                id       : 'user',
                title    : 'User',
                type     : 'collapsable',
                icon     : 'assets/icons/flat/ui_set/custom_icons/employees.svg',
                children : [
                    {
                        id   : 'staff',
                        title: 'staff',
                        type : 'item',
                        url  : '/user'
                    },
                    {
                        id   : 'students',
                        title: 'students',
                        type : 'item',
                        url  : '/apps/dashboards/students'
                    }
                ]
            },
            {
                id       : 'invitation',
                title    : 'Invitation',
                type     : 'item',
                icon     : 'assets/icons/flat/ui_set/custom_icons/invitation2.svg',
                url  : '/invitation',
            },
            {
                id       : 'department',
                title    : 'Department',
                type     : 'item',
                icon     : 'assets/icons/flat/ui_set/e-learning/png/browser-1.png',
                url  : '/department',
            },
            {
                id       : 'intake',
                title    : 'Intake',
                type     : 'item',
                icon     : 'assets/icons/flat/ui_set/e-learning/png/certificate.png',
                url  : '/intake',
            },

            {
                id       : 'room',
                title    : 'Room',
                type     : 'item',
                icon     : 'assets/icons/flat/ui_set/custom_icons/house.svg',
                url  : '/manage-room',
            },
        ]
    },
];