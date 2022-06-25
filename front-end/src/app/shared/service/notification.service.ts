import { Injectable } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NotifyType } from '../enum/notify-type.enum';
import { NotifyMessageType } from '../enum/notify-message.enum';
import { NzConfigService } from 'ng-zorro-antd';
import { NzNotifyPosition } from '../enum/nz-notify-position.enum';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    /**
     * Constructor
     * 
     * @param {NGXLogger} _logger
     * @param {NzMessageService} _message
     * @param {NzNotificationService} _notify
     * @param {NzConfigService} _configService
     */
    constructor(
        private _message: NzMessageService,
        private _notify: NzNotificationService,
        private _configService: NzConfigService 
    )
    { 
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Display global messages
     * 
     * @param {String} message 
     * @param {NotifyType} type 
     * @param {Number} timeout 
     */
    displaySnackBar(message: string, type: NotifyType, timeout: number = 3000): void
    {
        setTimeout(() => 
        {
            this._message[type](message, 
                {
                    nzDuration: timeout
                });
        }, 200);
    }

    /**
     * remove all global messages
     */
    clearSnackBar(): void
    {
        this._message.remove();
    }

    /**
     * Display a notification message globally
     *
     * @param {string} title
     * @param {string} content
     * @param {NotifyMessageType} type
     * @param {number} [timeout=5000] milliseconds
     * @param {NzNotifyPosition} [position=NzNotifyPosition.TOP_RIGHT]
     * @param {*} [data={}]
     */
    displayNotification(
        title: string, 
        content: string, 
        type: NotifyMessageType, 
        timeout: number = 5000, 
        position: NzNotifyPosition = NzNotifyPosition.TOP_RIGHT,
        data: any = {}): void
    {
        this._configService.set('notification', {
            nzPlacement: position
        });

        this._notify.blank(
            title,
            content, 
            {
                nzClass: 'n-msg-' + type,
                nzDuration: timeout,
                nzData: data
            });
    }

    /**
     * remove all notification message globally
     */
    clearNotification(): void
    {
        this._notify.remove();
    }
}
