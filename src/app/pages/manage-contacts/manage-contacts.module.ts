import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageContactsRoutes } from './manage-contacts.routing';
import { ManageContactsService } from './manage-contacts.service';
import { ContactsComponent } from './components/contacts/contacts.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ListsComponent } from './components/lists/lists.component';
import { MatIconModule } from '@angular/material/icon';
import { AddListComponent } from './components/lists/addList/addList.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageContactsComponent } from './component/manage-contacts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteListComponent } from './components/lists/delete-list/delete-list.component';

@NgModule({
  imports: [
    CommonModule,
    ManageContactsRoutes,

    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    ManageContactsComponent,
    ContactsComponent,
    ListsComponent,
    DeleteListComponent,
    AddListComponent
  ],
  providers:[ManageContactsService]
})
export class ManageContactsModule { }
