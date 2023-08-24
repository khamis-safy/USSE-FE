import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from './verify.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VerifyService } from './verify.service';
import { VerifyRoutes } from './verify.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    VerifyRoutes
  ],
  declarations: [VerifyComponent]
  ,
  providers:[VerifyService]
})
export class VerifyModule { }
