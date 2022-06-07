import { AppConst } from 'app/shared/AppConst';

import * as _ from 'lodash';

export class User 
{
    id: string;
    attrId: string;
    image: string;
    firstName: string;
    lastName: string;
    dob: string;

    email: string;
    hasSecondaryEmail: boolean;
    secondaryEmail: string;

    phoneNumber: string;
    mobileNumber: string;

    workPhoneNumber: string;
    workMobileNumber: string;

    address1: string;
    address2: string;
    city: string;
    zipCode: string;

    created: string;
    status: boolean;
    loginAccess: boolean;
    emailVerified: boolean;
    pincode: string;
    attendance?: any;

    ccsId?: string;
    roleLevel?: string;
    permissions?: any;

    org?: any;
    branch?: any;

    isAdministrator?: boolean;

    children?:[];
    balance?: any;
    kioskSetup?: any;
    country?: any;
    state?: any;
    roles? : [];
    emailNotification?: []

    isPrimaryPayer?: boolean;
    pivotUpdatedAt?: string;
    expires?: string;
    isExpired?: boolean;

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
        this.attrId = user.attr_id || '';
        this.image = user.image || '';
        this.firstName = user.first_name || '';
        this.lastName = user.last_name || '';
        this.dob = user.dob || '';

        this.email = user.email || '';
        this.hasSecondaryEmail = user.need_sec_email || false;
        this.secondaryEmail = user.secondary_email || '';

        this.mobileNumber = user.phone || '';
        this.phoneNumber = user.phone2 || '';

        this.workPhoneNumber = user.work_phone || '';
        this.workMobileNumber = user.work_mobile || '';

        this.address1 = user.address1 || '';
        this.address2 = user.address2 || '';
        this.city = user.city || '';
        this.zipCode = user.zip_code || '';
        this.pincode = user.pincode || '';
        this.status = user.status || false;
        this.loginAccess = user.login_access || false;
        this.emailVerified = user.verified_email || false;
        this.created = user.account_created || '';
        this.attendance = user.attendance || [];

        this.ccsId = user.ccs_id || '';
        this.roleLevel = user.role_group || '';
        this.permissions = user.permissions || [];

        this.org = user.org || {};
        this.branch = user.branch || {};

        this.isAdministrator = user.has_admin_rights || false;
        this.children = user.child || [];
        this.balance = user.balance || '';
        this.emailNotification = user.email_types || [];

        this.kioskSetup = user.kiosk_setup || {};
        this.country = user.country || null;
        this.state = user.state || '';
        this.roles = user.roles || [];

        this.isPrimaryPayer = user.primary_payer || false;
        this.pivotUpdatedAt = user.pivot_updated_at || null;

        this.expires = user.date || null;
        this.isExpired = user.is_expire_invitation || false;
       
        this.isNew = false;
        this.isLoading = false;
        this.statusLoading = false;
        this.disabled = false;
        this.index = index || 0;
    }

    /**
     * get user full name
     *
     * @returns {string}
     * @memberof User
     */
    getFullName(): string
    {
        return (
            (!_.isNull(this.firstName) ? this.firstName : '') +
            (!_.isNull(this.lastName) ? ' ' + this.lastName : '')
        );
    }

    /**
     * get user status label
     *
     * @returns {string}
     * @memberof User
     */
    getStatusLabel(): string
    {
        return '<img src="assets/icons/flat/ui_set/custom_icons/' + (this.status ? 'checked.svg' : 'cancel.svg') + '" class="table-svg-icon"/>';
    }

    /**
     * get login access label
     *
     * @returns {string}
     * @memberof User
     */
    getLoginAccessLabel(): string
    {
        return '<img src="assets/icons/flat/ui_set/custom_icons/' + (this.loginAccess ? 'checked.svg' : 'cancel.svg') + '" class="table-svg-icon"/>';
    }

    /**
     * get user image
     *
     * @returns {string}
     */
    getImage(): string
    {
        try
        {
            return this.image !== '' ? this.image : this.roleLevel === AppConst.roleLevel.PARENT ? AppConst.image.PROFILE_PP_CALLBACK : AppConst.image.PROFILE_AP_CALLBACK;
        }
        catch (err)
        {
            return AppConst.image.PROFILE_CALLBACK;
        }
    }

    /**
     * check if user is parent type
     */
    isParentType(): boolean
    {
        return this.roleLevel === AppConst.roleLevel.PARENT;
    }

    /**
     * check if user is administrative type
     */
    isAdministrativeType(): boolean
    {
        return this.roleLevel === AppConst.roleLevel.ADMINISTRATION;
    }

    /**
     * check user has permission
     *
     * @param {string} belongsTo
     * @param {*} perms
     * @returns {boolean}
     */
    hasPermission(belongsTo: string, perms: any): boolean
    {
        try
        {
            const permsList = this.permissions[belongsTo];

            if (_.isArray(perms))
            {
                return _.intersection(permsList, perms).length > 0;
            }
            else
            {
                return _.has(permsList, perms);
            }
        }
        catch (err)
        {
            return false;
        }
    }

    /**
     * update user status
     *
     * @param {boolean} value
     * @memberof User
     */
    setStatus(value: boolean): void
    {
        this.status = value;
    }

    getStatus(): string
    {
        return this.status ? 'Active' : 'Inactive';
    }

    getLoginAccess(): string
    {
        return this.loginAccess ? 'Yes' : 'No';
    }

    setPrimaryPayer(value: boolean): void 
    {
        this.isPrimaryPayer = value;
    }
}
