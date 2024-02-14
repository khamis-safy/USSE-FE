import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatsService } from '../../chats.service';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.scss']
})
export class ChatContactsComponent implements OnInit {
  allContacts:any=[];
  contacts:any=[];
  constructor(private authService:AuthService,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<ChatContactsComponent>,
    private chatService:ChatsService,
    @Inject(MAT_DIALOG_DATA) public data:string) { }

  ngOnInit() {
    this.getContacts()
  }
  getContacts(searchVal?){
    let shows=100;
    let pageNum=0;
    let email=this.authService.getUserInfo()?.email;
    let orderedBy="";
    let search=searchVal?searchVal:"";
    this.listService.getContacts(email,false,shows,pageNum,orderedBy,search,"").subscribe(
      (res)=>{
        this.contacts=res
      }
    );
  
  }
  addNewContact(contact:Contacts){
    let data={
     chatName:contact.name,
     targetPhoneNumber:contact.mobileNumber,
     email:this.authService.getUserInfo()?.email,
     deviceId:this.data
    }
    this.chatService.addNewChat(data).subscribe(
      (res)=>{
        this.onClose(res)
      }
    )
  }
  onSearch(event:any){
    this.getContacts(event.value);
  }
  chatIcon(chatName){
    if(parseInt(chatName)){

      return chatName.substring(chatName.length-2);
    }
    else{

      return chatName.trim().split(" ",2).map((e)=>e.charAt(0).toUpperCase()).join("");

    }
  }
  onClose(data?):void {
    this.dialogRef.close(data);
  }
}
