import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPassComponent } from './reset-pass.component';
import { ResetPassRoutes } from './reset.routing';
import { ResetPassService } from './reset.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ResetPassRoutes
  ],
  declarations: [ResetPassComponent]
  ,
  providers:[ResetPassService]
})
export class ResetModule { }
