import { AppConst } from "app/shared/AppConst";

export class AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    /**
     * Constructor
     *
     * @param client
     */
    constructor(client?: any) {
        this.id = client.id;
        this.firstName = client.first_name;
        this.lastName = client.last_name;
        this.email = client.email
        
    }


}
