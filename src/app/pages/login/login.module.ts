import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './component/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginService } from './login.service';
import { LoginRoutes } from './login.routing';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutes,
    SharedModule,

  ],
  declarations: [LoginComponent]
  ,
  providers:[LoginService]
})
export class LoginModule { }
