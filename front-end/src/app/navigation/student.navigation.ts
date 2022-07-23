import { FuseNavigation } from "@fuse/types";

export const StudentNavigation: FuseNavigation[] = [
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
                id       : 'Project',
                title    : 'Project',
                type     : 'item',
                icon     : 'assets/icons/flat/ui_set/custom_icons/house.svg',
                url  : '/manage-room',
            },
        ]
    },
];