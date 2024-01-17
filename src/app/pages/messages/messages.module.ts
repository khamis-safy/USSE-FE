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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ResendMessagesComponent } from './Components/resendMessages/resendMessages.component';
import { WriteMessageModule } from './Components/new-message/write-message/writeMessage.module';
import { ContactsWarningComponent } from './Components/contactsWarning/contactsWarning.component';
import { MessagesMobileViewComponent } from './mobile-view/messages-mobileView/messages-mobileView.component';
// import { ScheduledMobileViewComponent } from './mobile-view/scheduled-mobileView/scheduled-mobileView.component';

@NgModule({
  imports: [
    CommonModule,
    MessagesRoutes,
    SharedModule,
    NzDatePickerModule,
    WriteMessageModule
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
    ResendMessagesComponent,
    ContactsWarningComponent,
    MessagesMobileViewComponent,
    // ScheduledMobileViewComponent
   ],
   exports:[
    // WriteMessageComponent
   ]
})
export class MessagesModule { }
