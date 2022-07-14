import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
// import { NgxWebstorageModule, StrategyIndex, StrategyCacheService } from 'ngx-webstorage';
registerLocaleData(en);

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
    ]
})
export class AppModule
{
}
