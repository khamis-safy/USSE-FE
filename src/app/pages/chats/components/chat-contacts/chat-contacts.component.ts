import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.scss']
})
export class ChatContactsComponent implements OnInit {
  allContacts:any=[];
  contactsObserver:Observable<any>;
  constructor(private authService:AuthService,
    private listService:ManageContactsService,) { }

  ngOnInit() {
    this.getContacts()
  }
  getContacts(searchVal?){
    let shows=50;
    let pageNum=0;
    let email=this.authService.getUserInfo()?.email;
    let orderedBy="";
    let search=searchVal?searchVal:"";
    this.contactsObserver=this.listService.getContacts(email,false,shows,pageNum,orderedBy,search,"");
  
  }
  onSearch(event:any){
    this.getContacts(event.value);
  }
}
