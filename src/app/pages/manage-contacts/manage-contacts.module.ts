import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageContactsRoutes } from './manage-contacts.routing';
import { ManageContactsService } from './manage-contacts.service';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ListsComponent } from './components/lists/lists.component';
import { AddListComponent } from './components/lists/addList/addList.component';


import { ManageContactsComponent } from './component/manage-contacts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteListComponent } from './components/lists/delete-list/delete-list.component';
import { AddContactComponent } from './components/contacts/addContact/addContact.component';
import { DeleteContactComponent } from './components/contacts/deleteContact/deleteContact.component';
import { ContactListsComponent } from './components/contacts/contactLists/contactLists.component';

@NgModule({
  imports: [
    CommonModule,
    ManageContactsRoutes,
    SharedModule
  ],
  declarations: [
    ManageContactsComponent,
    ContactsComponent,
    ListsComponent,
    DeleteListComponent,
    AddListComponent,
    AddContactComponent,
    DeleteContactComponent,
    ContactListsComponent,


  ],
  providers:[ManageContactsService]
})
export class ManageContactsModule { }
