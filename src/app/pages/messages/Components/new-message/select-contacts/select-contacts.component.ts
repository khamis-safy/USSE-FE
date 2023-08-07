import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { Contacts } from 'src/app/pages/manage-contacts/contacts';
import { ListData } from 'src/app/pages/manage-contacts/list-data';
import { ManageContactsService } from 'src/app/pages/manage-contacts/manage-contacts.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
interface ListContacts {
  listId: string,
  contacts: Contacts[]
};
@Component({
  selector: 'app-select-contacts',
  templateUrl: './select-contacts.component.html',
  styleUrls: ['./select-contacts.component.scss']
})
export class SelectContactsComponent implements OnInit {

  lists: ListData[] = [];
  contacts: Contacts[] = [];
  listContacts: ListContacts[] = [];
  addedContacts: Contacts[] = [];
  isAllSelected:boolean=false;
  selectedLists:ListData[]=[];
  selectStatus:number=0;
  // checkList:boolean=false;
  selectNum:number=0;
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


  getLists(orderBy?:string) {
    let sorting=orderBy?orderBy:"";
    this.listService.getList(this.listService.email, 100, 0,sorting,"").subscribe(
      (res) => {
        let filterLlist = res.filter((e) => e.totalContacts != 0)
        this.lists = filterLlist;
          this.isAllSelected=false;

      },
      (err) => {
      ////////////////////////////

      }
    )
  }
getAllContacts(){
  this.listService.getContacts(this.listService.email,false,50,0,"","","").subscribe(
    (res)=>{
      this.allContacts=res.map(res=>{
        return {
          title:res.name,
          value:res.id
        }
      })
    console.log(res)},
      (err)=>{

      })
}
  getContacts( list:ListData,displayContacts:boolean) {
    this.contacts = [];

    let findlistContacts = this.listContacts.find((e) => e.listId == list.id);

    if (findlistContacts) {

      this.contacts = findlistContacts.contacts;

      if(list.isChecked=="checked" && !displayContacts){

        this.contacts.map((con)=> this.selectedContact("checked",con));
      }


    }
    else {

      this.listService.getContacts(this.listService.email, false, 50, 0, "", "", list.id).subscribe(
        (res) => {
          this.contacts = res;
          // this.contacts.map((e)=>e.isChecked="")

          if((list.isChecked=="checked" && displayContacts) || this.isAllSelected ){
            this.contacts.map((e)=>e.isChecked="checked")
            this.contacts.map((con)=>setTimeout(()=>{ this.selectedContact("checked",con)},2000));
            console.log("select all");
            this.dnum=this.addedContacts.length;


          }


          this.listContacts.push({ listId: list.id, contacts: this.contacts });

        },
        (err) => { }
      )
    }


  }

// onSearch(event:any){
//     console.log(event)
// }
// onSelect(event:any){
//   console.log(event)
// }
// onDeSelect(event:any){
//   console.log(event)
// }
// onSelectAll(event:any){
//   console.log(event)
// }
// onDeSelectAll(event:any){
//   console.log(event)
// }


  selectedContact(e, contact: Contacts) {
    if (e == 'checked') {
      contact.isChecked="checked";
      if(this.addedContacts.length==0){
        console.log("empty")
        setTimeout(()=>this.addedContacts.push(contact),300)
      }
      else{
        // console.log("checkt if contact",contact.name,"is found or not")

        let found=this.addedContacts.find((e)=>e.id==contact.id);
        if(!found){
          console.log("not found")
          setTimeout(()=>this.addedContacts.push(contact),300)

        }
        else{
          console.log("found")
        }



      }

    }

    else {
      contact.isChecked=""
      this.addedContacts.splice(this.addedContacts.indexOf(contact), 1)
    }
  }
  sellectAll(e){
    if (e == 'checked') {
      if(this.selectNum>0){
        this.addedContacts=[];
      }
      this.lists.map((list)=>{
        this.selectedList("checked",list,true)});
    }
    else{
      this.selectStatus=0
      this.selectNum=0;
      this.addedContacts.map((con)=>con.isChecked="")
      this.addedContacts=[];
      this.lists.map((e)=>e.isChecked="")
      this.contacts.map((e)=>e.isChecked="")
    }
  }
  selectedList(e,list:ListData,selectAll:boolean){

    if (e == 'checked') {
      if(selectAll || this.selectNum==this.lists.length){
        this.isAllSelected=true;
        this.selectStatus=2;

      }
      else{
        this.isAllSelected=false;
        this.selectStatus=1
      }
      list.isChecked="checked";
      this.getContacts(list,false);

    }
    else{
     this.deslectContacts(list)
    }


  }
  selectOneList(e){
    if (e == 'checked') {
      this.selectNum++;
      if(this.selectNum==this.lists.length){
        this.selectStatus=2
      }
      else{
        this.selectStatus=1;

      }
    }
    else{
      this.selectNum--;
      if(this.selectNum==0){
        this.selectStatus=0

      }
      else{
        this.selectStatus=1;

      }
    }
  }

  clearContacts(){
    this.addedContacts=[];
    this.addHocs=[];
    this.selectNum=0;
    this.isAllSelected=false;
    this.selectStatus=0;
    this.lists.map((e)=>e.isChecked="")
    this.contacts.map((e)=>e.isChecked="")

  }
deslectContacts(list:ListData){
  this.contacts.map((e)=>e.isChecked="")
  let foundList =this.listContacts.find((li)=>li.listId==list.id);
  foundList.contacts.map((con)=>this.addedContacts.splice(this.addedContacts.indexOf(con),1))

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
  onBadgeDeselect( contact: Contacts) {

    this.addedContacts.splice(this.addedContacts.indexOf(contact),1);
    this.contacts[this.contacts.indexOf(contact)].isChecked="";

  }
}
