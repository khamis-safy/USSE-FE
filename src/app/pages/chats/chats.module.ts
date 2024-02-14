import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from './component/chats.component';
import { ChatsRoutes } from './chats.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatsService } from './chats.service';
import { ChatContactsComponent } from './components/chat-contacts/chat-contacts.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TimeOnlyPipe } from './pipe/timeOnly.pipe';


@NgModule({
  imports: [
    CommonModule,
    ChatsRoutes,
    SharedModule,
    PickerModule,
    
  ],
  declarations: [
    ChatsComponent,
    ChatContactsComponent,
    TimeOnlyPipe
  ],
  providers:[ChatsService]
})
export class ChatsModule { }
