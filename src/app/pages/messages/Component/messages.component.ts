import { Component, AfterViewInit,OnInit, ViewChild , ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import {  MessageTypeComponent } from '../Components/message-type/message-type.component';
import { MessagesService } from '../messages.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ScheduledComponent } from '../Components/scheduled/scheduled.component';
import { InitPaginationService } from 'src/app/shared/services/initPagination.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [
  ]
})
export class MessagesComponent implements OnInit{
  tabs=["inbox","scheduled","outbox","failed"];
  tabsArr=[
    {
      title:'INBOX_LABEL',
      tab:'inbox'
    },
    {
      title:'SCHEDULED_LABEL',
      tab:'scheduled'
    },
    {
      title:'OUTBOX_LABEL',
      tab:'outbox'
    },
    {
      title:'UNDELIVERED_LABEL',
      tab:'failed'
    }
  ]
  selectedTab;
  isChecked;
  isMessages:boolean=true;
  canEdit:boolean;
  @ViewChild(MessageTypeComponent) messageType:MessageTypeComponent;
  @ViewChild(ScheduledComponent) scheduled:ScheduledComponent;
  routingObservable;
  selectedTabIndex=0
  constructor(
    private router:Router,
    private activatedRouter:ActivatedRoute,
    private initPaginationService:InitPaginationService,
    private cdr: ChangeDetectorRef ,public dialog: MatDialog,private  toaster: ToasterServices,private messageService:MessagesService,private authService:AuthService)
  {
    initPaginationService.init();
    this.initRouting()
  }

  initRouting(){

    this.routingObservable= this.activatedRouter.queryParams.subscribe(params=>{
      if(params["tab"]){
        this.selectedTab = params["tab"].replace(/[\s]/g)
        this.selectedTabIndex= this.tabs.indexOf(this.selectedTab)

      }
    })
  }
  updateQueryParams(){
    this.router.navigateByUrl("/messages?tab="+this.selectedTab)
  }

  ngOnInit() {
    let permission =this.messageService.messageasPermission
    let customerId=this.authService.userInfo.customerId;
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

    this.selectedTab = this.tabs[ev.index]
    this.updateQueryParams();
    // this.tab=this.tabs[ev.index];
    // console.log(this.tab)


    if(this.tab=="inbox"){
      this.messageType.msgCategory=this.tab
      this.messageType.getDevices(this.tab);
      this.messageType.cdr.detectChanges(); // Trigger change detection

    }
    if(this.tab=="outbox"){
      this.messageType.msgCategory=this.tab
      this.messageType.getDevices(this.tab);
      this.messageType.cdr.detectChanges(); // Trigger change detection

    }
    if(this.tab=="scheduled"){

      this.scheduled.getDevices()
      this.cdr.detectChanges(); // Trigger change detection

    }
    if(this.tab=="failed"){
      this.messageType.msgCategory=this.tab
      this.messageType.getDevices(this.tab);
      this.messageType.cdr.detectChanges(); // Trigger change detection

    }
    this.cdr.detectChanges(); // Trigger change detection

    this.messageType.selection.clear();
  }
  openNewMessage(){
    this.isMessages=false;
  }
  ngOnDestroy(): void {
    this.routingObservable.unsubscribe()
  }
}
