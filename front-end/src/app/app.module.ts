import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { fuseConfig } from 'app/fuse-config';
import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';
// import { LoggerModule, NgxLoggerLevel, NGXLogger } from 'ngx-logger';
import { environment } from 'environments/environment';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { APP_ROUTES } from './app.routes';
import { CustomPreloading } from './shared/CustomPreloading';
// import { NgxWebstorageModule, StrategyCacheService, StrategyIndex } from 'ngx-webstorage';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './shared/service/auth.service';
import { catchError, finalize, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { HttpErrorInterceptor } from './shared/interceptor/http-error.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from './main/common/common.module';
// import { HttpErrorInterceptor } from './shared/interceptor/http-error.interceptor';
// import { NgxWebstorageModule, StrategyIndex, StrategyCacheService } from 'ngx-webstorage';
registerLocaleData(en);

export function appInitFactory(injector: Injector): any
{
    return () =>
    {
        return new Promise<any>(async (resolve, reject) =>
        {
            
            const _authService = injector.get(AuthService);

           
            
            // check for auth user
            if (_authService.isAuthenticated())
            {
                const service = _authService
                    .getAuthUserData()
                    .pipe(
                        take(1),
                        catchError(err => 
                        {
                            
                            _authService.clearAuthUser();

                            return of(null);
                        }),
                        finalize(() => 
                        {
                            // unsubscribe
                            service.unsubscribe();

                            setTimeout(() => resolve(null), 250);
                        })
                    )
                    .subscribe(data => 
                    {                        
                        if (data && data != null)
                        {
                            _authService.authInitialSetup(Object.assign({}, data));
                        }
                    });
            }
            else
            {
                resolve(null);
            }
        });
    };
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(APP_ROUTES,{preloadingStrategy: CustomPreloading}),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatDialogModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppStoreModule,
        NgZorroAntdModule,
        FormsModule,

        CommonModule
        
        // LoggerModule.forRoot({
        //     serverLoggingUrl: '/api/logs',
        //     level: NgxLoggerLevel.DEBUG,
        //     serverLogLevel: NgxLoggerLevel.ERROR
        //   }),
        //   NgxWebstorageModule.forRoot(),

        // NgxWebstorageModule.forRoot({ prefix: 'prefix name here', separator: '-' })
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US },
        CustomPreloading,
        // StrategyIndex,
        // StrategyCacheService,
        CookieService,
        // {
        //     provide: APP_INITIALIZER,
        //     useFactory: appInitFactory,
        //     deps: [Injector],
        //     multi: true
        // },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },

        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
    ]
})
export class AppModule
{
}
