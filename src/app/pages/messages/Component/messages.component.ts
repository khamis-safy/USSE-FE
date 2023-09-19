import { Component, AfterViewInit,OnInit, ViewChild , ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import {  MessageTypeComponent } from '../Components/message-type/message-type.component';
import { MessagesService } from '../messages.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ScheduledComponent } from '../Components/scheduled/scheduled.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit , AfterViewInit{
  tabs=["inbox","scheduled","outbox","failed"];
  tab = this.tabs[0];
  isChecked;
  isMessages:boolean=true;
  canEdit:boolean;
  @ViewChild(MessageTypeComponent) messageType:MessageTypeComponent;
  @ViewChild(ScheduledComponent) scheduled:ScheduledComponent;

  constructor(private cdr: ChangeDetectorRef ,public dialog: MatDialog,private  toaster: ToasterServices,private messageService:MessagesService,private authService:AuthService) { }

  ngOnInit() {
    let permission =this.messageService.messageasPermission
    let customerId=this.authService.userInfo.customerId;

  }
  ngAfterViewInit() {
    this.messageType.getDevices(this.tab);
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
      let id=this.messageType.deviceId
      this.messageType.getMessages(id);

    });
  }
  onChecked(e){
    this.isChecked=e;

  }

  changeModal(ev){
    // this.tab=this.tabs[ev.index];
    // console.log(this.tab)

    // if(this.tab=="inbox"){
    //   this.messageType.msgCategory=this.tab
    //   this.messageType.getDevices(this.tab);
    //   this.messageType.cdr.detectChanges(); // Trigger change detection

    // }
    // if(this.tab=="outbox"){
    //   this.messageType.msgCategory=this.tab
    //   this.messageType.getDevices(this.tab);
    //   this.messageType.cdr.detectChanges(); // Trigger change detection

    // }
    // if(this.tab=="scheduled"){

    //   this.scheduled.getDevices()
    //   this.cdr.detectChanges(); // Trigger change detection

    // }
    // if(this.tab=="failed"){
    //   this.messageType.msgCategory=this.tab
    //   this.messageType.getDevices(this.tab);
    //   this.messageType.cdr.detectChanges(); // Trigger change detection

    // }
    // this.cdr.detectChanges(); // Trigger change detection

    this.messageType.selection.clear();
  }
  openNewMessage(){
    this.isMessages=false;
  }
}
