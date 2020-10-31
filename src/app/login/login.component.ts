import { Component, OnInit } from '@angular/core';
import {LoginService} from './../services/login.service'
import { Router, ActivatedRoute } from '@angular/router';

export interface User{
  name:string;
  password:string;

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  user:User;
  error:string=null;
  constructor(private loginService:LoginService,private router:Router) { }

  ngOnInit(): void {
    sessionStorage.removeItem('access_token')
    sessionStorage.setItem('logged_in_user_name',this.user.name)
    this.user={name:'',password:''}
  }
  onSubmit(){
    console.log(this.user.name,this.user.password)
    this.loginService.performLogin(this.user).subscribe((data)=>{
    console.log(data)
    this.error=null
    sessionStorage.setItem('access_token',data['access_token'])
    sessionStorage.setItem('logged_in_user_name',this.user.name)
    this.router.navigate(['/comments'])
    }
    ,(err)=>{
      this.error=err.error.message
      console.log(this.error)
    })
  }

}
