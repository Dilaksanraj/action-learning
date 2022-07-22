import { NgModule } from '@angular/core';
import { ClientLoginModule } from './auth/client-login/client-login.module';
import { InvitationAuthModule } from './public/invitation/invitation.module';

@NgModule({
    imports: [
        // Authentication
        ClientLoginModule,
        InvitationAuthModule

        // // Coming-soon
        // ComingSoonModule,

        // // Errors
        // Error404Module,
        // Error500Module,

        // // Invoices
        // InvoiceModernModule,
        // InvoiceCompactModule,

        // // Maintenance
        // MaintenanceModule,

        // // Pricing
        // PricingModule,

        // // Profile
        // ProfileModule,

        // // Search
        // SearchClassicModule,
        // SearchModernModule,

        // // Faq
        // FaqModule,

        // // Knowledge base
        // KnowledgeBaseModule
    ],
    declarations: []
})
export class CommonModule
{

}
