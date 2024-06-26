import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild , ChangeDetectorRef } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MessagesService } from '../../messages.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../../message';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DisplayMessageComponent } from '../display-message/display-message.component';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { DevicesPermissions } from 'src/app/pages/compaigns/compaigns.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FAILED, INBOXHEADER, OUTBOX } from '../constants/messagesConst';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { ResendMessagesComponent } from '../resendMessages/resendMessages.component';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { arraysContainSameObjects } from 'src/app/shared/methods/arraysContainSameObjects';
import { MessagesMobileViewComponent } from '../../mobile-view/messages-mobileView/messages-mobileView.component';

@Component({
  selector: 'app-message-type',
  templateUrl: './message-type.component.html',
  styleUrls: ['./message-type.component.scss']
})
export class MessageTypeComponent implements OnInit ,OnDestroy ,AfterViewInit{

  length:number=0;
  numRows;
  loading:boolean=true;
  @Input() msgCategory:string="inbox"
  @Output() isChecked = new EventEmitter<Message[]>;
  @Output() selectedDeviceId = new EventEmitter<string>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild("search") search!:ElementRef
  @Input() canEdit: boolean;
  cellClick:boolean=false;
  // devices
  devices:SelectOption[];
  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData,
  });
  @Output() isOpenNewMessage= new EventEmitter<Message[]>

  filterdData :any= new FormControl([]);
  filteringForm= new FormGroup({
    filterdData:this.filterdData,
  });
