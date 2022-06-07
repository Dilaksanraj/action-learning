import { AppConst } from '../AppConst';

export class AuthUser {

    id: string;
    image: string;
    name: string;
    email: string;
    created: string;
    status: boolean;
    attrId: string;
    level?: string[];
    role?: string[];
    
    isAdministrator?: boolean;
    hasPaymentMethod?: boolean;
    hasSiteManagerAccess?: boolean;

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user?: any)
    {
        this.id = user.id || '';
        this.attrId = user.attr_id || '';
        this.image = user.image || AppConst.image.PROFILE_CALLBACK;
        this.name = user.name || '';
        this.email = user.email || '';
        this.status = user.status || false;
        this.created = user.created || '';

        this.level = user.level || [];
        this.role = user.role || [];  
    
        this.isAdministrator = user.has_admin_rights || false;
        this.hasPaymentMethod = user.has_payment_method || false;
        this.hasSiteManagerAccess = user.site_manager || false;
    }
    
    getCurrentLevel(): string
    {
        return this.level.length > 0 ? this.level[0] : null;
    }

    getCurrentRole(): any
    {
        return this.role.length > 0 ? this.role[0] : null;
    }
}
