import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { SelectContactsComponent } from './select-contacts/select-contacts.component';
import { WriteMessageComponent } from './write-message/write-message.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessagesService } from '../../messages.service';
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
  @ViewChild(WriteMessageComponent) writeMessage:WriteMessageComponent;
  @ViewChild(SendMessageComponent) sendMessage:SendMessageComponent;

contacts:Contacts[]=[];
  addedContacts: string[] = [];
  deviceId:string;
  message:string;
  dateTime:string;
  fileUrl:string;
  attachments:string[]=[];

  constructor(private messageService:MessagesService) { }
  ngAfterViewInit() {
    this.contacts=this.selectContacts.addedContacts

  }

  ngOnInit() {

  }
  messageData(e){
    this.message=e;
  }
  toWriteMessage(){
    this.addedContacts=[...this.selectContacts.addedContacts.map((e)=>e.mobileNumber),...this.selectContacts.addHocs]
    this.writeMessage.getTemplates();
  }
  toSendMessage(){
    // this.message=this.writeMessage.messageBody;
    console.log(this.message)

  }
  toLastStep(){
    this.deviceId=this.sendMessage.deviceId;
    this.dateTime=this.sendMessage.dateTime.nativeElement.value;
    // this.messageService.sendWhatsappBusinessMessage(this.deviceId,this.addedContacts,this.attachments,this.message,this.dateTime,this.messageService.email).subscribe(
    //   (res)=>{

    //   },
    //   (err)=>{

    //   }
    // )



  }
}