filters:any;
  deviceId:string;

  columns :FormControl;
  displayed: string[] ;
  displayedColumns: string[] = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At','Updated At','Status','Ation'];
  dataSource:MatTableDataSource<Message>;
  selection = new SelectionModel<Message>(true, []);
  destroy$: Subject<void> = new Subject<void>();

  subscribtions:Subscription[]=[];
  noData: boolean;
  notFound: boolean;
  isUser: boolean;
  permission:DevicesPermissions[];
  pageNum: number;
  display: number;
  isSmallScreen: boolean = false;
  searchControl = new FormControl();
  searchForm = new FormGroup({
    searchControl:this.searchControl
  })
  searchSub: Subscription;
  filteration: any;
  @ViewChild(MessagesMobileViewComponent) mobileView :MessagesMobileViewComponent
  alldevices: any[]=[];
  isDataCalledInMobile: any;

  constructor(public cdr: ChangeDetectorRef ,
    public dialog: MatDialog,
    private messageService:MessagesService,
    private authService:AuthService,
    private translate:TranslateService,
    private translationService:TranslationService,
    private breakpointObserver: BreakpointObserver){
      this.display=this.messageService.getUpdatedDisplayNumber()
      this.pageNum=this.messageService.pageNum;

      this.filters=[
        {title:this.translate.instant("Pending") ,value:1},
        {title:this.translate.instant("Sent") ,value:2},
        {title:this.translate.instant("Delivered") ,value:3},
        {title:this.translate.instant("Read") ,value:4}
      
      ]
    }
    selectedItems:any=[
      {title:this.translate.instant("Pending") ,value:1},
      {title:this.translate.instant("Sent") ,value:2},
      {title:this.translate.instant("Delivered") ,value:3},
      {title:this.translate.instant("Read") ,value:4}
    
    ]

  ngOnInit() {
    this.filteringForm.patchValue({
      filterdData:this.selectedItems
    }
    
    )
  
    this.columns=new FormControl(this.displayedColumns)

    this.selection.changed.subscribe(
      (res) => {

        if(res.source.selected.length){

          this.isChecked.emit(res.source.selected)
        }
        else{
          this.isChecked.emit()
        }
      });
this.tableData();
this.filteration=null;

this.permission =this.messageService.devicesPermissions;
if(this.authService.getUserInfo()?.customerId!=""){
  this.isUser=true;
}
else{
  this.isUser=false;
}
this.onChangeSecreanSizes()
    }
    onChangeSecreanSizes(){
      this.breakpointObserver.observe(['(max-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isSmallScreen = result.matches;
        if(!this.isSmallScreen){
          this.selection.clear()

            if(this.dataSource){
  
            if(!arraysContainSameObjects(this.dataSource.data,this.mobileView.messagesTableData)){
              if(this.mobileView?.searchControl.value || this.mobileView.filteration){
                this.getDevices(this.msgCategory)
              }
              else{
                this.getDataFromChild(this.mobileView.alldevices,this.mobileView.messagesTableData,this.mobileView.length)

              }
            }
          }
           else{
            if(!this.isDataCalledInMobile){
              this.getDevices(this.msgCategory)
            }
            else{
              if(this.mobileView.searchControl?.value  || this.mobileView.filteration){
                this.getDevices(this.msgCategory)
              }
              else{
                this.getDataFromChild(this.mobileView.alldevices,this.mobileView.messagesTableData,this.mobileView.length)

              }
            }
          } 
        }
        else{
  
            if(this.dataSource){
              setTimeout(() => {
                if(this.searchControl.value || this.filteration){
                  this.mobileView.getDevices(this.mobileView.msgCategory)
                }
                else{
                  this.mobileView?.getDataFromParent(this.alldevices,this.dataSource.data,this.length)

                }
            }, 100);
            }
            else{
              setTimeout(() => {
  
                this.mobileView?.getDevices(this.mobileView.msgCategory);
                this.isDataCalledInMobile=true;
  
              }, 100);
            }
          
          
        }
      });
    }
    handleResponce(res,messages?,length?){
      this.alldevices=res;

      if(this.permission){
        this.alldevices.map((device)=>
        {
          let found =this.permission.find((devP)=>devP.deviceId==device.id && devP.value=="None");
          if(found){
            this.alldevices.splice(this.alldevices.indexOf(device),1)
          }
        }
        )
      }
      this.devices = this.alldevices.map(res=>{
        return {
          title:res.deviceName,
          value:res.id,
          deviceIcon:res.deviceType
        }
      });
      if(this.devices.length==0){
        this.loading = false;
        this.length=0;
        this.noData=true;
      }
      else{
        this.noData=false

        this.deviceId=res[0].id;
        this.selectedDeviceId.emit(this.deviceId)

      this.getDevicePermission(this.deviceId);

        if(this.authService.selectedDeviceId ==""){

          this.form.patchValue({
          devicesData: {
          title:this.alldevices[0]?.deviceName,
          value:this.alldevices[0]?.id,
          deviceIcon:this.alldevices[0].deviceType

          }

          })
        }
        else{
          let selected= this.devices.find((device)=>device.value==this.authService.selectedDeviceId)
          this.deviceId=this.authService.selectedDeviceId;
          this.selectedDeviceId.emit(this.deviceId)

          this.form.patchValue({
            devicesData: {
            title:selected.title,
            value:selected?.value,
            deviceIcon:selected.deviceIcon

            }

            })
        }
        if(messages){
          this.numRows = res.length;
          this.dataSource = new MatTableDataSource<Message>(messages);
          this.length=length;

          if (this.paginator) {
            this.paginator.pageIndex = this.pageNum;
          }
        
          this.notFound = false;
          if(this.length ==0){
            this.notFound=true;
          }
          this.loading=false

        }
        else{
          this.getMessages(this.deviceId);

        }

    }
       

    
    }
    getDataFromChild(res,messages?,length?){
      if(this.searchSub){
        this.searchSub.unsubscribe();
        this.searchSub=null;
        this.searchForm.patchValue({
          searchControl:''
        })
      }
      this.handleResponce(res,messages,length);
      this.setupSearchSubscription()
    }
    openNewMessage(event){
      this.isOpenNewMessage.emit(event)
    }
  
