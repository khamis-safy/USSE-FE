import { Component, OnInit, ViewChild } from '@angular/core';
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
  contactsNum:number
};
@Component({
  selector: 'app-select-contacts',
  templateUrl: './select-contacts.component.html',
  styleUrls: ['./select-contacts.component.scss']
})
export class SelectContactsComponent implements OnInit {
// lists variables
@ViewChild(MatAccordion) accordion!: MatAccordion;
  lists: ListData[] = [];
  selectedLists:number=0;
  isAllListsSelected:boolean=false;

  contacts: Contacts[] = [];
  listContacts: ListContacts[] = [];
  addedContacts: Contacts[] = [];
  allContactsData:Contacts[] = [];

  duplicatedContacts:ListContacts[]=[];
  selectAllStatus:number=0;

  selectedContacts:number=0;

  allContacts:SelectOption[];
  contactsData = new FormControl([]);

  dnum:number=0;
  // ngx-intl-tel
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  addHocs:string[]=[];
  mobile: any = new FormControl('');

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

  // get list contacts
  getContacts( list:ListData,opened:boolean) {

    this.contacts = [];
    console.log("from get contacts")

    let findlistContacts = this.listContacts.find((e) => e.list.id == list.id);

    if (findlistContacts) {
      this.contacts = findlistContacts.contacts;
        // change contacts status if list checked or if all contacts checked
        if(list.isChecked && opened){
          console.log("is checked ")
          this.contacts.map((con)=>{
            this.addContact(con)
            con.isChecked="checked";});

        }
        else if(!list.isChecked && findlistContacts.contactsNum==0){
          this.contacts.map((con)=>{ this.removeContact(con,list);con.isChecked=""})

        }
      }
    else {
      this.listService.getContacts(this.listService.email, false, 50, 0, "", "", list.id).subscribe(
        (res) => {
          this.contacts = res;
          this.listContacts.push({ list: list, contacts: this.contacts,contactsNum:0 });
          let findList=this.listContacts.find((listContact)=>listContact.list.id==list.id);

            if(list.isChecked && opened){
              // console.log("is checked",list.isChecked)
              this.contacts.map((con)=>{
                this.addContact(con)
                con.isChecked="checked"});
                console.log("added contacts",this.addedContacts)
              // findList.contacts.map((e)=>this.addContact(e))
              ////////
            }

            else {

              this.contacts.map((con)=>con.isChecked="")
            }

              ////////


        },
        (err) => { }
      )
    }


  }

// get contacts data to be displayed in search input
getAllContacts(search?:string){
  let searchVal=search?search:""
  this.listService.getContacts(this.listService.email,false,50,0,"",searchVal,"").subscribe(
    (res)=>{
      this.allContactsData=res;
      this.allContacts=this.allContactsData.map(res=>{
        return {
          title:res.name,
          value:res.id
        }
      })
},
      (err)=>{

      })
}

// on select list
onSelectList(state,list:ListData){

  if(state=="checked"){
    // change list status to checked
    list.isChecked=true;
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

}

// on deselect list
onDeslectList(list:ListData){

  // decerease lists selection number
  this.selectedLists--;
  // change state of list check to be unchecked

  list.selectionState=0;

  // change state of select all checkbox


    if(this.selectedLists==0 ){
      this.selectAllStatus=0;
      this.isAllListsSelected=false;

    }

    // change list status
    list.isChecked=false;


    // change contacts status
    this.getContacts(list,false)



}

// on select all lists
selectAllLists(state){
  if(state=="checked"){
    if(this.listContacts.length!=0){
      this.listContacts.map((listCont)=>listCont.contacts.map((c)=>c.isChecked="checked"));

    }


    this.addedContacts=[];
    this.lists.map((list)=>this.onSelectList("checked",list))





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

}

// on deselect all lists
onDeselectAllLists(){
  if(this.listContacts.length!=0){
    this.listContacts.map((e)=>e.contacts.map((c)=>c.isChecked=""))
  }
  this.selectedContacts=0;
  this.selectedLists=0;
  this.isAllListsSelected=false;
  // change all lists and contacts state to be un checked
  this.lists.map((list)=>{
    list.selectionState=0;
    list.isChecked=false;

  });

}

// on select contact
onSelectContact(state,contact:Contacts,list:ListData){
  let finList=this.listContacts.find((listContact)=>listContact.list.id==list.id);
  let contactsNum=finList.contactsNum;

      if(state=="checked"){
        this.selectedContacts++;
          // change contact state to be checked
          contact.isChecked="checked"
          // incerease selected contact number

          let length=this.contacts.length;
          contactsNum++;

          this.listContacts.map((listCont)=>{
            if(listCont.list.id==list.id){
              listCont.contactsNum=contactsNum
            }
          })
          this.addContact(contact)


          if(contactsNum==length){
            list.isChecked=true;
            // change list check status to be checked
            this.onSelectList("checked",list)


          }
          else if(contactsNum<length && contactsNum!=length){
            list.selectionState=1;
          }

  }
  else{
    this.onDeslectContact(contact,list,contactsNum)
  }

}
// on deselect contact
onDeslectContact(contact:Contacts,list:ListData,contactsNum:number,fromRemov?){
  contact.isChecked="";

  contactsNum--;
  this.selectedContacts--;

    this.listContacts.map((listCont)=>{
      if(listCont.list.id==list.id){
        listCont.contactsNum=contactsNum
      }
    })
  let length=this.contacts.length;


  if(contactsNum!=0 &&  contactsNum<length){
    list.selectionState=1;


  }
  else if(contactsNum==0 && list.isChecked){
    this.onDeslectList(list);
    console.log("from deselect")


  }
  else{
    list.selectionState=0
  }
  if(!fromRemov){

    this.removeContact(contact,list)
  }



}


// on select contact from search input
searchedContacts(){

}





// on clear all data
clearContacts(){

}

// on remove contact not duplicated
removeContact(contact:Contacts,list:ListData){

  let duplicatedContacts=this.listContacts.filter((liCn)=>liCn.contacts.find((con)=>con.id==contact.id));
  console.log("duplicated",duplicatedContacts);

  duplicatedContacts.map((listCont)=>listCont.contacts.map((c)=>{

    if(listCont.list.id!=list.id){
      c.isChecked="";
       this.onDeslectContact(c,listCont.list,listCont.contactsNum,true)

    }
    else{
      if(c.id==contact.id){

        c.isChecked="";
       }
    }
  }))

  this.addedContacts.splice(this.addedContacts.indexOf(contact),1);


}

// on remove contact duplicated
// isDuplicated(contact:Contacts,list:ListData):boolean{

//   return duplicatedContacts?true:false
// }
// get duplicated contacts ==> contacts added from more than list or added from list and search input
getDuplicatedContacts(){

}

addContact(contact:Contacts){
  if(this.addedContacts.length==0){
        setTimeout(()=>this.addedContacts.push(contact),300)
      }
      else{
        // console.log("checkt if contact",contact.name,"is found or not")

        let found=this.addedContacts.find((e)=>e.id==contact.id);

        if(!found){
          setTimeout(()=>this.addedContacts.push(contact),300)

        }
  }

}


onSearch(event:string){

  this.getAllContacts(event)
}
onSelect(event:any){
  let addContact=this.allContactsData.find((e)=>e.id==event.value)
  console.log(addContact)
}
onDeSelect(event:any){
  console.log(event)
}
onSelectAll(event:any){
  console.log(event)
}
onDeSelectAll(event:any){
  console.log(event)
}

addNumber(){
  this.addHocs.push(this.form.value.mobile.number);
  this.form.patchValue({
    mobile:''
  })
}

removeNum(num:string){
  this.addHocs.splice(this.addHocs.indexOf(num),1)
}

//   selectedContact(e, contact: Contacts,list:ListData) {
//     if (e == 'checked') {
//       let length=this.contacts.length;
//       this.contactsNum++;
//       if(this.contactsNum==length){
//         list.selectionState=2;

//  this.selectNum++;
//       if(this.selectNum==this.lists.length){
//         this.selectStatus=2
//       }
//       else{
//         this.selectStatus=1;

//       }
//       }
//       else {

//         list.selectionState=1;
//       }


//       contact.isChecked="checked";
//       if(this.addedContacts.length==0){
//         setTimeout(()=>this.addedContacts.push(contact),300)
//       }
//       else{
//         // console.log("checkt if contact",contact.name,"is found or not")

//         let found=this.addedContacts.find((e)=>e.id==contact.id);

//         if(!found){
//           setTimeout(()=>this.addedContacts.push(contact),300)

//         }
//         else{
//           console.log("found")
//         }



//       }

//     }

//     else {
//       this.contactsNum--;
//       if(this.contactsNum==0){
//         list.selectionState=0;

//       }
//       else {
//         list.selectionState=1;
//       }

//       contact.isChecked=""
//       this.addedContacts.splice(this.addedContacts.indexOf(contact), 1)
//     }
//   }
//   sellectAll(e){
//     if (e == 'checked') {
//       if(this.selectNum>0){
//         this.addedContacts=[];
//       }
//       this.lists.map((list)=>{
//         this.selectedList("checked",list,true)});
//     }
//     else{
//       this.selectStatus=0
//       this.selectNum=0;
//       this.addedContacts.map((con)=>con.isChecked="")
//       this.addedContacts=[];
//       this.lists.map((e)=>e.selectionState=0)
//       this.contacts.map((e)=>e.isChecked="")
//     }
//   }
//   selectedList(e,list:ListData,selectAll:boolean){

//     if (e == 'checked') {
//       list.isChecked='checked'
//       list.selectionState=2;
//       if(selectAll || this.selectNum==this.lists.length){
//         this.isAllSelected=true;
//         this.selectStatus=2;
//         this.lists.map((list)=>list.selectionState=2)


//       }
//       else{
//         this.isAllSelected=false;
//         this.selectStatus=1

//       }

//       this.getContacts(list,false);

//     }
//     else{
//       list.isChecked=''

//      this.deslectContacts(list)
//     }


//   }
//   selectOneList(e,list:ListData){
//     if (e == 'checked') {
//       this.selectNum++;
//       if(this.selectNum==this.lists.length){
//         this.selectStatus=2;
//         list.selectionState=2;
//       }
//       else{
//         this.selectStatus=1;
//         list.selectionState=0;


//       }
//     }
//     else{
//       this.selectNum--;
//       if(this.selectNum==0){
//         this.selectStatus=0


//       }
//       else{
//         this.selectStatus=1;

//       }
//     }
//   }

//   clearContacts(){
//     this.addedContacts=[];
//     this.addHocs=[];
//     this.selectNum=0;
//     this.isAllSelected=false;
//     this.selectStatus=0;
//     this.lists.map((e)=>e.isChecked="")
//     this.contacts.map((e)=>e.isChecked="")

//   }
// deslectContacts(list:ListData){
//   this.contacts.map((e)=>e.isChecked="")
//   let foundList =this.listContacts.find((li)=>li.listId==list.id);
//   foundList.contacts.map((con)=>this.addedContacts.splice(this.addedContacts.indexOf(con),1))

// }


//   onBadgeDeselect( contact: Contacts) {

//     this.addedContacts.splice(this.addedContacts.indexOf(contact),1);
//     this.contacts[this.contacts.indexOf(contact)].isChecked="";

//   }

  // getContacts( list:ListData,displayContacts:boolean) {
  //   this.contacts = [];

  //   let findlistContacts = this.listContacts.find((e) => e.listId == list.id);

  //   if (findlistContacts) {


  //     this.contacts = findlistContacts.contacts;

  //     if(list.selectionState==2 && !displayContacts){


  //       this.contacts.map((con)=> this.selectedContact("checked",con,list));
  //     }


  //   }
  //   else {

  //     this.listService.getContacts(this.listService.email, false, 50, 0, "", "", list.id).subscribe(
  //       (res) => {
  //         this.contacts = res;
  //         // this.contacts.map((e)=>e.isChecked="")

  //         if((list.isChecked=="checked" && displayContacts) || this.isAllSelected ){
  //           this.contacts.map((e)=>e.isChecked="checked")
  //           this.contacts.map((con)=>setTimeout(()=>{ this.selectedContact("checked",con,list)},2000));
  //           console.log("select all");
  //           this.dnum=this.addedContacts.length;


  //         }


  //         this.listContacts.push({ listId: list.id, contacts: this.contacts });

  //       },
  //       (err) => { }
  //     )
  //   }


  // }
}
