import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaignsRoutes } from './compaigns.routing';
import { CompaignsService } from './compaigns.service';

import { CompaignsComponent } from './component/compaigns.component';

import { AddCompaignsComponent } from './components/addCompaigns/addCompaigns.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { StepOneComponent } from './components/addCompaigns/stepOne/stepOne.component';
import { StepThreeComponent } from './components/addCompaigns/stepThree/stepThree.component';
import { StepFourComponent } from './components/addCompaigns/stepFour/stepFour.component';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ActionsModule } from './components/addCompaigns/campaign actions/actions.module';
import { WriteMessageModule } from '../messages/Components/new-message/write-message/writeMessage.module';
import { ConfirmaionsComponent } from './components/addCompaigns/confirmaions/confirmaions.component';

@NgModule({
  imports: [
    CommonModule,
    CompaignsRoutes,
    SharedModule,
    ActionsModule,
    NzTimePickerModule,
    NzDatePickerModule,
    WriteMessageModule
  ],
  declarations: [
    CompaignsComponent ,
    StepOneComponent,
    StepThreeComponent,
    StepFourComponent,
    AddCompaignsComponent ,
    ConfirmaionsComponent
  




  ],
  providers:[
    CompaignsService]
})
export class CompaignsModule { }
