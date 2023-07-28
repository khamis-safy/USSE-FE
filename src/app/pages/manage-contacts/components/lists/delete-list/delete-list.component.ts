import { ManageContactsService } from './../../../manage-contacts.service';
import { ToasterServices } from './../../../../../shared/components/us-toaster/us-toaster.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListData } from '../../../list-data';
import { Contacts } from '../../../contacts';
interface DeletedData{
  contacts:Contacts[],
  list:string[],
  lists:ListData[]
}
@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.scss']
})
export class DeleteListComponent implements OnInit {
  contacts:string[];
  list:string[];
  isLoading = false;
  numOfItems:number=0;
  removeCon:boolean=false;
  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<DeleteListComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DeletedData,
  ) { }

  ngOnInit() {

    let body;
    if(this.data.list){
      this.removeCon=true;
      this.contacts=this.data.contacts.map((e)=>e.id);
    this.list=this.data.list;
      body = this.contacts
      this.numOfItems=body.length;
    }
    else{
      this.removeCon=false;
    body = this.data.lists.map(res=>res.id);
    this.numOfItems=body.length;
    }
  }
deleteList(){
  this.isLoading = true
  let body = this.data.lists.map(res=>res.id)
  this.listService.deleteList('khamis.safy@gmail.com',body).subscribe(
    (res)=>{
      this.isLoading = false
      this.onClose(body);
      let succ=res.numberOfSuccess;
      let err =res.numberOfErrors;
      if(succ==0 && err>0){
        this.toaster.error(`Error - ${err}`)
      }

      else if(succ>0 && err >0){
        this.toaster.warning(`${succ} Success ${err} Failed`)
      }
      else if(succ>0 && err ==0){
        this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

      }

    },
    (err)=>{
      this.isLoading = false
      this.onClose();
      this.toaster.error("Error")

    }
  )
}
removeContacts(){
  this.listService.removeContactsFromOneList(this.contacts,this.list).subscribe(
    (res)=>{
      this.isLoading = false
      this.onClose(true);
      let succ=res.numberOfSuccess;
      let err =res.numberOfErrors;
      if(succ==0 && err>0){
        this.toaster.error(`Error - ${err}`)
      }

      else if(succ>0 && err >0){
        this.toaster.warning(`${succ} Success ${err} Failed`)
      }
      else if(succ>0 && err ==0){
        this.toaster.success(`${res.numberOfSuccess} Deleted Successfully`)

      }

    },
    (err)=>{
      this.isLoading = false
      this.onClose();
      this.toaster.error("Error")

    }
  )
}
  submit(){
    if(this.data.list){
      this.removeContacts();

    }
   else{
    this.deleteList()
   }
  }
  onClose(data?): void {
    this.dialogRef.close(data);


  }
}
