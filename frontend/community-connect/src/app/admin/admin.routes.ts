import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminManageUsersComponent } from './admin-manage-users/admin-manage-users.component';
import { AdminManageComplaintsComponent } from './admin-manage-complaints/admin-manage-complaints.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'home',
    component: AdminDashboardComponent,
  },
  {
    path: 'users',
    component: AdminManageUsersComponent,
  },
  {
    path: 'complaints',
    component: AdminManageComplaintsComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
