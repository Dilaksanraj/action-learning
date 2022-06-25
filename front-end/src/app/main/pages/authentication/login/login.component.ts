import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/shared/service/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConst } from 'app/shared/AppConst';
import { result } from 'lodash';
import { AuthUser } from './model/AuthUser.medel';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    isLoading: boolean = false;
    user:AuthUser

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthService,
        private _httpClient: HttpClient,
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]]
        });
    }

    submit(){
        const formData = this.loginForm.getRawValue();

        const data = {
            username: formData.email,
            password: formData.password,
            grant_type: 'password',
            client_id: 2,
            client_secret: AppConst.client_secret,
            scope: '*'
        }

        this._httpClient.post(`${AppConst.apiBaseUrl}/oauth/token`, data)
        .subscribe((result:any)=> {
            localStorage.setItem('access_token', result.access_token);
            localStorage.setItem('refresh_token', result.refresh_token);

            // get user using access token
            this._authenticationService.getAuthUser()
            .subscribe(data => {
                console.log(data);
            });

        },
        error => {
            console.log('error');
        }
        )
        
    }

    setUser(){

        const header = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        });
        this._httpClient.get(`${AppConst.apiBaseUrl}/api/user`, {headers:header})
        .subscribe(
            result=>{

                this.user = new AuthUser(result);
                
                
            }
        );

    }

    ngOnDestroy(): void
    {

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
