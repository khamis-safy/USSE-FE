import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import {  MessageTypeComponent } from '../Components/message-type/message-type.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  isChecked;
  isMessages:boolean=true;
  @ViewChild(MessageTypeComponent) messageType:MessageTypeComponent;

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
      this.messageType.selection.clear();

    });
  }
  onChecked(e){
    this.isChecked=e;

  }

  changeModal(){
    this.messageType.selection.clear();
  }
  openNewMessage(){
    this.isMessages=false;
  }
}