ngAfterViewInit(): void {
  if(this.paginator){
    this.paginator.pageSize=this.display
  }
}
    getDevicePermission(deviceId:string){
      if(this.permission && this.isUser){

        let devicePermissions=this.permission.find((e)=>e.deviceId==deviceId);
        if(devicePermissions){

          let value=devicePermissions.value;
          this.fillBasedOnPermissions(value);
          this.canEdit=value=="ReadOnly"?false:true;
        }
        else{
          this.fillBasedOnPermissions("ReadOnly")
          this.canEdit=false;
        }


      }
      else if(!this.permission && this.isUser){
        this.fillBasedOnPermissions("ReadOnly")
        this.canEdit=false;
      }
      else{
        this.canEdit=true;
      }
    }
  fillBasedOnPermissions(permission:string){
    if(permission=="FullAccess"){
      this.tableData()
    }
    else{
      if(this.msgCategory=='inbox'){
        this.displayed = INBOXHEADER
        this.displayedColumns = ['Device Name', 'Sender', 'Messages', 'Received At'];
      }
      else if(this.msgCategory=='outbox'){
        this.displayed = OUTBOX;
        this.displayedColumns = ['Device Name', 'Recipient', 'Messages', 'Received At','Updated At','Status'];
      }
      else if(this.msgCategory=='failed'){

        this.displayedColumns = ['Device Name', 'Recipient', 'Messages', 'Received At'];
        this.displayed = FAILED;

      }
    }
    this.columns.setValue(this.displayedColumns)
  }
 // get devices data
 getDevices(megtype:string){
  this.msgCategory=megtype;
  this.authService.getDevices(this.authService.getUserInfo()?.email,10,0,"","").subscribe(
    (res)=>{
    this.handleResponce(res)
  },
    (err)=>{
      this.loading = false;
      this.length=0;
      this.noData=true;
    }
  )

}
setupSearchSubscription(): void {
  this.searchSub = this.searchControl.valueChanges.pipe(
    debounceTime(700), // Wait for 1s pause in events
    distinctUntilChanged(), // Only emit if value is different from previous value
    switchMap(searchVal => this.getMessagesReq(this.deviceId,this.msgCategory,this.filteration, searchVal))
  ).subscribe(
    res => this.handleGetMessagesResponse(res,this.searchControl.value,this.filteration, this.msgCategory),
    err => this.handleError()
  );
  this.subscribtions.push(this.searchSub);
}

getMessagesReq(deviceId:string,msgCat?,filterdItems?,searchVal?){
  let shows=this.messageService.display;
  let email=this.messageService.email;
  let msgCategory=msgCat? msgCat : this.msgCategory;
  let pageNumber=searchVal?0:this.pageNum
  if(searchVal && this.paginator){
    this.paginator.pageIndex=0
  }
  this.loading = true;
  if(this.selection){
    this.selection.clear()
  }
  return this.messageService.getMessages(email,msgCategory,shows,pageNumber,searchVal,deviceId,filterdItems)
}

getMessages(deviceId: string, msgCat?: string, filterdItems?: any, searchVal?: string): void {
  let search=searchVal?searchVal:"";
  let msgCategory=msgCat? msgCat : this.msgCategory;
  if(this.searchSub && !filterdItems){
    this.searchSub.unsubscribe();
    this.searchSub=null;
    this.searchForm.patchValue({
      searchControl:''
    })
  }
  const messagesSub = this.getMessagesReq(deviceId, msgCategory, filterdItems, search).subscribe(
    (res) => {  
    this.handleGetMessagesResponse(res, search,filterdItems,msgCategory);
    if(!this.searchSub){
      this.setupSearchSubscription();
    }

    },
    err => this.handleError()
  );
  this.subscribtions.push(messagesSub);
}

handleGetMessagesResponse(res: Message[], searchVal: string,filterdItems,msgCategory): void {
  this.numRows = res.length;
  this.dataSource = new MatTableDataSource<Message>(res);
  this.loading = false;

  if (searchVal!='') {
    this.length = res.length;
    this.notFound = this.length === 0;
  } else {
    if (this.paginator) {
      this.paginator.pageIndex = this.pageNum;
    }
    this.notFound = false;
    this.getMessagesCount(this.deviceId, msgCategory,filterdItems);
  }
}

