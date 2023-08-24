import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutes } from './users.routing';
import { UsersService } from './users.service';
import { MatSelectModule } from '@angular/material/select';
import { UsersComponent } from './component/users.component';

import { ActionComponent } from './components/action/action.component';
import { AddUserComponent } from './components/addUser/addUser.component';

import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ActionComponent ,
    UsersComponent ,
    AddUserComponent
      
  

  ],
  imports: [
    CommonModule,
    UsersRoutes,
    SharedModule,
    MatSelectModule,
    
  


  ],
  // imports: [
  //   CommonModule,
  //   UsersRoutes,
  //   SharedModule ,
  //   UsersComponent ,
  // ],
  // declarations: [
    
  //   ActionComponent ,
   


  // ],

  providers: [UsersService]
})
export class UsersModule { }
