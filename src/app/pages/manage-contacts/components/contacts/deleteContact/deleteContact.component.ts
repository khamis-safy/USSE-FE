import { Component, Inject, OnInit } from '@angular/core';
import { Contacts } from '../../../contacts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../../manage-contacts.service';
import { DeleteListComponent } from '../../lists/delete-list/delete-list.component';
interface CheckedCont{
  contacts:Contacts[],
  remove:boolean

}
@Component({
  selector: 'app-deleteContact',
  templateUrl: './deleteContact.component.html',
  styleUrls: ['./deleteContact.component.scss']
})
export class DeleteContactComponent implements OnInit {
  isLoading = false;
  numOfItems:number=0;
  isRemoveL:boolean;
  body:string[];

  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<DeleteContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CheckedCont,
  ) {
    this.body = this.data.contacts.map(res=>res.id);
   }

  ngOnInit() {
    console.log("from delete contacts",this.data)
    if(this.data.remove){
      this.isRemoveL=true;
    }
    else{
      this.isRemoveL=false;

    }
    let body = this.data.contacts.map(res=>res.id)
    this.numOfItems=body.length;
    console.log(body)
  }

  deleteCon(){

    this.listService.deleteContact('khamis.safy@gmail.com',this.body).subscribe(
      (res)=>{
        this.isLoading = false
        console.log(res)

        this.onClose(this.body);
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
        console.log(err)
        this.onClose();
        this.toaster.error("Error")

      }
    )
  }
  removeLists(){
    this.listService.removeContactsFromLists(this.body).subscribe(
      (res)=>{
        this.isLoading = false
        this.onClose(this.body);

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
        console.log(err)
        this.onClose();
        this.toaster.error("Error")

      }
    )

  }
  submit(){
    this.isLoading = true;
    if(this.isRemoveL){
      this.removeLists();
    }
    else{
      this.deleteCon();
    }


  }
   onClose(data?): void {
    this.dialogRef.close(data);

    console.log("onClose",data)

  }

}
