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
import { CampaignActionsComponent } from './components/addCompaigns/campaign actions/component/campaignActions/campaignActions.component';
import { CriteriaComponent } from './components/addCompaigns/campaign actions/components/shared/criteria/criteria.component';
import { InquiryComponent } from './components/addCompaigns/campaign actions/components/inquiry/inquiry.component';
import { SubscribeToListComponent } from './components/addCompaigns/campaign actions/components/subscribeToList/subscribeToList.component';
import { EmailComponent } from './components/addCompaigns/campaign actions/components/email/email.component';
import { CancelContactsComponent } from './components/addCompaigns/campaign actions/components/cancel-contacts/cancel-contacts.component';
import { AutoReplayComponent } from './components/addCompaigns/campaign actions/components/autoReplay/autoReplay.component';
@NgModule({
  imports: [
    CommonModule,
    CompaignsRoutes,
    SharedModule,
    NzTimePickerModule,
    NzDatePickerModule
  ],
  declarations: [
    CompaignsComponent ,
    StepOneComponent,
    StepThreeComponent,
    StepFourComponent,
    AddCompaignsComponent ,
    CampaignActionsComponent,
    CriteriaComponent,
    InquiryComponent,
    SubscribeToListComponent,
    EmailComponent,
    CancelContactsComponent,
    AutoReplayComponent




  ],
  providers:[
    CompaignsService]
})
export class CompaignsModule { }
