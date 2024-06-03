import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { roleValidation } from './validations/role.validations';
import { RoleType } from './constants/roles.constant';
import { ForbiddenComponent } from './pages/not-found copy/forbidden.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'users',
    component: NavbarComponent,
    children: [
      {
        path: '',
        title: 'Users',
        loadComponent: () =>
          import('./pages/users/users.component').then((c) => c.UsersComponent),
        canMatch: [roleValidation],
        data: [RoleType.SUPER_ADMIN],
      },
      {
        path: 'new',
        title: 'Create User',
        loadComponent: () =>
          import('./pages/users/new/new.users.component').then(
            (c) => c.UserNew
          ),
        canMatch: [roleValidation],
        data: [RoleType.SUPER_ADMIN],
      },
    ],
  },
  {
    path: 'companies',
    component: NavbarComponent,
    children: [
      {
        path: '',
        title: 'Companies',
        loadComponent: () =>
          import('./pages/companies/companies.component').then(
            (c) => c.CompaniesComponent
          ),
        canMatch: [roleValidation],
        data: [RoleType.SUPER_ADMIN],
      },
    ],
  },
  {
    path: 'schedules',
    component: NavbarComponent,
    children: [
      {
        path: '',
        title: 'Schedule',
        loadComponent: () =>
          import('./pages/schedules/schedules.component').then(
            (s) => s.Schedules
          ),
        canMatch: [roleValidation],
        data: [RoleType.PS, RoleType.CLIENT],
      },
      {
        path: 'create',
        title: 'Create Schedule',
        loadComponent: () =>
          import(
            './pages/schedules/create-schedule/create-schedule.component'
          ).then((s) => s.CreateScheduleComponent),
        canMatch: [roleValidation],
        data: [RoleType.PS],
      },
      {
        path: 'reschedule',
        title: 'Reschedule',
        loadComponent: () =>
          import('./pages/schedules/reschedule/reschedule.component').then(
            (r) => r.RescheduleComponent
          ),
        canMatch: [roleValidation],
        data: [RoleType.PS],
      },
      {
        path: ':id',
        title: 'Client Schedule',
        loadComponent: () =>
          import(
            './pages/schedules/client-schedules/client-schedules.component'
          ).then((c) => c.ClientSchedules),
        canMatch: [roleValidation],
        data: [RoleType.PS],
      },
    ],
  },
  {
    path: 'assign',
    component: NavbarComponent,
    children: [
      {
        path: '',
        title: 'Assign',
        loadComponent: () =>
          import('./pages/assign/assign.component').then(
            (ac) => ac.AssignComponent
          ),
        canMatch: [roleValidation],
        data: [RoleType.SUPER_ADMIN],
      },
      {
        path: ':id',
        title: 'Assign Client',
        loadComponent: () =>
          import('./pages/assign/assign-client/assign-client.component').then(
            (acc) => acc.AssignClientComponent
          ),
        canMatch: [roleValidation],
        data: [RoleType.SUPER_ADMIN],
      },
    ],
  },
  {
    path: 'payrolls',
    component: NavbarComponent,
    children: [
      {
        path: ':scheduleId',
        title: 'Payrolls',
        loadComponent: () =>
          import('./pages/payrolls/payrolls.component').then((s) => s.Payrolls),
      },
    ],
  },
  {
    path: 'chat',
    component: NavbarComponent,
    children: [
      {
        path: ':id',
        title: 'Chat',
        loadComponent: () => import('./components/chat/chat.component').then(cc => cc.ChatComponent)
      },
    ]
  },
  {
    path: 'notification',
    children: [
      {
        path: '',
        title: 'Notification',
        loadComponent: () =>
          import('./pages/notification/notification.component').then(
            (n) => n.NotificationComponent
          ),
        canMatch: [roleValidation],
        data: [RoleType.PS, RoleType.CLIENT],
      },
    ],
  },
  {
    path: 'profile',
    component: NavbarComponent,
    children: [
      {
        path: '',
        title: 'Profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (p) => p.ProfileComponent
          ),
      },
    ],
  },
  {
    path: 'change-password',
    component: NavbarComponent,
    children: [
      {
        path: '',
        title: 'Change Password',
        loadComponent: () =>
          import('./pages/change-password/change-password.component').then(
            (cp) => cp.ChangePasswordComponent
          ),
      },
    ],
  },
  {
    path: 'forbidden',
    title: 'Forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    title: 'Not Found',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
