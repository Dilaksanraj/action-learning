import {AppConst} from '../AppConst';

export class AuthClient {
    id: string;
    name: string;
    email: string;
    desc: string;
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
    newAdvancedPayment?: boolean;

    /**
     * Constructor
     *
     * @param client
     */
    constructor(client?: any) {
        this.id = client.id;
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
