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


@NgModule({
  imports: [
    CommonModule,
    CompaignsRoutes,
    SharedModule
  ],
  declarations: [
    CompaignsComponent ,
    StepOneComponent,
    StepThreeComponent,
    StepFourComponent,
    AddCompaignsComponent ,




  ],
  providers:[CompaignsService]
})
export class CompaignsModule { }
