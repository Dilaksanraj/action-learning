import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import * as _ from 'lodash';

// import { NGXLogger } from 'ngx-logger';

import { AuthService } from '../service/auth.service';

@Injectable()
export class RefreshTokenCheckerInterceptor implements HttpInterceptor {

    /**
     * Constructor
     *
	 * @param {NGXLogger} _logger
     */
    constructor(
        // private _logger: NGXLogger,
        private _authService: AuthService
    )
    { 

    }

    /**
     * check if refresh token on response or error
     *
     * @param {HttpRequest<any>} request
     * @param {HttpHandler} next
     * @returns {Observable<HttpEvent<any>>}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        return next
            .handle(request)
            .pipe(tap(
                (event: HttpEvent<any>) => 
                {
                    if (event instanceof HttpResponse) 
                    {
                        this.checkForRefreshToken(event);
                    }
                },
                (error: HttpErrorResponse) => this.checkForRefreshToken(error)
            ));
    }

    /**
     * update if new tokens found
     *
     * @private
     * @param {HttpEvent<any>} event
     * @returns {HttpEvent<any>}
     */
    private checkForRefreshToken(event: any): void
    {
        if (event instanceof HttpResponse || event instanceof HttpErrorResponse)
        {
            if (event.headers.has('Authorization') && event.headers.has('Refresh-Token'))
            {
                const token = _.trim(event.headers.get('Authorization').replace('Bearer ', ''));
                const refresh = _.trim(event.headers.get('Refresh-Token'));

                // this._logger.debug('[tokens]', token + '|' + refresh);
                
                if (token !== this._authService.getAccessToken() && refresh !== this._authService.getRefreshToken())
                {
                    this._authService.updateTokens({ 'access_token': token, 'refresh_token': refresh });
                }
            }
        }
    }
}
