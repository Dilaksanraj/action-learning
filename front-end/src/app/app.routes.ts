import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [

    {
        path        : 'apps',
        loadChildren: './main/apps/apps.module#AppsModule'
    },
    {
        path        : 'pages',
        loadChildren: './main/pages/pages.module#PagesModule'
    },
    {
        path        : 'ui',
        loadChildren: './main/ui/ui.module#UIModule'
    },
    {
        path        : 'documentation',
        loadChildren: './main/documentation/documentation.module#DocumentationModule'
    },
    {
        path      : 'home',
        loadChildren: './main/module/home/home.module#HomeModule'
    },
    {
        path        : 'angular-material-elements',
        loadChildren: './main/angular-material-elements/angular-material-elements.module#AngularMaterialElementsModule'
    },

    {
        path: 'auth',
        loadChildren: ()=>import('./main/common/common.module').then(m=> m.CommonModule)
    },
    {
        path: 'dashboard',
        loadChildren: ()=>import('./main/module/dashboard/dashboard.module').then(m=> m.DashboardModule) //'./main/module/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'user',
        loadChildren: ()=>import('./main/module/user/user.module').then(m=> m.UserModule) //'./main/module/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'maintenance',
        loadChildren: ()=>import('./main/common/public/maintenance/maintenance').then(m=> m.MaintenanceModulee) //'./main/module/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'coming-soon',
        loadChildren: ()=>import('./main/common/public/coming-soon/coming-soon.module').then(m=> m.ComingSoonModule) //'./main/module/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'invitation',
        loadChildren: ()=>import('./main/module/invitation/invitation.module').then(m=> m.InvitationModule) //'./main/module/dashboard/dashboard.module#DashboardModule'
    },
    
    {
        path      : '**',
        redirectTo: 'apps/dashboards/analytics'
    }
];
