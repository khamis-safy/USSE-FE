import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaignsRoutes } from './compaigns.routing';
import { CompaignsService } from './compaigns.service';

import { CompaignsComponent } from './component/compaigns.component';
 import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    CompaignsRoutes,
    SharedModule
  ],
  declarations: [
    CompaignsComponent



  ],
  providers:[CompaignsService]
})
export class CompaignsModule { }