handleError(): void {
  this.loading = false;
  this.length = 0;
  this.noData = true;
}


    // getMessagesBeforeEdit(deviceId:string,msgCat?,filterdItems?,searchVal?){
    //   let shows=this.messageService.display;
    //   let email=this.messageService.email;
    //   let msgCategory=msgCat? msgCat : this.msgCategory;
    //   let search=searchVal?searchVal:"";
    //   let pageNumber=searchVal?0:this.pageNum
    //   if(searchVal && this.paginator){
    //     this.paginator.pageIndex=0
    //   }
    //   this.loading = true;
    //   let messagesSub=this.messageService.getMessages(email,msgCategory,shows,pageNumber,search,deviceId,filterdItems).subscribe(
    //     (res)=>{
    //       this.numRows=res.length;

    //       this.loading = false;
    //       this.dataSource=new MatTableDataSource<Message>(res)

    //       //
    //       if(search!=""){
    //         this.length=res.length;
    //         if(this.length==0){
    //           this.notFound=true;
    //         }
    //         else{
    //           this.notFound=false;
    //         }
    //     }
    //     else{
    //       if(this.paginator){
    //         this.paginator.pageIndex=this.pageNum
    //       }
    //       this.notFound=false;
    //       this.getMessagesCount(deviceId,msgCategory,filterdItems);

    //     }
    //     },
    //     (err)=>{
    //      this.loading = false;
    //      this.length=0;
    //      this.noData=true;

    //     }
    //   )
    //   this.subscribtions.push(messagesSub)
    // }
    getMessagesCount(deviceId,msgCategory,filterdItems?){
      this.loading=true
      let email=this.messageService.email;
      
      this.messageService.getMessagesCount(email,msgCategory,deviceId,filterdItems).subscribe(
        (res)=>{
          this.length=res;
          this.loading=false
          if(this.length ==0){
            this.notFound=true;
          }
        }
        ,(err)=>{
          this.length=0;
          this.loading=false
          this.noData=true;

        }
      )
    }
    onSelect(device){
      this.selection.clear()
      this.deviceId=device.value;
      this.selectedDeviceId.emit(this.deviceId)

      this.authService.selectedDeviceId=device.value
      this.getMessages(this.deviceId);
      this.getDevicePermission(this.deviceId);
          }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows =  this.numRows;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onSearch(event:any){
    this.selection.clear();
    this.getMessages(this.deviceId,null,null,event.value);
  }

  changeColumns(event){
  //  change displayed column based on component type
  if(this.msgCategory=='failed' && this.canEdit){
    this.displayedColumns=['select',...event,'Ation']
  }
  else if(this.msgCategory!='failed' && this.canEdit){
    this.displayedColumns=['select',...event]
  }
  else{
    this.displayedColumns=[...event]
  }


  }

  onPageChange(event){
    this.messageService.display=event.pageSize;
    this.pageNum=event.pageIndex;
    this.messageService.updateDisplayNumber(event.pageSize)
    this.selection.clear();

    this.getMessages(this.deviceId);

  }
  tableData(){
    if(this.msgCategory=='inbox'){

      this.displayed = INBOXHEADER;
      this.displayedColumns = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At'];
    }
    else if(this.msgCategory=='outbox'){
      this.displayed = OUTBOX;
      this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At','Updated At','Status'];
    }
    else if(this.msgCategory=='failed'){
      this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At',"Ation"];
      this.displayed = FAILED;

    }
    this.columns.setValue(this.displayedColumns)

  }
  displayMessage(row){
    if(!this.cellClick){

    const currentLang=this.translationService.getCurrentLanguage()
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='100vh';
    dialogConfig.width='25vw';
    dialogConfig.maxWidth='450px';
    dialogConfig.minWidth='300px'
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.position =  currentLang=='en'?{ right: '2px'} :{ left: '2px'} ;
    dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
    dialogConfig.data={message:row};
    const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });
  }
  }
  reSendMessage(msgId){
   
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data ={
      from:"messages",
      data: {
        messageIds:[msgId],
        email: this.authService.getUserInfo().email,
        deviceId: this.deviceId
      }
    }
  
    const dialogRef = this.dialog.open(ResendMessagesComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getMessages(this.deviceId,"failed");
        
      }
    });
  }
  ngOnDestroy(){
      this.destroy$.next();
      this.destroy$.complete();
      this.selection.clear();
    
      this.subscribtions.map(e=>e.unsubscribe());
    this.selection.clear()
  }
  selectFilter(item){
  // this.selectedItems.push(item);
      this.filteration= this.selectedItems.map((sel)=>sel.value-1)
  this.getMessages(this.deviceId,"outbox",this.filteration,this.searchControl.value )  
  }
  deselectFilter(item){
      this.filteration= this.selectedItems.map((sel)=>sel.value-1)
    this.getMessages(this.deviceId,"outbox",this.filteration,this.searchControl.value )   

  }
}

