import {environment} from 'environments/environment';
export class AppConst {

    static readonly apiBaseUrl = environment.apiBaseUrl;

    static readonly templatePath = '/assets/templates';

    static readonly urlPrefix = {
        CLIENT: '',
        APP: 'portal'
    };
    
}