import {AppConst} from '../AppConst';

export class AuthClient {
    id: string;
    name: string;
    email: string;
    desc: string;
    organization: string;
    organizationId: string;
    phoneNumber: string;
    faxNumber: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
    currency: string;
    status: boolean;
    timeZone: string;
    logo?: string;
    cover?: string;
    centerSettings?: any;
    hasKinderConnect?: boolean;
    branchLogo?: string;
    newAdvancedPayment?: boolean;

    /**
     * Constructor
     *
     * @param client
     */
    constructor(client?: any) {
        this.id = client.id;
        this.organization = client.org_name;
        this.organizationId = client.org;
        this.email = client.email;
        this.name = client.name;
        this.desc = client.desc;
        this.phoneNumber = client.phone;
        this.faxNumber = client.fax;
        this.addressLine1 = client.address1;
        this.addressLine2 = client.address2;
        this.zipCode = client.zipcode;
        this.city = client.city;
        this.country = client.country;
        this.currency = client.currency;
        this.status = client.status;
        this.timeZone = client.tz;
        this.logo = client.media ? client.media.logo : AppConst.image.DEFAULT_LOGO || AppConst.image.DEFAULT_LOGO;
        this.cover = client.media ? client.media.cover : '' || '';
        this.centerSettings = client.center_settings ? client.center_settings : null
        this.hasKinderConnect = client.has_kinder_connect || false;
        this.branchLogo = client.branch_logo ? client.branch_logo : '';
        this.newAdvancedPayment = client.new_advanced_payment || false;
    }

    /**
     * get client status
     *
     * @returns {boolean}
     * @memberof Branch
     */
    isActive(): boolean {
        return this.status;
    }
}
