import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { UsersComponent } from './users/users.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'campaigns', component: CampaignsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' }
];
