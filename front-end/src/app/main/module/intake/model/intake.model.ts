import { AppConst } from 'app/shared/AppConst';

import * as _ from 'lodash';

export class Intake 
{
    id: string;
    email: string;
    expiryDate: string;
    
    isNew?: boolean;
    isLoading?: boolean;
    statusLoading?: boolean;
    disabled?: boolean;
    index?: number;
    
    constructor(intake?: any, index?: number)
    {
        this.id = intake.id || '';
        this.expiryDate = intake.expiry_date || '';
        this.email = intake.email || '';

        this.isNew = false;
        this.isLoading = false;
        this.statusLoading = false;
        this.disabled = false;
        this.index = index || 0;
    }
}
