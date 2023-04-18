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
                id: 'project',
                title: 'Project',
                type: 'item',
                icon: 'assets/icons/flat/ui_set/concentration/svg/009-clipboard.svg',
                url: '/manage-project',
            },
        ]
    },
];