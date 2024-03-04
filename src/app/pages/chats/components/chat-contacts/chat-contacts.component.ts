import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatsService } from '../../chats.service';
import { Chats } from '../../interfaces/Chats';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.scss']
})
export class ChatContactsComponent implements OnInit {
  allContacts:any=[];
  contacts:any=[];
  foundChat:Chats;

  constructor(private authService:AuthService,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<ChatContactsComponent>,
    private chatService:ChatsService,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

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
  async addNewContact(contact: Contacts) {
    let newContact = {
        chatName: contact.name,
        targetPhoneNumber: contact.mobileNumber,
        email: this.authService.getUserInfo()?.email,
        deviceId: this.data.deviceId
    };

    // Now we await the result of isContactExist
    if (await this.isContactExist(contact.name)) {
        this.onClose({ isFound: true, foundChat: this.foundChat });
    } else {
        this.chatService.addNewChat(newContact).subscribe(
            (res) => {
                this.onClose(res);
            }
        );
    }
}


  async isContactExist(contactName) {
    let contact = this.data.chats.find((chat: Chats) => chat.chat.chatName === contactName);
    if (contact) {
        this.foundChat = contact;
        return true;
    } else {
        let exists = await this.getChat(contactName);
        return exists;
    }
}

async getChat(chatName) {
  try {
      let res = await this.chatService.listChats(this.authService.getUserInfo()?.email, 30, 0, chatName, this.data.deviceId).toPromise();
      if (res.length > 0) {
          this.foundChat = res[0];
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error("Error while fetching chats:", error);
      // Handle the error here, e.g., return false or throw an error
      return false;
  }
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
