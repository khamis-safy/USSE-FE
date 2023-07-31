import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
interface ListContacts{
  listId:string,
  contacts:Contacts[]
}
@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {
lists:ListData[]=[];
contacts:Contacts[]=[];
listContacts:ListContacts[]=[];
addedContacts:Contacts[]=[];

cardNum:{i:number,isOpen:boolean}={i:-1,isOpen:false};
  // ngx-intl-tel
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

mobile:any = new FormControl('',[Validators.required]);

form = new FormGroup({
  mobile:this.mobile
});
  constructor(private listService:ManageContactsService) { }

  ngOnInit() {
    this.getLists();

  }
getLists(){
  this.listService.getList(this.listService.email,100,0,"","").subscribe(
    (res)=>{
      let filterLlist =res.filter((e)=>e.totalContacts!=0)
      this.lists=filterLlist;
    },
    (err)=>{


    }
  )


}
onBadgeDeselect(e,contact:Contacts){
  // this.addedContacts.splice(this.addedContacts.indexOf(contact),1)

}
selected(e,contact:Contacts){
//   let found= this.addedContacts.find((e)=>e.id==contact.id);

//   if(e=='checked'){
//     if(!found){
//       this.addedContacts.push(found);
//     }
//   }
// else{
//   if(found){
//     this.addedContacts.splice(this.addedContacts.indexOf(contact),1)
//   }
// }
  // console.log(this.addedContacts)
}
getContacts(index:number,id:string){
  this.contacts=[];
  if(this.cardNum.i==index){
    this.cardNum.isOpen=!this.cardNum.isOpen;
  }
  else{
    this.cardNum.i=index;

    this.cardNum.isOpen=true;

  }

let findContact=this.listContacts.find((e)=>e.listId==id);
if(findContact){
  this.contacts=findContact.contacts;
  console.log("list id",id)
}
else{
  this.listService.getContacts(this.listService.email,false,50,0,"","",id).subscribe(
    (res)=>{
      this.contacts=res;
      this.listContacts.push({listId:id,contacts:this.contacts});
    },
    (err)=>{}
  )
}


}
}
