import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ListData } from '../../../list-data';
import { ManageContactsService } from '../../../manage-contacts.service';
import { AddListComponent } from '../../lists/addList/addList.component';
import { Contacts } from '../../../contacts';

@Component({
  selector: 'app-addContact',
  templateUrl: './addContact.component.html',
  styleUrls: ['./addContact.component.scss']
})
export class AddContactComponent implements OnInit {
  isLoading = false;
  name:any = new FormControl('',[Validators.required]);
  mobile:any = new FormControl('',[Validators.required]);
  cnName:any = new FormControl('');
  list:any = new FormControl('');
  note:any=new FormControl(null);
  form = new FormGroup({
    name:this.name,
    mobile:this.mobile,
    cnName:this.cnName,
    note:this.note,
  });
  defaultSelected:ListData[];
  isEdit:boolean =false

  lists: ListData[] ;
  listsIds:string[]=[""]
  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<AddListComponent>,
    @Inject(MAT_DIALOG_DATA) public data:Contacts,
  ) { }

  ngOnInit() {
    if(this.data){
      this.isEdit = true
      this.fillingData();
      console.log("contacts data",this.data)
    }else{
      this.isEdit = false;
      this.getLists();
    }
  }

  fillingData(){
    this.form.patchValue({
      name: this.data.name,
      mobile:this.data.mobileNumber,
      cnName:this.data.companyName,
      note:this.data.note,

    });
    this.defaultSelected=this.data.lists;
    console.log("form list value")
    this.getLists();

  }
  getLists(){
  this.listService.getList("khamis.safy@gmail.com",10,0,"","").subscribe(
     (res)=>{
      this.lists=res;
      console.log("lists from get lists addcontent",this.lists)

      },
      (err)=>{
        console.log(err);
      })
  }
  submitAdd(){
    this.isLoading = true
    let email="khamis.safy@gmail.com";
    let name =this.form.value.name;
    let cnNName=this.form.value.cnName;
    let mobile=this.form.value.mobile;
    let note = this.form.value.note;


    this.listService.addContact(name,mobile,cnNName,note,email,this.listsIds).subscribe(
      (res)=>{
        this.isLoading = false
        console.log(res)
        this.onClose(true);
        this.toaster.success("Success")
                  },
      (err)=>{
        this.isLoading = false
        console.log(err)
        this.onClose(false);
        this.toaster.error("Error")
            }
    )

  }
  submitEdit(){
    let email="khamis.safy@gmail.com";
    let name =this.form.value.name;
    let cnNName=this.form.value.cnName;
    let mobile=this.form.value.mobile;
    let note = this.form.value.note;
    this.isLoading = true;
    console.log("lists ids",this.listsIds)
    this.listService.updateContact(this.data.id,name,mobile,cnNName,note,email,this.listsIds).subscribe(
      (res)=>{
        this.isLoading = false
        console.log(res)
        this.onClose(true);
        this.toaster.success("Success")
      },
      (err)=>{
        this.isLoading = false
        console.log(err)
        this.onClose(false);
        this.toaster.error("Error")
      }
    )
  }
  onClose(data?): void {
    this.dialogRef.close(data);
    console.log("onClose",data)
  }
  selectedLists(event){
    this.listsIds=event.map((e)=>e.id)
    console.log("selected lists",this.listsIds)
  }
}
