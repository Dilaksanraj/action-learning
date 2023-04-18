import { AppConst } from 'app/shared/AppConst';

import * as _ from 'lodash';

export class Project 
{
    id: string;
    name: string;
    desc: string;
    endDate: string;
    
    isNew?: boolean;
    isLoading?: boolean;
    statusLoading?: boolean;
    disabled?: boolean;
    index?: number;
    
    constructor(intake?: any, index?: number)
    {
        this.id = intake.id || '';
        this.endDate = intake.end_date || '';
        this.name = intake.name || '';
        this.desc = intake.desc || '';

        this.isNew = false;
        this.isLoading = false;
        this.statusLoading = false;
        this.disabled = false;
        this.index = index || 0;
    }
}
