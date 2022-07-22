export class InvitationVerify 
{
    id: string;
    email: string;
    expired: boolean;
    color?: string;
    childId?: any;

    /**
     * Constructor
     *
     * @param invitation
     */
    constructor(invitation?: any)
    {
        this.id = invitation.id;
        this.email = invitation.email;
        this.expired = invitation.expired;
        this.color = invitation.color || '';
        this.childId = invitation.childId || null;
    }

    /**
     * get page icon
     *
     * @returns {string}
     */
    getPageIcon(): string
    {
        return `assets/icons/flat/ui_set/custom_icons/${(this.color === 'green') ? 'family' : ((this.color === 'red') ? 'employees' : 'admin')}.svg`;
    }
}
