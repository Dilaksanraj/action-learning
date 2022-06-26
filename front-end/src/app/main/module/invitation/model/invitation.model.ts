import { AppConst } from 'app/shared/AppConst';

import * as _ from 'lodash';

export class Invitation 
{
    id: string;
    email: string;
    expiryDate: string;
    
    isNew?: boolean;
    isLoading?: boolean;
    statusLoading?: boolean;
    disabled?: boolean;
    index?: number;
    

    /**
     * Constructor
     *
     * @param invitation
     */
    constructor(invitation?: any, index?: number)
    {
        this.id = invitation.id || '';
        this.expiryDate = invitation.expiry_date || '';
        this.email = invitation.email || '';

        this.isNew = false;
        this.isLoading = false;
        this.statusLoading = false;
        this.disabled = false;
        this.index = index || 0;
    }
}
