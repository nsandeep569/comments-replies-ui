import { Component, OnInit } from '@angular/core';
import {LoginService} from './../services/login.service'
import { Router, ActivatedRoute } from '@angular/router';

export interface User{
  name:string;
  password:string;

}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  
  user:User;
  error:string=null;
  constructor(private loginService:LoginService,private router:Router) { }

  ngOnInit(): void {
    this.user={name:null,password:null}
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('logged_in_user_name')
    
  }
  onSubmit(){
    console.log(this.user.name,this.user.password)
    this.loginService.performRegister(this.user).subscribe((data)=>{
    console.log(data)
    this.error=null
    alert('You have been successfully registered, please navigate to login for logging in ')
    }
    ,(err)=>{
      this.error=err.error.message
      console.log(this.error)
    })
  }

}
