import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDetailsRoutes } from './list-details.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListDetailsService } from './list-details.service';
import { ListDetailsComponent } from './component/list-details.component';
import { ListContactsComponent } from './components/list-contacts/list-contacts.component';

@NgModule({
  imports: [
    CommonModule,
    ListDetailsRoutes,

    SharedModule
  ],
  declarations: [ListDetailsComponent,ListContactsComponent],
  providers:[ListDetailsService]

})
export class ListDetailsModule { }
