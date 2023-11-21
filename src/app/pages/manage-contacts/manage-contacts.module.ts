import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageContactsRoutes } from './manage-contacts.routing';
import { ManageContactsService } from './manage-contacts.service';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ListsComponent } from './components/lists/lists.component';
import { AddListComponent } from './components/lists/addList/addList.component';


import { ManageContactsComponent } from './component/manage-contacts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddContactComponent } from './components/contacts/addContact/addContact.component';
import { ContactListsComponent } from './components/contacts/contactLists/contactLists.component';
import { UploadSheetComponent } from './components/importFiles/uploadSheet/uploadSheet.component';
import { FileFieldsComponent } from './components/importFiles/fileFields/fileFields.component';
import { AdditonalParamsComponent } from './components/contacts/additonalParams/additonalParams.component';
import { DragZoneModule } from 'src/app/shared/components/drag-zone/drag-zone.module';

@NgModule({
  imports: [
    CommonModule,
    ManageContactsRoutes,
    SharedModule,
    DragZoneModule
  ],
  declarations: [
    ManageContactsComponent,
    ContactsComponent,
    ListsComponent,
    UploadSheetComponent,
    FileFieldsComponent,
    AddListComponent,
    AddContactComponent,
    AdditonalParamsComponent,

    ContactListsComponent,


  ],
  providers:[ManageContactsService]
})
export class ManageContactsModule { }
