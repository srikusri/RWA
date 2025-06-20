import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AnnouncementListComponent } from './features/announcements/announcement-list/announcement-list.component';
import { ComplaintListComponent } from './features/complaints/complaint-list/complaint-list.component';
import { authGuard } from './auth/auth-guard'; // Corrected import path if needed, this should work for auth-guard.ts

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [authGuard],
    data: { expectedRoles: ['administrator'] },
  },
  {
    path: 'resident',
    loadChildren: () =>
      import('./resident/resident.routes').then((m) => m.RESIDENT_ROUTES),
    canActivate: [authGuard],
    data: { expectedRoles: ['resident'] },
  },
  {
    path: 'announcements',
    component: AnnouncementListComponent,
    canActivate: [authGuard],
    // data: { expectedRoles: ['resident', 'administrator'] } // Roles can be added if needed
  },
  {
    path: 'complaints',
    component: ComplaintListComponent,
    canActivate: [authGuard],
    // data: { expectedRoles: ['resident', 'administrator'] } // Roles can be added if needed
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
