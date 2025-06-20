import { Routes } from '@angular/router';
import { ResidentDashboardComponent } from './resident-dashboard/resident-dashboard.component';
import { SubmitComplaintComponent } from './submit-complaint/submit-complaint.component';
import { SubmitPaymentComponent } from './submit-payment/submit-payment.component';

export const RESIDENT_ROUTES: Routes = [
  { path: 'home', component: ResidentDashboardComponent },
  { path: 'submit-complaint', component: SubmitComplaintComponent },
  { path: 'submit-payment', component: SubmitPaymentComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
