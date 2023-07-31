import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutes } from './messages.routing';
import { MessagesComponent } from './Component/messages.component';
import { InboxComponent } from './Components/inbox/inbox.component';
import { OutboxComponent } from './Components/outbox/outbox.component';
import { ScheduledComponent } from './Components/scheduled/scheduled.component';
import { UndeliveredComponent } from './Components/undelivered/undelivered.component';
import { NewMessageComponent } from './Components/new-message/new-message.component';

@NgModule({
  imports: [
    CommonModule,
    MessagesRoutes,
    SharedModule
  ],
  declarations: [
    MessagesComponent,
    InboxComponent,
    OutboxComponent,
    ScheduledComponent,
    UndeliveredComponent,
    NewMessageComponent
  ]
})
export class MessagesModule { }
