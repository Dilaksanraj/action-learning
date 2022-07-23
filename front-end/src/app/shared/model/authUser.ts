import { AppConst } from '../AppConst';

export class AuthUser {

    id: string;
    image: string;
    firstName: string;
    lastname: string;
    type: string;
    email: string;
    created: string;
    status: boolean;
    
    isAdministrator?: boolean; //staff
    hasSiteManagerAccess?: boolean; //for admin
    isStudent?: boolean;

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user?: any)
    {
        this.id = user.id || '';
        this.image = user.image || AppConst.image.PROFILE_CALLBACK;
        this.firstName = user.first_name || '';
        this.lastname = user.last_name || '';
        this.email = user.email || '';
        this.status = user.status || false;
        this.created = user.created || '';

    
        this.isAdministrator = user.type === '1' ? true : false;
        this.hasSiteManagerAccess = user.type === '0' ? true : false;
        this.isStudent = !this.isAdministrator && !this.hasSiteManagerAccess ? true : false;
    }
    
}
