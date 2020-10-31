import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {CommentsComponent} from './comments/comments.component'
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
