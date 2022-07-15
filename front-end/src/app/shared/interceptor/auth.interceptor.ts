import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    /**
     * Constructor
     *
	 * @param {AuthService} _authService
     */
    constructor(
        private _authService: AuthService,
    ) 
    { 
        //
    }
    
    /**
     * request interceptor
     *
     * @param {HttpRequest<any>} request
     * @param {HttpHandler} next
     * @returns {Observable<HttpEvent<any>>}
     * @memberof AuthInterceptor
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
    {
        request = request.clone({ 
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Auth-Client': 'WEBC',
                'Content-Language': 'en'
            }),
            withCredentials: false
        });


        // attach tokens
        const ignorePath = (!/\.html/.test(request.url)
            && request.url.substr(request.url.length - 5) !== '.json'
            && request.url.substr(request.url.length - 4) !== '.svg');

        const isApiUrl = request.url.startsWith(environment.apiBaseUrl);

        if (this._authService.isAuthenticated())
        {
            request = request.clone({
                setHeaders: {
                    'Authorization': this._authService.getBearerToken(),
                    'Refresh-Token': this._authService.getRefreshToken()
                }
            });
        }

        return next.handle(request);
    }
}
