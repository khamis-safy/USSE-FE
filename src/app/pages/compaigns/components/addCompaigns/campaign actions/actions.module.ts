import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignActionsComponent } from './component/campaignActions/campaignActions.component';
import { AutoReplayComponent } from './components/autoReplay/autoReplay.component';
import { CancelContactsComponent } from './components/cancel-contacts/cancel-contacts.component';
import { EmailComponent } from './components/email/email.component';
import { InquiryComponent } from './components/inquiry/inquiry.component';
import { CriteriaComponent } from './components/shared/criteria/criteria.component';
import { SubscribeToListComponent } from './components/subscribeToList/subscribeToList.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragZoneModule } from 'src/app/shared/components/drag-zone/drag-zone.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DragZoneModule

],

declarations: [
CampaignActionsComponent,
CriteriaComponent,
InquiryComponent,
SubscribeToListComponent,
EmailComponent,
CancelContactsComponent,
AutoReplayComponent





  ],
  exports: [
    CampaignActionsComponent,
    CriteriaComponent,
    InquiryComponent,
    SubscribeToListComponent,
    EmailComponent,
    CancelContactsComponent,
    AutoReplayComponent
],
  providers:[
    ]
})
export class ActionsModule { }
