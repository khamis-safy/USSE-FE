import { Component, AfterViewInit,OnInit, ViewChild , ChangeDetectorRef, OnDestroy } from '@angular/core';
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
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit , AfterViewInit,OnDestroy{
  tabs=["inbox","scheduled","outbox","failed"];
  tabsArr=[
    {
      title:'INBOX_LABEL',
      tab:'inbox',
      image:"assets/icons/inbox gray.svg"
    },
    {
      title:'SCHEDULED_LABEL',
      tab:'scheduled',
      image:"assets/icons/Scheduled gray.svg"

    },
    {
      title:'OUTBOX_LABEL',
      tab:'outbox',
      image:"assets/icons/Outbox gray.svg"

    },
    {
      title:'UNDELIVERED_LABEL',
      tab:'failed',
      image:"assets/icons/Undelivered gray.svg"

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
    // initPaginationService.init();
    this.initRouting()
  }

  initRouting(){

    this.routingObservable= this.activatedRouter.queryParams.subscribe(params=>{
      if(params["tab"]){
        this.selectedTab = params["tab"].replace(/[\s]/g)
        this.selectedTabIndex= this.tabs.indexOf(this.selectedTab)

      }
      else{
        this.selectedTab = "inbox"
        this.updateQueryParams();
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
  ngAfterViewInit() {
    // this.messageType.getDevices("inbox");

  }
  openDeleteModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
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

  }
  openNewMessage(){
    this.isMessages=false;
  }
  ngOnDestroy(): void {
    this.routingObservable.unsubscribe()
  }
}
