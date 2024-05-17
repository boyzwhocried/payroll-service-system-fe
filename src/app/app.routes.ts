import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
        title: 'Users',
        // component: NavbarComponent,
        loadComponent: () => import('./pages/users/users.component').then(c => c.UsersComponent),
    },
    {
        path: 'users',
        title: 'User',
        // component: NavbarComponent,
        loadChildren:() => import('./pages/users/user.module').then(u => u.UserModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
