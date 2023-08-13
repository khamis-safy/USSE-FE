import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterRoutes } from './register.routing';
import { RegisterService } from './register.service';

import { RegisterComponent } from './component/register.component';
 import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';


@NgModule({
  imports: [
    CommonModule,
    RegisterRoutes,
    SharedModule
  ],
  declarations: [
    RegisterComponent ,
    LoginComponent ,
    SignupComponent 



  ],
  providers:[RegisterService]
})
export class RegisterModule { }
