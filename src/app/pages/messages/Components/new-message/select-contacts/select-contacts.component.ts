import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
interface ListContacts {
  list: ListData,
  contacts: Contacts[],
};
@Component({
  selector: 'app-select-contacts',
  templateUrl: './select-contacts.component.html',
  styleUrls: ['./select-contacts.component.scss']
})
export class SelectContactsComponent implements OnInit {
// lists variables
sortBy;
@Output() displayedContactsCount = new EventEmitter<number>;
@ViewChild(MatAccordion) accordion!: MatAccordion;
  lists: ListData[] = [];
  selectedLists:number=0;
  isAllListsSelected:boolean=false;
  checked:boolean=false;
  contacts: Contacts[] = [];
  listContacts: ListContacts[] = [];
  addedContacts: Contacts[] = [];
  allContactsData:Contacts[] = [];
  shouldCloseAccordion: boolean;
  selectedList:ListContacts;
  contactsNum:number=0;
  duplicatedContacts:ListContacts[]=[];
  selectAllStatus:number=0;

  selectedContacts:number=0;
  allNumbers:string[]=[];
  allContacts:SelectOption[];
  contactsData = new FormControl([]);

  dnum:number=0;
  // ngx-intl-tel
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  addHocs:string[]=[];
  mobile: any = new FormControl('',[Validators.required]);

  searchForm=new FormGroup({
    contactsData:this.contactsData

  })

  form = new FormGroup({
    mobile: this.mobile,

  });
  constructor(private listService: ManageContactsService) { }

  ngOnInit() {
    this.getLists();
    this.getAllContacts();

  }


  // get lists that contains contacts

  getLists(orderBy?:string) {
    let sorting=orderBy?orderBy:"";
    if(orderBy){
      this.onDeselectAllLists();
    }
    this.listService.getList(this.listService.email, 100, 0,sorting,"").subscribe(
      (res) => {
        let filterLlist = res.filter((e) => e.totalContacts != 0)
        this.lists = filterLlist;

      },
      (err) => {
      ////////////////////////////

      }
    )
  }

