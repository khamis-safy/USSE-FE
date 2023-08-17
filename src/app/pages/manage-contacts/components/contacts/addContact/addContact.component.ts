import { AfterViewInit, Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ListData } from '../../../list-data';
import { ManageContactsService } from '../../../manage-contacts.service';
import { AddListComponent } from '../../lists/addList/addList.component';
import { Contacts } from '../../../contacts';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

interface CheckedCont{
  contacts:Contacts,
  listDetails:boolean

}
@Component({
  selector: 'app-addContact',
  templateUrl: './addContact.component.html',
  styleUrls: ['./addContact.component.scss']
})
export class AddContactComponent implements OnInit{
// isChanged:boolean=false;

  // lists: ListData[] ;
  listsArr:SelectOption[]
  // ngx-intl-tel
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  isLoading = false;

  selectedLists = new FormControl([]);
  name:any = new FormControl('',[Validators.required]);
  mobile:any = new FormControl('',[Validators.required]);
  cnName:any = new FormControl('');
  note:any=new FormControl('');
  form = new FormGroup({
    name:this.name,
    mobile:this.mobile,
    cnName:this.cnName,
    note:this.note,
    selectedLists:this.selectedLists
  });
  isEdit:boolean =false

oldData;

  // listsIds:string[]=[""];
  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit() {
    this.getLists();
    if(this.data){

      this.isEdit = true
      this.fillingData();
      // this.listsIds=this.data.lists.map((e)=>e.id)
      // this.listsIds=this.data.contacts.lists.map((e)=>e.id);

      this.selectedLists=new FormControl(this.data.contacts.lists)


    }else{
      this.isEdit = false;
    }
  }

  // ngx-intl-tel
  // changePreferredCountries() {
	// 	this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	// }

  fillingData(){
    this.form.patchValue({
      name: this.data.contacts.name,
      mobile:`+${this.data.contacts.mobileNumber}`,
      cnName:this.data.contacts.companyName,
      note:this.data.contacts.note,
    });



  }

  getLists(){
  this.listService.getList("khamis.safy@gmail.com",10,0,"","").subscribe(
     (res)=>{
      if(this.data){
      let dataLists=this.data.contacts.lists;
      let resList=res
      const listsMap = new Map();

      dataLists.forEach(list => listsMap.set(list.id, list));

      resList.forEach(list => {
        const exists = listsMap.has(list.id);

        if (!exists) {
          listsMap.set(list.id, list);
        }
      })
      let allLists=[]
      listsMap.forEach(list => allLists.push(list));
      // this.lists=allLists
      this.listsArr = allLists.map(res=>{
        return {
          title:res.name,
          value:res.id
        }
      })
      this.form.patchValue({
        selectedLists: this.data.contacts?.lists.map(res=>{
          return {
            title:res.name,
            value:res.id
          }
        })
      })
      }
      else{
        // this.lists=res;
        this.listsArr = res.map(res=>{
          return {
            title:res.name,
            value:res.id
          }
        })
      }

      },
      (err)=>{
        // this.onClose(false);
        // this.toaster.error("Error")

      })
  }


  submitAdd(){
    this.isLoading = true
    let email="khamis.safy@gmail.com";
    let name =this.form.value.name;
    let cnNName=this.form.value.cnName;
    let mobile=this.form.value.mobile.e164Number;
    let note = this.form.value.note;
    let listsIds = this.form.value.selectedLists.map((e)=>e.value);

    this.listService.addContact(name,mobile,cnNName,note,email,listsIds).subscribe(
      (res)=>{
        this.isLoading = false
        this.onClose(true);
        this.toaster.success("Success")
                  },
      (err)=>{
        this.isLoading = false
        this.onClose(false);
        this.toaster.error(`Error`)
      }
    )

  }


  submitEdit(){
    let email="khamis.safy@gmail.com";
    let name =this.form.value.name;
    let cnName=this.form.value.cnName;
    let mobile=this.form.value.mobile.e164Number
    let note = this.form.value.note;
    let listsIds = this.form.value.selectedLists.map((e)=>e.value);
    this.isLoading = true
    if(this.data.listDetails){
      this.listService.updateContact(this.data.contacts.id,name,mobile,cnName,note,email).subscribe(

        (res)=>{
          this.isLoading = false
          this.onClose(true);
          this.toaster.success("Success")
        },
        (err)=>{
          this.isLoading = false
          this.onClose(false);
          this.toaster.error(`Error`)
        }
      )
    }
    else{
      this.listService.updateContact(this.data.contacts.id,name,mobile,cnName,note,email,listsIds).subscribe(

        (res)=>{
          this.isLoading = false
          this.onClose(true);
          this.toaster.success("Success")
        },
        (err)=>{
          this.isLoading = false
          this.onClose(false);
          this.toaster.error(`Error`)
        }
      )
    }

  }
  onClose(data?):void {
    this.dialogRef.close(data);
  }
  changeLists(event){

    // this.listsIds=event.map((e)=>e.id)
  }

}
