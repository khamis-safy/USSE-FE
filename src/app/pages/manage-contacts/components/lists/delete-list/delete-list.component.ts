import { ManageContactsService } from './../../../manage-contacts.service';
import { ToasterServices } from './../../../../../shared/components/us-toaster/us-toaster.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListData } from '../../../list-data';

@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.scss']
})
export class DeleteListComponent implements OnInit {
  isLoading = false;
  numOfItems:number=0;
  constructor(
    private toaster: ToasterServices,
    private listService:ManageContactsService,
    public dialogRef: MatDialogRef<DeleteListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListData[],
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
    this.listService.deleteList('khamis.safy@gmail.com',body).subscribe(
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
