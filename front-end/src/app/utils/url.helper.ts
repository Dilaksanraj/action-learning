import * as _ from 'lodash';
import { AppConst } from 'app/shared/AppConst';
import { environment } from 'environments/environment';

export class UrlHelper {

    static readonly initialUrl = location.href;

    static readonly ccsPrefix = 'ccs-';

    static getQueryParameters(): any
    {
        // tslint:disable-next-line: typedef
        return document.location.search.replace(/(^\?)/, '').split('&').map(function(n: any) { return n = n.split('='), this[n[0]] = n[1], this; }.bind({}))[0];
    }

    static removeQueryParameters(url: string): string
    {
        return url.indexOf('?') > -1 ? url.substring(0, url.indexOf('?')) : url;
    }

    static getRootPath(): boolean
    {
        return document.location.pathname === '/';
    }

    static extractTenantNameFromUrl(baseUrl: string): string
    {
        baseUrl = this.processBaseUrl(baseUrl);

        if (this.isSubdomainPresent(baseUrl)) 
        {
            const urlParts = baseUrl.split('.');

            // return urlParts.filter(i => _.lowerCase(i) === 'ccs').length > 0 ? urlParts[1] : _.head(urlParts);

            return _.replace(_.head(urlParts), this.ccsPrefix, '');
        } 
        else 
        {
            return null;
        }
    }

    static isAppRunningLocally(): boolean
    {
        return !environment.production;
    }

    static isSubdomainPresent(baseUrl: string): boolean
    {
        if (this.isAppRunningLocally()) 
        {
            return baseUrl.split('.').length > 1;
        } 
        else 
        {
            return baseUrl.split('.').length > 2;
        }
    }

    static processBaseUrl(baseUrl: string): string
    {
        if (baseUrl.indexOf(':') > -1) 
        {
            baseUrl = this.removePortFromUrl(baseUrl);
        }

        return baseUrl;
    }

    static removePortFromUrl(baseUrl: string): string
    {
        return baseUrl = baseUrl.split(':')[0];
    }

}
