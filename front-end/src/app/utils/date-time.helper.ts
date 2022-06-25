import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import 'moment-timezone';

import { AppConst } from 'app/shared/AppConst';

export class DateTimeHelper {

    public static now(format: string = null): any
    {
        return _.isNull(format) ? moment() : moment().format(format);
    }

    public static thisWeek(): { start: any, end: any }
    {
        return {
            start: this.now().startOf('isoWeek'),
            end: this.now().endOf('isoWeek')
        }
    }

    public static isSameOrBefore(start: any, end: any): boolean
    {
        return start.isSameOrBefore(end);
    }
    
    public static getDateRange(start: any, end: any): any
    {
        const _moment = extendMoment(moment);

        return Array.from(_moment.range(start, end).by('days'));
    }

    public static getUtcDate(value: any, format?: string): string
    {
        if (value === '' || _.isNull(value))
        {
            return null;
        }

        return moment(value).format(format ? format : AppConst.dateTimeFormats.dateOnly);
    }

    public static getUtcTime(value: any, format?: string): string
    {
        if (value === '')
        {
            return null;
        }

        return moment(value).format(format ? format : AppConst.dateTimeFormats.time24Only);
    }

    public static getUtcDateTime(value: any): string
    {
        if (value === '')
        {
            return null;
        }

        return moment(value).format(AppConst.dateTimeFormats.dateTime);
    }

    public static parseMomentDate(value: string): any
    {
        if (value === '')
        {
            return '';
        }

        return moment(value).toDate();
    }

    public static parseMoment(value: any): any
    {
        if (value === '' || _.isNull(value))
        {
            return null;
        }

        return moment(value);
    }

    public static parseMomentTzDateTime(value: string, timezone: string = 'UTC', format?: string): any
    {
        if (value === '')
        {
            return '';
        }

        return {
            date: moment(value).tz(timezone).format(format ? format : AppConst.dateTimeFormats.dateOnly),
            time: moment(value).tz(timezone).format(AppConst.dateTimeFormats.time12Only)
        };
    }

    public static getDob(value: any): any
    {
        let age = '0';
        const months = moment().diff(value, 'months', false);
        const years = Math.floor(months / 12);
        const month = months % 12;

        if (years === 0 && month === 0) {
            return age;
        }

        age = ((years > 0) ? (years > 1 ? years + ' Years' : years + ' Year') + ((month > 0) ? ' and ' + month + ' Months' : ((month === 1) ? ' and ' + month + ' Month' : '')) : ((month > 0) ? month + ' Months' : ((month === 1) ? month + ' Month' : '')));

        return age;
    }

    public static getDayName(value: any): string
    {
        if (value === '')
        {
            return null;
        }

        return moment(value).format('dddd');
    }

    public static convertMinsToMoment(value: number): any
    {
        return moment().set({
            'hour': Math.floor(value / 60),
            'minute': Math.floor(value % 60),
            'second': 0,
            'millisecond': 0
        });
    }

    public static convertMillisecondsToMoment(value: number): any
    {
        return moment().set({
            'hour': Math.floor((value / (1000 * 60 * 60)) % 24),
            'minute': Math.floor((value / (1000 * 60)) % 60),
            'second': Math.floor((value / 1000) % 60),
            'millisecond': (value % 1000) / 100
        });
    }

    public static convertMinTo24HourString(value: number): string
    {
        const obj = this.convertMinsToMoment(value);

        return obj.format('HH:mm:ss');
    }

    public static convertStringToMins(value: string): number
    {
        const parts = value.split(':');

        return (+parts[0] * 60) + +parts[1];
    }

    public static getClosestDate(dates: Array<Date>, target: any): number
    {
        if (!target) target = Date.now();
        else if (target instanceof Date) target = target.getTime();
      
        let nearest = Infinity;
        let winner = -1;
      
        dates.forEach((date: any, index: number) => 
        {
            if (date instanceof Date) date = date.getTime();

            const distance = Math.abs(date - target);

            if (distance < nearest) 
            {
                nearest = distance;

                winner = index;
            }
        })
      
        return winner;
    }

    public static getClosestDateForPastDates(dates: Array<Date>, target: any): number
    {
        const closest = dates.reduce((a: any, b: any) => a - target < b - target ? a : b);

        return dates.findIndex(i => i === closest);
    }

    public static getClosestDateForFutureDates(dates: Array<Date>, target: any): number
    {
        const closest = dates.reduce((a: any, b: any) => 
        {
            const diff = a.Date - target;

            return diff > 0 && diff < b.Date - target ? a : b;
        });

        return dates.findIndex(i => i === closest);
    }

    public static getWeeksInMonth(date: any, allYear: boolean = false, isoWeek: boolean = true): Array<any>
    {
        const weeks = [];

        const weekStart = this.parseMoment(date).startOf(allYear ? 'year' : 'month').startOf(isoWeek ? 'isoWeek' : 'week');
        const weekEnd = this.parseMoment(date).endOf(allYear ? 'year' : 'month').endOf(isoWeek ? 'isoWeek' : 'week');
        
        let lastWeek = weekStart;

        do 
        {
            const week = { start: '', end: '' };

            week.start = lastWeek.format(AppConst.dateTimeFormats.dateOnly);

            // add one week days
            lastWeek = lastWeek.clone().add(6, 'd');

            week.end = lastWeek.format(AppConst.dateTimeFormats.dateOnly);

            if (allYear || (this.parseMoment(week.start).month() >= this.parseMoment(date).month())) weeks.push(week);

            // week next day
            lastWeek = lastWeek.clone().add(1, 'd');    
        } 
        while (lastWeek.isBefore(weekEnd));
 
        return weeks;
    }
}
