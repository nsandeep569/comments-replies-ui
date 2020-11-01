import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
   constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = sessionStorage.getItem('access_token');
    
    
    if (accessToken) {     
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
      }      
      return next.handle(request);
    }

    
  
}
