import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { SelectContactsComponent } from './select-contacts/select-contacts.component';
interface ListContacts {
  listId: string,
  contacts: Contacts[]
};

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit,AfterViewInit {
  @ViewChild(SelectContactsComponent) selectContacts:SelectContactsComponent;
  addHocs:string[]=[];
  addedContacts: Contacts[] = [];

  constructor() { }
  ngAfterViewInit() {
    this.addHocs=this.selectContacts.addHocs;
    this.addedContacts=this.selectContacts.addedContacts;
  }

  ngOnInit() {

  }

}
