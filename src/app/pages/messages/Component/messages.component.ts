import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { Message } from '../message';
import { InboxComponent } from '../Components/inbox/inbox.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  isChecked;
  isMessages:boolean=true;
  @ViewChild(InboxComponent) inbox:InboxComponent;

  constructor(public dialog: MatDialog,private  toaster: ToasterServices) { }

  ngOnInit() {

  }
  openDeleteModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data =
    {
      messagesData:{messages:this.isChecked}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.inbox.selection.clear();

    });
  }
  onChecked(e){
    this.isChecked=e;

  }
  openNewMessage(){
    this.isMessages=false;
  }
}
