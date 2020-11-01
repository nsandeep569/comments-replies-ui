import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './login/login.component';
import {AngularMaterialModule} from './modules/material.module'
import { FormsModule } from '@angular/forms';
import { HttpTokenInterceptor } from './http.token.interceptor';
import { RegisterComponent } from './register/register.component';
import { CommentBoxComponent } from './comment-box/comment-box.component';

@NgModule({
  declarations: [
    AppComponent,
    CommentsComponent,
    LoginComponent,
    RegisterComponent,
    CommentBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    HttpClientModule

  ],
  entryComponents:[CommentBoxComponent],
  
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
