import { Component, Inject, OnInit } from '@angular/core';
import { Contacts } from '../../../contacts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { ManageContactsService } from '../../../manage-contacts.service';
import { DeleteListComponent } from '../../lists/delete-list/delete-list.component';

@Component({
  selector: 'app-deleteContact',
  templateUrl: './deleteContact.component.html',
  styleUrls: ['./deleteContact.component.scss']
})
export class DeleteContactComponent implements OnInit {
  isLoading = false;
  numOfItems:number=0;
  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<DeleteListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contacts[],
  ) { }

  ngOnInit() {
    console.log(this.data)
    let body = this.data.map(res=>res.id)
    this.numOfItems=body.length;
    console.log(body)
  }

  submit(){
    this.isLoading = true
    let body = this.data.map(res=>res.id)
    this.listService.deleteContact('khamis.safy@gmail.com',body).subscribe(
      (res)=>{
        this.isLoading = false
        console.log(res)
        this.onClose();
        this.toaster.success("Success")

      },
      (err)=>{
        this.isLoading = false
        console.log(err)
        this.onClose();
        this.toaster.error("Error")

      }
    )
  }
  onClose(): void {
    this.dialogRef.close();
    console.log("onClose")
  }

}
