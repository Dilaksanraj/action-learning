import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, shareReplay, take, distinctUntilChanged, finalize } from 'rxjs/operators';

import * as _ from 'lodash';

// import { NGXLogger } from 'ngx-logger';

import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from './notification.service';
import { NavigationService } from './navigation.service';

import { AuthUser } from '../model/authUser';
import { AuthClient } from '../model/authClient';
import { AppConst } from '../AppConst';
import { UrlHelper } from 'app/utils/url.helper';
import { CommonHelper } from 'app/utils/common.helper';
import { NotifyType } from '../enum/notify-type.enum';
// import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
// import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly appStartPaths: string[] = [
        AppConst.appStart.PORTAL.LOGIN_URL,
        AppConst.appStart.SITE_MANAGER.LOGIN_URL,
        AppConst.appStart.CLIENT.LOGIN_URL,
        //
        AppConst.appStart.INVITATION.BASE_URL,
        AppConst.appStart.MARKET_PLACE.BASE_URL,
        AppConst.appStart.ENQUIRY.BASE_URL,
        AppConst.appStart.ENQUIRY.BASE_URL,
        AppConst.appStart.ENROLLMENT.BASE_URL,
        AppConst.appStart.MARKET_PLACE.SUBSCRIBE_URL,
        AppConst.appStart.MARKET_PLACE.CUST_PLAN_URL,
        AppConst.appStart.MARKET_PLACE.QUOTE_VERIFY_URL,
        AppConst.appStart.PASSWORD_SETUP.BASE_URL,
        
    ];

    private readonly ignoredPaths = [
        AppConst.appStart.ERROR.NOT_FOUND.URL,
        AppConst.appStart.ERROR.SERVER_ERROR.URL,
        AppConst.appStart.MAINTENANCE.URL,
        AppConst.appStart.FORGOT_PASSWORD.BASE_URL,
        AppConst.appStart.RESET_PASSWORD.BASE_URL,
        AppConst.appStart.KISOK_SETUP.BASE_URL
    ];
    
    public readonly _domain = UrlHelper.extractTenantNameFromUrl(location.host);

    private currentUserSubject: BehaviorSubject<AuthUser>;
    public currentUser: Observable<AuthUser>;
    
    /**
     * Constructor
     * 
     * @param {HttpClient} _httpClient
     * @param {Router} _router
     * @param {NotificationService} _notify
     * @param {NGXLogger} _logger
     * @param {CookieService} _cookieService
     * @param {NavigationService} _navService
     */
    constructor(
        private _httpClient: HttpClient,
        private _router: Router,
        private _notify: NotificationService,
        private _cookieService: CookieService,
        private _navService: NavigationService,
        // private _localStorage: LocalStorageService,
        // private _sessionStorage: SessionStorageService,
    ) 
    { 		
        // Set defaults
        this.currentUserSubject = new BehaviorSubject<any>(this._cookieService.get('user'));

        this.currentUser = this.currentUserSubject;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * login user
     *
     * @param {string} _email
     * @param {string} _password
     * @returns {Observable<boolean>}
     */
     login(_email: string, _password: string): Observable<boolean>
     {

         return this._httpClient
             .post<any>(`${AppConst.apiBaseUrl}/login`, { email: _email, password: _password })
             .pipe(
                 map(response => response.data),
                 tap(response => this.updateTokens(response)),
                 tap(response => this.resolveDefaultPath()),
                 shareReplay(),
             );
     }



    /**
     * logout user
     *
     * @returns {Observable<boolean>}
     */
    logout(): Observable<boolean>
    {
        return this._httpClient
            .get<any>(`${AppConst.apiBaseUrl}/logout`, {})
            .pipe(
                tap(() => this.clearAuthUser()),
                tap((response: any) => this._notify.displaySnackBar(response.message, NotifyType.SUCCESS)),
                map(() => true),
                shareReplay()
            );
    }

    /**
     * get user object
     *
     * @returns {Observable<any>}
     */
    getAuthUserData(): Observable<any>
    {
        const header = new HttpHeaders({
            Authorization: `Bearer ${this.getAccessToken()}`
        });
        return this._httpClient
            .get<any>(`${AppConst.apiBaseUrl}/auth_user`, {headers: header})
            .pipe(
                map(response => response),
                shareReplay()
            );
    }

    getAuthUser(): Observable<any>
    {
        return this._httpClient
            .get<any>(`${AppConst.apiBaseUrl}/auth_user`, {})
            .pipe(
                map(response => response.data),
                shareReplay()
            );
    }


    /**
     * get current user object
     *
     * @readonly
     * @type {AuthUser}
     */
    get currentUserValue(): AuthUser 
    {
        return this.currentUserSubject.value;
    }
    
    setAccessToken(token: string): void
    {
        try
        {
            console.log(token);
            
            this._cookieService.set(AppConst.auth.accessToken, token, undefined, '/');
        }
        catch (err)
        {
            throw err;
        }
    }

    getAccessToken(): string 
    {
        return this._cookieService.get(AppConst.auth.accessToken);
    }

    getRefreshToken(): string 
    {
        return this._cookieService.get(AppConst.auth.refreshToken);
    }

    setRefreshToken(token: string): void
    {
        try
        {
            this._cookieService.set(AppConst.auth.refreshToken, token, undefined, '/');
        }
        catch (err)
        {
            throw err;
        }
    }

    getBearerToken(): string 
    {
        return 'Bearer ' + this.getAccessToken();
    }

    updateTokens(response: any): boolean
    {
        let successState = false;
        console.log(response.access_token);
        

        try
        {
            if (response && response.access_token && response.refresh_token) 
            {
                this.setAccessToken(response.access_token);

                this.setRefreshToken(response.refresh_token);

                successState = true;
            }
        }
        catch (error)
        {
            CommonHelper.errorLog(error);
        }

        
        return successState;
    }

    getClaimsFromToken(): object
    {
        const token = this.getAccessToken();
        
        let user = {};

        if (typeof token !== 'undefined')
        {
            user = JSON.parse(CommonHelper.urlBase64Decode(token.split('.')[1]));
        }

        return user;
    }

    authInitialSetup(response: any): void
    {
        console.log('[auth object size]', CommonHelper.getSizeOf(response, true));

        // set user navigation menu
        this._navService.setNavigation(response);


        // remove permissions && menu items
        delete response.permissions;
        delete response.navigators;

        // set user data
        this.setUser(response);
    }

    setUser(response: any): void
    {

        try
        {
            if (response) 
            {
                response = new AuthUser(response);

                // this._localStorage.store(AppConst.auth.userObj, JSON.stringify(response));
            }
            else
            {
                response = null;	
            }
        }
        catch (err)
        {
            CommonHelper.errorLog(err);

            response = null;
        }

        this.currentUserSubject.next(response);
    }

    clearUser(): void
    {
        // this._localStorage.clear(AppConst.auth.userObj);
    }

    clearAuthUser(): void
    {
        this._cookieService.delete(AppConst.auth.accessToken, '/');
        this._cookieService.delete(AppConst.auth.refreshToken, '/');

        this.clearUser();

        setTimeout(() => this.currentUserSubject.next(null), 50);
    }

    isAuthenticated(): boolean
    {
        return !!this.getAccessToken();
    }

    isAuthActive(): boolean
    {
        return (this.currentUserValue) ? this.currentUserValue.status : false;
    }

    hasActivePaymentMethod(): boolean 
    {        
        return (this.currentUserValue) ? this.currentUserValue.hasPaymentMethod : false;
    }

    isAdmin(): boolean
    {
        try 
        {
            return (this.isAuthenticated()) ? _.indexOf(this.currentUserValue.level, AppConst.roleLevel.ROOT) > -1 : false;
        } 
        catch (err) 
        {
            return false;
        }
    }

    isOwner(): boolean
    {
        try 
        {
            return (this.isAuthenticated()) ? _.indexOf(this.currentUserValue.level, AppConst.roleLevel.OWNER) > -1 : false;
        } 
        catch (err) 
        {
            return false;
        }
    }

    isAdministrative(): boolean
    {
        try 
        {
            return (this.isAuthenticated()) ? _.indexOf(this.currentUserValue.level, AppConst.roleLevel.ADMINISTRATION) > -1 : false;
        } 
        catch (err) 
        {
            return false;
        }
    }

    hasAdminRights(): boolean
    {
        return this.isAdministrative() && this.currentUserValue.isAdministrator;
    }

    getUserLevel(): string
    {
        if (this.isAdmin())
        {
            return AppConst.roleLevel.ROOT;
        }
        else if (this.isOwner())
        {
            return AppConst.roleLevel.OWNER;
        }
        else if (this.isAdministrative())
        {
            return AppConst.roleLevel.ADMINISTRATION;
        }
        else
        {
            return 'none';
        }
    }

    /*--------------------------------------------------------------*/
    /*------------------------ Resolve path ------------------------*/
    /*--------------------------------------------------------------*/

    resolvePath(): void
    {
        (this.isAuthenticated()) ? this.resolveDefaultPath() : this.resolveUnauthorizedPath();
    }

    resolveDefaultPath(): void
    {

        this._router.navigate([AppConst.appStart.PORTAL.DEFAULT_AUTH_URL], {
                    replaceUrl: true
                });
    }

    resolveUnauthorizedPath(): void
    {
        this._router.navigate(['auth/login']);
    }

    resolveUnauthorizedUrl(url: string): void
    {
        if (this._domain === AppConst.appStart.PORTAL.NAME && url === AppConst.appStart.PORTAL.LOGIN_URL || 
            this._domain === AppConst.appStart.SITE_MANAGER.NAME && url === AppConst.appStart.SITE_MANAGER.LOGIN_URL ||
            this._domain === AppConst.appStart.ENQUIRY.NAME && url === AppConst.appStart.ENQUIRY.BASE_URL ||
            this._domain === AppConst.appStart.ENROLLMENT.NAME && url === AppConst.appStart.ENROLLMENT.BASE_URL ||
            this._domain === AppConst.appStart.INVITATION.NAME && UrlHelper.removeQueryParameters(url) === AppConst.appStart.INVITATION.BASE_URL ||
            this._domain === AppConst.appStart.MARKET_PLACE.NAME && url === AppConst.appStart.MARKET_PLACE.BASE_URL ||
            this._domain === AppConst.appStart.MARKET_PLACE.NAME && UrlHelper.removeQueryParameters(url) === AppConst.appStart.MARKET_PLACE.SUBSCRIBE_URL ||
            this._domain === AppConst.appStart.MARKET_PLACE.NAME && UrlHelper.removeQueryParameters(url) === AppConst.appStart.MARKET_PLACE.SUBSCRIBE_PAYMENT_URL ||
            this._domain === AppConst.appStart.MARKET_PLACE.NAME && UrlHelper.removeQueryParameters(url) === AppConst.appStart.MARKET_PLACE.CUST_PLAN_URL ||
            this._domain === AppConst.appStart.MARKET_PLACE.NAME && UrlHelper.removeQueryParameters(url) === AppConst.appStart.MARKET_PLACE.QUOTE_VERIFY_URL ||
            this._domain === AppConst.appStart.PASSWORD_SETUP.NAME && UrlHelper.removeQueryParameters(url) === AppConst.appStart.PASSWORD_SETUP.BASE_URL ||
            
            this._domain === AppConst.appStart.ENROLLMENT.NAME && UrlHelper.removeQueryParameters(url) === AppConst.appStart.ENROLLMENT.BASE_URL ||
            (this.isClientPath() && UrlHelper.removeQueryParameters(url) === AppConst.appStart.ENROLLMENT.BASE_URL) ||
            UrlHelper.removeQueryParameters(url) === AppConst.appStart.CLIENT.LOGIN_URL
            && this.isClientPath())
        {
            return;
        }

        this.resolveUnauthorizedPath();
    }

    isAccessiblePath(path: string): boolean
    {
        return _.indexOf(this.appStartPaths, path) > -1;
    }

    isIgnoredPath(path: string): boolean
    {
        path = UrlHelper.removeQueryParameters(path);

        return _.indexOf(this.ignoredPaths, path) > -1;
    }

    goToMaintenance(): void
    {
        this._router.navigate([AppConst.appStart.MAINTENANCE.URL]);
    }

    gotToErrorPage(): void 
    {
        this._router.navigate([AppConst.appStart.ERROR.NOT_FOUND.URL]);
    }

    isOwnerPath(): boolean
    {
        try
        {
            return (!_.isNull(this._domain)
                && this._domain !== ''
                && this._domain === AppConst.appStart.SITE_MANAGER.NAME);
        }
        catch (error)
        {
            throw error;
        }
    }

    isClientPath(): boolean
    {
        try
        {
            return (!_.isNull(this._domain)
                && this._domain !== ''
                && (this._domain !== AppConst.appStart.PORTAL.NAME
                    && this._domain !== AppConst.appStart.SITE_MANAGER.NAME
                    && this._domain !== AppConst.appStart.INVITATION.NAME
                    && this._domain !== AppConst.appStart.PASSWORD_SETUP.NAME
                    && this._domain !== AppConst.appStart.MARKET_PLACE.NAME
                    && this._domain !== AppConst.appStart.ENQUIRY.NAME
                    && this._domain !== AppConst.appStart.ENROLLMENT.NAME));
        }
        catch (error)
        {
            throw error;
        }
    }

    isEndUserPath(): boolean
    {
        try
        {
            return this.isClientPath() && _.indexOf(this.currentUserValue.level, AppConst.roleLevel.PARENT) > -1;
        }
        catch (error)
        {
            throw error;
        }
    }

}
