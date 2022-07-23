import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import * as _ from 'lodash';


import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

import { CommonHelper } from 'app/utils/common.helper';

import { UrlHelper } from 'app/utils/url.helper';
import { AuthUser } from '../model/authUser';
import { siteManagerNavigation } from 'app/navigation/site-manager.navigation';
import { FuseNavigation } from '@fuse/types';
import { staffNavigation } from 'app/navigation/staff.navigation';
import { StudentNavigation } from 'app/navigation/student.navigation';


@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    /**
     * Constructor
     * 
     * @param {NGXLogger} _logger
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {Router} _router
     */
    constructor(
        private _fuseNavigationService: FuseNavigationService,
        private _router: Router
    ) 
    {
        //
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * set app navigation
     *
     * @param {*} data
     * @returns {void}
     */
    setNavigation(data: AuthUser): void
    {
        console.log('setnavigator', data);

        // this._fuseNavigationService.unregister('main');

        let navigation: FuseNavigation[];

        if(data.hasSiteManagerAccess){

            navigation = siteManagerNavigation;
        }
        if(data.isAdministrator){
            navigation = staffNavigation;
        }
        if(data.isStudent){
            navigation = StudentNavigation;
        }
        
        // navigation found already
        if (this._fuseNavigationService.getNavigation('main') && this._fuseNavigationService.getNavigation('main').length > 0)
        {
            console.log('found');
            
            if (CommonHelper.isEqual(navigation, this._fuseNavigationService.getNavigation('main'))) { return; }

            // Unregister the navigation to the service
            this._fuseNavigationService.unregister('main');
        }

        this._fuseNavigationService.register('main',navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');
    }

    /**
     * check if route avaliable
     *
     * @param {RouterStateSnapshot} state
     * @returns {boolean}
     */
    checkCurrentRouteExists(state: RouterStateSnapshot): boolean
    {
        const url = UrlHelper.removeQueryParameters(state.url);
        
        const menus = this._fuseNavigationService.getNavigation('main') || [];
        
        return (menus && menus.length > 0 && url !== '') ? _.findIndex(this.getRouteLinks(menus), (i) => url.indexOf(i['url']) > -1) > -1 : false;
    }

    /**
     * get route details
     *
     * @param {string} navId
     * @returns {*}
     */
    getRouteObject(navId: string): any
    {
        const menus = this._fuseNavigationService.getNavigation('main') || [];

        return (menus && menus.length > 0 && this.getRouteLinks(menus).findIndex((i: { id: string; }) => i.id === navId) > -1) 
            ? this.getRouteLinks(menus).find((i: { id: string; }) => i.id === navId) 
            : null;
    }

    /**
     * get route links only
     *
     * @private
     * @param {*} list
     * @returns {*}
     */
    private getRouteLinks(list: any): any
    {
        let links = [];

        _.forEach(list, (item, index) =>
        {
            if (item.children && item.children.length > 0)
            {
                links = links.concat([...item.children]);

                _.forEach(item.children, (navItem, ind) => 
                {
                    if (navItem.children && navItem.children.length > 0)
                    {
                        links = links.concat([...navItem.children]);
                    }
                });
                
            }
            else
            {
                links.push(item);
            }
        });

        return links;
    }

    /**
     * go to child profile in a new tab
     *
     * @param {string} childId
     */
    goToChildProfileNewTab(childId: string): void
    {
        window.open(`${window.location.href.replace(window.location.pathname, '')}${this.getRouteObject('N07').url}/child/${childId}`, '_blank');
    }
}
