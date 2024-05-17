import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserNew } from "./new/new.users.component";

const userRoutes : Routes = [
  {
    path: 'new',
    title: 'Create User',
    component: UserNew
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes),
  ],
  exports: [
    RouterModule
  ]
})

export class UserRouting {}
