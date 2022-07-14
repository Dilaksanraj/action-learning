import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConst } from 'app/shared/AppConst';
import { AuthUser } from 'app/shared/model/authUser';
import { AuthService } from 'app/shared/service/auth.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeHelper } from 'app/utils/date-time.helper';
import { UrlHelper } from 'app/utils/url.helper';
import { AuthClient } from 'app/shared/model/authClient';
import { environment } from 'environments/environment';
import { DOCUMENT } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from 'app/shared/service/notification.service';
// import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'login-2',
    templateUrl: './client-login.component.html',
    styleUrls: ['./client-login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ClientLoginComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;

    clientObj: AuthClient;
    isLoading: boolean;
    autoLoginView: boolean;
    autoLoginStatus: string;
    queryParams: any;
    copyRightYear: number;
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        @Inject(DOCUMENT) private _document: any,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthService,
        private _notificationService: NotificationService,
        // private _logger: NGXLogger,
        private _router: Router
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                style: 'vertical-layout-2',
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this._unsubscribeAll = new Subject();
        this.copyRightYear = DateTimeHelper.now().year();
        this.isLoading = false;
        this.queryParams = UrlHelper.getQueryParameters();
        this.autoLoginView = Object.keys(this.queryParams).filter(i => !i).length < 1;
        this.autoLoginStatus = '0';
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.loginForm = this._formBuilder.group({
            email: [environment.production ? '' : 'dilaksan510@gmail.com', [Validators.required, Validators.email]],
            password: [environment.production ? '' : '123456', Validators.required]
        });
    }

    /**
 * On destroy
 */
    ngOnDestroy(): void {
        this._document.body.classList.remove('page-content-reset');

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    get formVal(): any
    { 
        return this.loginForm.controls; 
    }

    onSubmit(): Observable<any>
    {
        if (this.loginForm.invalid || this.isLoading) 
        {
            return;
        }

        this.isLoading = true;

        this._notificationService.clearSnackBar();

        this._authenticationService
            .login(this.formVal.email.value, this.formVal.password.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                data => this.isLoading = !data,
                error =>
                {
                    this.isLoading = false;
                    throw error;
                },
                () => console.log('😀 all good. 🍺')
                //this._logger.debug('😀 all good. 🍺')
            );

    }

    backToLoginPage(e: MouseEvent): void
    {
        e.preventDefault();

        this.autoLoginView = false;
    }


    goForgotPassword(e: MouseEvent): void
    {
        e.preventDefault();
        
        this._router.navigate(['/forgot-password'], { state: { skipGuard: '0' }});
    }


}