  getContacts( list:ListData) {

    this.contacts = [];
    list.contactsNum=0;
      this.listService.getContacts(this.listService.email, false, 50, 0, "", "", list.id).subscribe(
        (res) => {
          this.contacts=res;
          this.selectedList={list:list,contacts:this.contacts}
          list.contactsNum=this.contacts.length;
          if(this.checked ){
            if(list.isChecked){
              this.contacts.map((con)=>{
                con.isChecked="checked";
                this.addedContacts.push(con)});
              list.contactsNum=this.contacts.length;

            }
            else{
              this.contacts.map((con)=>{
                con.isChecked="";
                this.addedContacts.splice(this.addedContacts.indexOf(con),1)
              })
              list.contactsNum=0;
              list.selectionState=0
            }
            this.filterContacts(this.addedContacts);

          }

          else{
            this.contacts.map((con)=>{
              if(this.addedContacts.find((contact)=>contact.id==con.id)){
                con.isChecked="checked";
                list.contactsNum++;
                list.selectionState=2;
              }
              else{
                con.isChecked="";
                list.contactsNum--;
                list.selectionState=list.contactsNum==0?0:2
              }
            })

          }

        },
        (err) => { }
      )
    }




// get contacts data to be displayed in search input
getAllContacts(search?:string){
  let searchVal=search?search:""
  this.listService.getContacts(this.listService.email,false,50,0,"",searchVal,"").subscribe(
    (res)=>{
      this.allContactsData=res;
      if(search){

        this.allContacts=this.allContactsData.map(res=>{
          return {
            title:res.name,
            value:res.id
          }
        })
      }
      else{
        this.allContacts=[];
      }
},
      (err)=>{

      })
}
filterContacts(contacts:Contacts[]){
  this.addedContacts=Array.from(new Set(contacts.map(obj => JSON.stringify(obj)))).map(str => JSON.parse(str));
  this.emitContacts();


}
rescetSelected(){

  let contacts =this.addedContacts.map(res=>{
    return {
      title:res.name,
      value:res.id
    }
  })
  this.searchForm.patchValue({
    contactsData:contacts
  })
  console.log("search result",this.searchForm.value.contactsData)
}
selectAllContacts(){

  this.addedContacts=[];
  this.lists.map((list)=>{
    this.listService.getContacts(this.listService.email, false, 50, 0, "", "", list.id).subscribe(
      (res)=>{

          res.map((con)=>this.addedContacts.push(con));
          this.filterContacts(this.addedContacts)
      }

    )
  })
  this.rescetSelected()

}
// on select list
onSelectList(state,list:ListData){

  if(state=="checked"){
    // change list status to checked
    list.isChecked=true;

    this.getContacts(list)

    list.selectionState=2;
    // incerease lists selection number
    this.selectedLists++
// this.getContacts(list,true)
      if(this.selectedLists==this.lists.length){
        // change state of select all checkbox
        this.selectAllStatus=2;
        this.isAllListsSelected=true;


      }

      else{
        this.selectAllStatus=1
      }

      // get contacts on list checked and change state of select contact
      // this.getContacts(list,true);




  }
else{
  this.onDeslectList(list);
}
this.rescetSelected()

}

// on deselect list
onDeslectList(list:ListData){
  // change list status
  list.isChecked=false;
  this.getContacts(list)

  this.selectedList.contacts.map((con)=>con.isChecked="");
  this.contacts=this.selectedList.contacts;
  this.contacts.map((con)=>this.addedContacts.splice(this.addedContacts.indexOf(con),1))

  // decerease lists selection number
  this.selectedLists--;
  // change state of list check to be unchecked

  list.selectionState=0;

  // change state of select all checkbox


    if(this.selectedLists==0 ){
      this.selectAllStatus=0;
      this.isAllListsSelected=false;

    }




}

// on select all lists
selectAllLists(state){
  if(state=="checked"){
   this.selectedList.contacts.map((con)=>con.isChecked="checked");
   this.contacts=this.selectedList.contacts;
    this.selectAllContacts();


    this.selectedLists=this.lists.length;
    // change state of select all checkbox
    this.selectAllStatus=2;
    this.isAllListsSelected=true;

    // change all lists and contacts state to be checked
      this.lists.map((list)=>{
        list.selectionState=2;
        list.isChecked=true;
        // this.getContacts(list,true)
      });
  }
  else{
    this.onDeselectAllLists()
  }
  this.rescetSelected()

}

// on deselect all lists
onDeselectAllLists(){
if(this.selectedList){
  this.selectedList.contacts.map((con)=>con.isChecked="");
  this.contacts=this.selectedList.contacts;
}
  this.selectedContacts=0;
  this.selectedLists=0;
  this.isAllListsSelected=false;
  // change all lists and contacts state to be un checked
  this.lists.map((list)=>{
    list.selectionState=0;
    list.isChecked=false;

  });
  this.addedContacts=[];
  this.emitContacts();


}

// on select contact
onSelectContact(state,contact:Contacts,list:ListData){


      if(state=="checked"){
        list.contactsNum++;
        this.selectedContacts++;
          // change contact state to be checked
          contact.isChecked="checked"
          // incerease selected contact number
          this.addedContacts.push(contact);
          this.filterContacts(this.addedContacts);

          if(list.contactsNum==this.selectedList.contacts.length){

            this.selectedLists++;
              list.selectionState=2;
              list.isChecked=true;
            if(this.selectedLists==this.lists.length){
              // change state of select all checkbox
              this.selectAllStatus=2;
              this.isAllListsSelected=true;

            }

            else{
              this.selectAllStatus=1
            }



            console.log("seclecion state",)
          }



  }
  else{
    // this.removeContact(contact)
    this.onDeslectContact(contact,list)
  }
  this.rescetSelected()

}
// on deselect contact
onDeslectContact(contact:Contacts,list:ListData){
  contact.isChecked="";
 this.selectedContacts--;

 console.log("contact",contact,"remove con",this.addedContacts[this.addedContacts.indexOf(contact)],"added",this.addedContacts)
 this.addedContacts.splice(this.addedContacts.indexOf(contact),1);
 list.contactsNum--;
    this.emitContacts();

  if(this.contactsNum==0){
    this.selectedLists--;
    if(this.selectedLists<=0){
      this.selectAllStatus=0;
      this.selectedLists=0;
    }
    else{
      this.selectAllStatus=1;
    }
  }

  list.selectionState=0;
  list.isChecked=false;


}


// on clear all data
clearContacts(){
    this.addedContacts=[];
    this.addHocs=[];
    this.selectAllStatus=0;
    this.selectedLists=0;
    this.selectedContacts=0;
    if(this.selectedList){
      this.selectedList?.contacts?.map((con)=>con.isChecked="");

      this.selectedList.list.contactsNum=0;
      this.selectedList.list.selectionState=0;
    }

    this.lists.map((e)=>{e.selectionState=0;e.contactsNum=0})
    this.contacts?.map((e)=>e.isChecked="");
    this.rescetSelected();
    // this.hocsNum.emit(this.addHocs)
    this.emitContacts();


}

removeContact(contact:Contacts){
  this.addedContacts.splice(this.addedContacts.indexOf(contact),1);
  let found =this.selectedList.contacts.find((con)=>con.id==contact.id);
  found.isChecked="";
  this.selectedList.list.contactsNum--;
  this.selectedList.list.selectionState=0;
  this.selectedLists--;
  // change state of list check to be unchecked

  this.emitContacts();

  // change state of select all checkbox


    if(this.selectedLists==0 ){
      this.selectAllStatus=0;
      this.isAllListsSelected=false;

    }
  this.rescetSelected();

}



onSearch(event:string){

  this.getAllContacts(event)
}
onSelect(event:any){
  let addContact=this.allContactsData.find((e)=>e.id==event.value);
  this.addedContacts.push(addContact);
  this.filterContacts(this.addedContacts);

}
onDeSelect(event:any){
  let addContact=this.allContactsData.find((e)=>e.id==event.value);
  this.addedContacts.splice(this.addedContacts.indexOf(addContact),1);
  this.filterContacts(this.addedContacts);

}
onSelectAll(event:any){
  this.addedContacts=this.allContactsData;
  this.emitContacts();

}
onDeSelectAll(event:any){
  this.addedContacts=[];
  this.emitContacts();

}

addNumber(){
  this.addHocs.push(this.form.value.mobile.e164Number);
  this.form.patchValue({
    mobile:''
  })
  this.emitContacts();

  // this.hocsNum.emit(this.addHocs)
}

removeNum(num:string){
  this.addHocs.splice(this.addHocs.indexOf(num),1);
  // this.hocsNum.emit(this.addHocs)
  this.emitContacts();

}

emitContacts(){
let allSelected=[...this.addedContacts.map((e)=>e.mobileNumber),...this.addHocs];
this.displayedContactsCount.emit(allSelected.length);


}
}
