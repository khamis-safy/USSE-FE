import { ToasterServices } from './../../../../../shared/components/us-toaster/us-toaster.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManageContactsService } from '../../../manage-contacts.service';
import { ListData } from '../../../list-data';

@Component({
  selector: 'app-addList',
  templateUrl: './addList.component.html',
  styleUrls: ['./addList.component.scss']
})
export class AddListComponent implements OnInit {
  isLoading = false
  name:any = new FormControl('',[Validators.required]);
  form = new FormGroup({
    name:this.name
  });

  isEdit:boolean =false

  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<AddListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListData,
  ) { }

  ngOnInit() {
    if(this.data){
      this.isEdit = true
      this.fillingData()
    }else{
      this.isEdit = false
    }
  }
  fillingData(){
    this.form.patchValue({
      name: this.data.name
    })
    console.log("fillingData",this.data.id)
  }
  submitAdd(){
    this.isLoading = true
    let email="khamis.safy@gmail.com";

    this.listService.addList(this.form.value.name,email).subscribe(
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

    this.isLoading = true
    let email="khamis.safy@gmail.com";
    this.listService.updateList(this.data.id,this.form.value.name,email).subscribe(
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
}
// khamis.safy@gmail.com
// {
//   "id": "ls_1edde628-4a50-49f9-9f3c-fd54b8b273ca",
//   "name": "test4",
//   "totalContacts": 0,
//   "totalCancelContacts": 0,
//   "createdAt": "2023-06-19T22:41:50.2533008Z",
//   "isDeleted": false,
//   "applicationUserId": "7ff2e9b7-be58-46e0-bea2-e3a200ff5ff0"
// }
