import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }
  performLogin(user)
  {
    return this.http.post('/api/login',user)
  }
  performLogOut()
  {
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('logged_in_user_name')

  }
  performRegister(user){
    return this.http.post('/api/register',user)
  }
}
