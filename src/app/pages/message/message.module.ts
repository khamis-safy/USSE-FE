import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageRoutes } from './message.routing';
import { MessageService } from './message.service';

import { MessageComponent } from './component/message.component';
 import { SharedModule } from 'src/app/shared/shared.module';
 import { InboxComponent } from './components/inbox/inbox.component';
 import { OutboxComponent } from './components/outbox/outbox.component';
 import { ScheduledComponent } from './components/scheduled/scheduled.component';
 import { UndeliveredComponent } from './components/undelivered/undelivered.component';


@NgModule({
  imports: [
    CommonModule,
    MessageRoutes,
    SharedModule
  ],
  declarations: [
    MessageComponent ,
    InboxComponent ,
    OutboxComponent ,
    ScheduledComponent ,
    UndeliveredComponent



  ],
  providers:[MessageService]
})
export class MessageModule { }
