import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
    },
    {
        path: 'users',
        component: NavbarComponent,
        children: [
            {
                path: '',
                title: 'Users',
                loadComponent: () => import('./pages/users/users.component').then(c => c.UsersComponent),
            },
            {
                path: 'new',
                title: 'Create User',
                loadComponent: () => import('./pages/users/new/new.users.component').then(c => c.UserNew),
            },
        ]
    },
    {
        path: 'companies',
        component: NavbarComponent,
        children: [
            {
                path: '',
                title: 'Companies',
                loadComponent: () => import('./pages/companies/companies.component').then(c => c.CompaniesComponent),
            },
        ]
    },
    {
      path: 'schedules',
      // component: NavbarComponent,
      children: [
        {
          path: '',
          title: 'Schedule',
          loadComponent: () => import('./pages/schedules/schedules.component').then(s => s.Schedules),
        },
      ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
