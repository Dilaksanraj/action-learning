import { Injectable, Inject } from '@angular/core';
import { DOCUMENT, WeekDay } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Observable, BehaviorSubject, ReplaySubject, Subject, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, map, shareReplay } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

// import { NGXLogger } from 'ngx-logger';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../service/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AppConst } from '../AppConst';
import { updateScrollPosition } from '../enum/update-scroll-position';
import { WeekSelectorProp } from '../interface/week-selector';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    // Vertical Layout 1 scroll directive
    verticalLayout1ScrollDirective: BehaviorSubject<FusePerfectScrollbarDirective | null>;

    // Externally loaded libraries at runtime
    private _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

    // update parent scroll from child
    _updateParentScroll: Subject<any>;

    // update api progress bar
    onApiProgressBarChanged: Subject<any>;

    // main page animation
    onPageViewAnimationChange: Subject<boolean>;

    // children without primary payer
    onChildListChanged: BehaviorSubject<any>;

    // children without immunization
    onReminderChanged: BehaviorSubject<any>;

    /**
     * Constructor
     * 
    //  * @param {NGXLogger} _logger
     * @param {HttpClient} _httpClient
     * @param {AuthService} _authService
     * @param {MatDialog} _dialog
     * @param {FuseSidebarService} _sidebar
     * @param {Title} _titleService
     * @param {*} document
     */
    constructor(
        // private _logger: NGXLogger,
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _dialog: MatDialog,
        private _sidebar: FuseSidebarService,
        private _titleService: Title,
        @Inject(DOCUMENT) private readonly document: any
    )
    {
        this._updateParentScroll = new Subject();
        this.onApiProgressBarChanged = new Subject();
        this.onPageViewAnimationChange = new Subject();
        this.onChildListChanged = new BehaviorSubject([]);
        this.onReminderChanged = new BehaviorSubject(false);

        this.verticalLayout1ScrollDirective = new BehaviorSubject(null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dynamic set page titles 
     *
     * @param {string} newTitle
     */
    setPageTitle(newTitle: string): void
    { 
        this._titleService.setTitle(newTitle); 
    }

    /**
     * Get country list
     *
     * @returns {Promise<any>}
     * @memberof CommonService
     */
    getCountries(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>('assets/data/countries/data.json')
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
        });
    }

    /**
     * Get timezone list
     *
     * @returns {Promise<any>}
     * @memberof CommonService
     */
    getTimeZones(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>('assets/data/timezone/data.json')
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
        });
    }

    /**
     * get state list
     *
     * @returns {Promise<any>}
     * @memberof CommonService
     */
    getSates(): Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._httpClient
                .get<any>('assets/data/states/state.json')
                .pipe(
                    map(response => response.data),
                    shareReplay()
                )
                .subscribe(
                    (response: any) => resolve(response),
                    reject
                );
        });
    }

    /**
     * get global date time formats
     *
     * @param {number} [option=0]
     * @returns {Array<string>}
     */
    getValidDateTimeFormats(option: string = 'date'): Array<string>
    {
        const dateFormats = [ 'YYYY-MM-DD', 'YY-MM-DD', 'MM-DD-YYYY', 'MM-DD-YY' ];

        const timeFormats = [ 'hh:mm:ss A', 'hh:mm A' ];

        return option === 'date' ? dateFormats : timeFormats;
    }

    /**
     * check if value exists
     *
     * @param {string} value
     * @param {string} prop
     * @returns {Observable<boolean>}
     * @memberof CommonService
     */
    isValueExists(value: string, type: string = '', index: string = ''): Observable<boolean>
    {
        const params = new HttpParams()
            .set('value', value)
            .set('type', type)
            .set('id', index);
        
        return this._httpClient
            .get<any>(`${AppConst.apiBaseUrl}/value-exists`, { params })
            .pipe(
                map(response => response.data),
                shareReplay()
            );
    }

    /**
     * close all matDialogs
     *
     * @memberof CommonService
     */
    closeAllModels(): void
    {
        this._dialog.closeAll();
    }

    /**
     * close all side bars
     *
     * @memberof CommonService
     */
    closeMainNavBars(): void
    {
        if (this._sidebar.getSidebar('navbar'))
        {
            this._sidebar.getSidebar('navbar').close();
        }
    }

    /**
     * update content scroll bar
     *
     * @param {FusePerfectScrollbarDirective} directiveScroll
     * @param {updateScrollPosition} [position]
     * @param {number} [speed]
     * @param {number} [offset]
     * @memberof CommonService
     */
    updateScrollBar(directiveScroll: FusePerfectScrollbarDirective, position?: updateScrollPosition, speed?: number, offset?: number): void
    {
        speed = speed || 400;

        offset = offset || 0;

        position = position || updateScrollPosition.TOP;

        if (directiveScroll)
        {
            setTimeout(() =>
            {
                switch (position)
                {
                    case updateScrollPosition.TOP:
                        directiveScroll.scrollToTop(0, speed);
                        break;
                    
                    case updateScrollPosition.BOTTOM:
                        directiveScroll.scrollToBottom(0, speed);
                        break;
                    
                    case updateScrollPosition.LEFT:
                        directiveScroll.scrollToLeft(0, speed);
                        break;
                    
                    case updateScrollPosition.RIGHT:
                        directiveScroll.scrollToRight(0, speed);
                        break;
                
                    default:
                        break;
                }

                // directiveScroll.update();
            });
        }
    }

    /**
     * Get city states of country
     * @param {string} country
     * @returns {Promise}
     */
    getCityStates(country: string): Promise<any>
    {    
        return new Promise((resolve, reject) => {

            const params = new HttpParams().set('country', country);

            this._httpClient
                .get<any>(`${AppConst.apiBaseUrl}/country-states`, { params })
                .pipe(
                    map((response) => response.data.states),
                    shareReplay()
                )
                .subscribe(
                    (response) => resolve(response),
                    reject
                );
        });
    }
    
    /**
     * Load script in runtime
     * @param {string} url
     * @returns {Observable}
     */
    loadScript(url: string): Observable<any>
    {
        if (this._loadedLibraries[url])
        {
            return this._loadedLibraries[url].asObservable();
        }

        this._loadedLibraries[url] = new ReplaySubject();

        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = url;
        script.onload = () => {
            this._loadedLibraries[url].next();
            this._loadedLibraries[url].complete();
        };

        this.document.body.appendChild(script);

        return this._loadedLibraries[url].asObservable();
    }

    /**
     * Load style in runtime
     * @param {string} url
     * @returns {Observable}
     */
    loadStyle(url: string): Observable<any>
    {
        if (this._loadedLibraries[url])
        {
            return this._loadedLibraries[url].asObservable();
        }

        this._loadedLibraries[url] = new ReplaySubject();

        const style = this.document.createElement('link');
        style.type = 'text/css';
        style.href = url;
        style.rel = 'stylesheet';
        style.onload = () => {
            this._loadedLibraries[url].next();
            this._loadedLibraries[url].complete();
        };

        const head = document.getElementsByTagName('head')[0];
        head.appendChild(style);

        return this._loadedLibraries[url].asObservable();
    }

    /**
     * get week days list
     *
     * @param {boolean} [hideWeekEnd=false]
     * @returns {object[]}
     */
    getWeekDays(prop: WeekSelectorProp = null): object[]
    {
        const list = [];

        let weekdays = moment.weekdays();

        if (prop && prop.weekStartsAt > 0)
        {
            const removedItem = _.slice(weekdays, 0, prop.weekStartsAt);

            weekdays.splice(0, prop.weekStartsAt);

            weekdays = _.concat(weekdays, removedItem);
        }

        if (prop && prop.hideWeekEnd)
        {
            _.remove(weekdays, (day: string) => _.indexOf(['sunday', 'saturday'], _.lowerCase(day)) > -1);
        }

        for (const [ index, value ] of weekdays.entries()) 
        {
            list.push({
                index: index,
                name: value,
                enable: true,
                weekend: _.indexOf(['sunday', 'saturday'], _.lowerCase(value)) > -1
            });
        }

        return list;
    }

    getReminders(): Observable<any> {

        if (this._authService.isAuthenticated() && this._authService.isAdministrative()) {

            this.onReminderChanged.next(true);

        } else {
            return of(null);
        }

    }
}
