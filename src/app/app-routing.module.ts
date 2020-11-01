import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {CommentsComponent} from './comments/comments.component'
import {RegisterComponent} from './register/register.component'
const routes: Routes = [

  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'comments',
    component:CommentsComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo:'/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
