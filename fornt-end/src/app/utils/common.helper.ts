
import sizeof from 'object-sizeof';

import * as _ from 'lodash';
import * as _isEqual from 'fast-deep-equal';

import { environment } from 'environments/environment';

export class CommonHelper 
{
    public static $log(txt: string, value: any): void
    {
        if (!environment.production)
        {
            console.log('%c ' + txt + ' ' + value, 'background: #673AB7; color: #fff');
        }
    }

    public static errorLog(msg: string, txt: string = null): void
    {
        if (_.isNull(txt))
        {
            console.error(msg);
        }
        else
        {
            console.error(txt, msg);
        }
    }

    public static getSizeOf(value: any, ignore: boolean = false): string
    {
        return (!ignore) ? this.formatByteSize(sizeof(value)) : sizeof(value) + ' bytes';
    }

    public static formatByteSize(bytes: number): string
    {
        if (bytes < 1024) { return bytes + ' bytes'; }
        else if (bytes < 1048576) { return(bytes / 1024).toFixed(3) + ' KiB'; }
        else if (bytes < 1073741824) { return(bytes / 1048576).toFixed(3) + ' MiB'; }
        else { return(bytes / 1073741824).toFixed(3) + ' GiB'; }
    }

    public static isEqualJson(first: any, second: any): boolean
    {
        return _.isEqual(JSON.stringify(first), JSON.stringify(second));
    }

    public static isEqual(value: any, other: any): boolean
    {
        return _isEqual(value, other);
    }

    public static generatePassword(passwordLength: number = 10): string
    {
        const options = [
            {
                'id': 'lowercase',
                'library': 'abcdefghijklmnopqrstuvwxyz',
            },
            {
                'id': 'uppercase',
                'library': 'ABCDEFGHIJKLMNOPWRSTUVWXYZ',
            },
            {
                'id': 'numbers',
                'library': '0123456789',
            },
            {
                'id': 'symbols',
                'library': '!@#$%^&*-_=+\\|:;\',.\<>/?~',
            }
        ];
        
        const dictionary: Array<string> = [].concat(
            options[0].library.split(''),
            options[1].library.split(''),
            options[2].library.split(''),
            options[3].library.split('')
        );

        let newPassword = '';

        for (let i = 0; i < passwordLength; i++)
        {
            newPassword += dictionary[Math.floor(Math.random() * dictionary.length)];
        }

        return newPassword;
    }

    public static urlBase64Decode(str: string): any
    {
        let output = str.replace('-', '+').replace('_', '/');

        switch (output.length % 4)
        {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw new Error('Illegal base64url string!');
        }

        return window.atob(output);
    }

    public static multiPropsFilter = (items: any, filters: any) => 
    {
        const filterKeys = Object.keys(filters);

        return items.filter((item: any) => 
        {
            return filterKeys.every(key => 
            {
                if (!filters[key].length) return true;

                if (Array.isArray(item[key])) 
                {
                    return item[key].some(keyEle => filters[key].includes(keyEle));
                }
                    
                return filters[key].includes(item[key]);
            });
        });
    };


    public static forceReload(): void
    {
        // window.location.href = window.location.href
        // window.location.replace(window.location.href)
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = location.href;

        document.body.appendChild(form);

        form.submit();
    }
}
