import { AppConst } from 'app/shared/AppConst';

import * as _ from 'lodash';
import { Department } from '../department/model/department.model';
import { Intake } from '../intake/model/intake.model';

export class User 
{
    id: string;
    attrId: string;
    image: string;
    firstName: string;
    lastName: string;
    dob: string;
    email: string;
    address1: String;
    departments: Department;
    intake: Intake;

    isAdministrator: boolean;
    isStudent: boolean;
    hasSiteManagerAccess: boolean;


    isNew?: boolean;
    isLoading?: boolean;
    statusLoading?: boolean;
    disabled?: boolean;
    index?: number;
    
    

    /**
     * Constructor
     *
     * @param user
     */


    constructor(user?: any, index?: number)
    {
        this.id = user.id || '';
        this.image = user.image || '';
        this.firstName = user.first_name || '';
        this.lastName = user.last_name || '';
        this.dob = user.dob || '';
        this.email = user.email || '';
        this.address1 = user.phone || '';
        this.departments = user.department ? new Department(user.department) : null;
        this.intake = user.intake ? new Intake(user.intake) : null;
        this.isAdministrator = user.type === '1' ? true : false;
        this.hasSiteManagerAccess = user.type === '0' ? true : false;
        this.isStudent = !this.isAdministrator && !this.hasSiteManagerAccess ? true : false;


        this.isNew = false;
        this.isLoading = false;
        this.statusLoading = false;
        this.disabled = false;
        this.index = index || 0;
    }

    getFullName(): string
    {
        return (
            (!_.isNull(this.firstName) ? this.firstName : '') +
            (!_.isNull(this.lastName) ? ' ' + this.lastName : '')
        );
    }

}
