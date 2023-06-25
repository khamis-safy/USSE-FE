import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutes } from './messages.routing';
import { MessagesComponent } from './Component/messages.component';

@NgModule({
  imports: [
    CommonModule,
    MessagesRoutes,
    SharedModule
  ],
  declarations: [MessagesComponent]
})
export class MessagesModule { }
