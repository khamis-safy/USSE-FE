import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from './component/chats.component';
import { ChatsRoutes } from './chats.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatsService } from './chats.service';
import { ChatContactsComponent } from './components/chat-contacts/chat-contacts.component';


@NgModule({
  imports: [
    CommonModule,
    ChatsRoutes,
    SharedModule,
  ],
  declarations: [
    ChatsComponent,
    ChatContactsComponent
  ],
  providers:[ChatsService]
})
export class ChatsModule { }
