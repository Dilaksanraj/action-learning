import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { PreloadingStrategy, Route } from '@angular/router';

@Injectable()
export class CustomPreloading implements PreloadingStrategy
{
    /**
     * Constructor
     *
     * @param {NGXLogger} _logger
     */
    constructor() { }
    
    preload(route: Route, load: () => Observable<any>): Observable<any>
    {
        if (route.data && route.data['preload'])
        {
            // this._logger.debug('Preloaded: ' + route.path);
            
            return load();
        }
        else
        {
            return EMPTY;
        }
    }
}
