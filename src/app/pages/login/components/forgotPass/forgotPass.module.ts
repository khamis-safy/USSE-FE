import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPassComponent } from './forgotPass.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPassRoutes } from './forgotPass.routing';
import { ForgotPassService } from './forgotPass.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ForgotPassRoutes
  ],
  declarations: [ForgotPassComponent]
  ,
  providers:[ForgotPassService]
})
export class ForgotPassModule { }
