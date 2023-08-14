import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutes } from './messages.routing';
import { MessagesComponent } from './Component/messages.component';
import { ScheduledComponent } from './Components/scheduled/scheduled.component';
import { NewMessageComponent } from './Components/new-message/new-message.component';
import { SelectContactsComponent } from './Components/new-message/select-contacts/select-contacts.component';
import { WriteMessageComponent } from './Components/new-message/write-message/write-message.component';
import { SendMessageComponent } from './Components/new-message/send-message/send-message.component';
import { MessageTypeComponent } from './Components/message-type/message-type.component';
import { NbTimepickerModule, NbDatepickerModule } from '@nebular/theme';
import { DisplayMessageComponent } from './Components/display-message/display-message.component';
import { TypePipe } from './type.pipe';

@NgModule({
  imports: [
    CommonModule,
    MessagesRoutes,
    SharedModule,

  ],
  declarations: [
    MessagesComponent,
    DisplayMessageComponent,
    ScheduledComponent,
    NewMessageComponent,
    SelectContactsComponent,
    // WriteMessageComponent,
    SendMessageComponent,
    MessageTypeComponent,
      TypePipe
   ],
   exports:[
    // WriteMessageComponent
   ]
})
export class MessagesModule { }
