import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsComponent } from './component/chats.component';
import { ChatsRoutes } from './chats.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatsService } from './chats.service';


@NgModule({
  imports: [
    CommonModule,
    ChatsRoutes,
    SharedModule ,
    ChatsComponent
  ],
  declarations: [
  
  
  ],
  providers:[ChatsService]
})
export class ChatsModule { }
