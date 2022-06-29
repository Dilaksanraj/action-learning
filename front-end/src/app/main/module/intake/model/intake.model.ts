import { AppConst } from 'app/shared/AppConst';

import * as _ from 'lodash';

export class Intake 
{
    id: string;
    name: string;
    code: string;
    graduationYear: string;
    
    isNew?: boolean;
    isLoading?: boolean;
    statusLoading?: boolean;
    disabled?: boolean;
    index?: number;
    
    constructor(intake?: any, index?: number)
    {
        this.id = intake.id || '';
        this.graduationYear = intake.graduation_year || '';
        this.name = intake.name || '';
        this.code = intake.code || '';

        this.isNew = false;
        this.isLoading = false;
        this.statusLoading = false;
        this.disabled = false;
        this.index = index || 0;
    }
}
