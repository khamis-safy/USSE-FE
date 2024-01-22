import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DevicesPermissions } from 'src/app/pages/compaigns/compaigns.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { INBOXHEADER, OUTBOX, FAILED } from '../../Components/constants/messagesConst';
import { DisplayMessageComponent } from '../../Components/display-message/display-message.component';
import { ResendMessagesComponent } from '../../Components/resendMessages/resendMessages.component';
import { Message } from '../../message';
import { MessagesService } from '../../messages.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NavActionsComponent } from 'src/app/shared/components/nav-actions/nav-actions.component';

@Component({
  selector: 'app-messages-mobileView',
  templateUrl: './messages-mobileView.component.html',
  styleUrls: ['./messages-mobileView.component.scss']
})
export class MessagesMobileViewComponent implements OnInit {
    length:number=0;
    numRows;
    loading:boolean=true;
    @Input() msgCategory:string="inbox"
    @Output() isOpenNewMessage = new EventEmitter<boolean>;
    @Output() selectedDeviceId = new EventEmitter<string>;
    dynamicComponentRef: ComponentRef<NavActionsComponent>;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;
    isChecked:boolean=false;
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
    
 


  showsOptions:SelectOption[]=[
    {title:'10',value:10},
    {title:'50',value:50},
    {title:'100',value:100}


  ];
  showsSelectedOptions:any = new FormControl([]);

  displayForm = new FormGroup({
    showsSelectedOptions:this.showsSelectedOptions,
   
  });
    filterdData :any= new FormControl([]);
    filteringForm= new FormGroup({
      filterdData:this.filterdData,
    });
    selectedSortingName:string='name';
  selectedSortingType:string='ASC'
  orderedBy: string='';
  topSortingOptions:any=[{opitonName:'name' ,lable:`${this.translate.instant('nameLabel')}`, isSelected:true} 
                          , {opitonName:'createdAt' , lable:`${this.translate.instant('CREATE_AT')}`,isSelected:false}]
  
bottomSortingOptions:any=[{opitonName:'ASC' ,lable:`${this.translate.instant('ASCENDING')}`, isSelected:true} ,
                            {opitonName:'DEC' , lable:`${this.translate.instant('DESCENDING')}`,isSelected:false}]
messagesTableData:any=[]
  filters:any;
    deviceId:string;
    pageIndex:number=0;
    columns :FormControl;
    displayed: string[] ;
    displayedColumns: string[] = ['select' , 'Sender', 'Messages', 'Received At','Updated At','Status','Action'];
    dataSource:MatTableDataSource<Message>;
    selection = new SelectionModel<Message>(true, []);
    navActionSubscriptions:Subscription[]=[];

    subscribtions:Subscription[]=[];
    noData: boolean;
    notFound: boolean;
    isUser: boolean;
    permission:DevicesPermissions[];
    display: number;
    isSmallScreen: boolean = false;
    openedDialogs: any = [];
    constructor(public cdr: ChangeDetectorRef ,
      public dialog: MatDialog,
      private messageService:MessagesService,
      private authService:AuthService,
      private translate:TranslateService,
      private translationService:TranslationService,
      private drawerService: NzDrawerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    
      ){
        this.display=this.messageService.getUpdatedDisplayNumber()
        this.pageIndex=this.messageService.pageNum;
  
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
      openNewMessage(){
        this.isOpenNewMessage.emit(true)
      }
    ngOnInit() {
      this.filteringForm.patchValue({
        filterdData:this.selectedItems
      }
      )
      this.displayForm.patchValue({
        showsSelectedOptions: {
        title:String(this.messageService.getUpdatedDisplayNumber()),
        value:this.messageService.getUpdatedDisplayNumber(),
        }
        })
      this.columns=new FormControl(this.displayedColumns)
  
      this.selection.changed.subscribe(
        (res) => {
  
          if(res.source.selected.length){
  
            this.isChecked=true
          }
          else{
            this.isChecked=false
          }
        });
  this.tableData();
  
  this.permission =this.messageService.devicesPermissions;
  if(this.authService.getUserInfo()?.customerId!=""){
    this.isUser=true;
  }
  else{
    this.isUser=false;
  }
  // get device's messages
  this.getDevices(this.msgCategory);

}
  
toggleTopSortingSelect(){
  this.topSortingOptions.forEach((option:{opitonName:string,isSelected:boolean })=>option.isSelected=!option.isSelected);
  this.selectedSortingName= this.topSortingOptions.find((option)=>option.isSelected).opitonName;
  this.changeSorting(this.selectedSortingName , this.selectedSortingType)
}
toggleBottomSortingSelect(){
this.bottomSortingOptions.forEach((option:{opitonName:string,isSelected:boolean })=>option.isSelected=!option.isSelected);
this.selectedSortingType= this.bottomSortingOptions.find((option)=>option.isSelected).opitonName;
this.changeSorting(this.selectedSortingName , this.selectedSortingType)

}
changeSorting(selectedSortingName ,selectedSortingType){
let sorting=`${selectedSortingName}${selectedSortingType}`;
this.orderedBy=sorting;
this.selection.clear();
this.getMessages(this.deviceId);
} 
    
  ngAfterViewInit(): void {
    if(this.paginator){
      this.paginator.pageSize=this.messageService.display;

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
        if(!this.permission && this.isUser){
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
            this.displayed = INBOXHEADER.filter((_, index) => index !== 1)
            this.displayedColumns = ['Device Name', 'Sender', 'Messages', 'Received At'];
          }
          else if(this.msgCategory=='outbox'){
            this.displayed = OUTBOX.filter((_, index) => index !== 1);
            this.displayedColumns = ['Device Name', 'Recipient', 'Messages', 'Received At','Updated At','Status'];
          }
          else if(this.msgCategory=='failed'){
    
            this.displayedColumns = ['Device Name', 'Recipient', 'Messages', 'Received At'];
            this.displayed = FAILED.filter((_, index) => index !== 1);
    
          }
        }
        this.columns.setValue(this.displayedColumns)
      }
   // get devices data
   getDevices(megtype:string){
    this.msgCategory=megtype;
    this.authService.getDevices(this.authService.getUserInfo()?.email,10,0,"","").subscribe(
      (res)=>{
        let alldevices=res;
  
        if(this.permission){
          alldevices.map((device)=>
          {
            let found =this.permission.find((devP)=>devP.deviceId==device.id && devP.value=="None");
            if(found){
              alldevices.splice(alldevices.indexOf(device),1)
            }
          }
          )
        }
        this.devices = alldevices.map(res=>{
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
            title:alldevices[0]?.deviceName,
            value:alldevices[0]?.id,
            deviceIcon:alldevices[0].deviceType
  
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
          this.getMessages(this.deviceId);
  
      }
    },
      (err)=>{
        this.loading = false;
        this.length=0;
        this.noData=true;
      }
    )
  
  }
  selectAllRows(){
    this.selection.select(...this.messagesTableData);
    if (this.dynamicComponentRef && this.selection.selected.length  > 0 ) {
      this.dynamicComponentRef.instance.selectedItems=this.selection.selected;
      this.selectedItems=this.selection.selected;
      this.dynamicComponentRef.instance.selectedItemsCount = this.selection.selected.length;
    }
  }
  createDynamicComponent(selectedContacts) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NavActionsComponent);
    this.dynamicComponentContainer.clear();
  
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    const navActionsComponentInstance: NavActionsComponent = componentRef.instance;
    navActionsComponentInstance.selectedItems = selectedContacts;
    this.selectedItems=selectedContacts;

    navActionsComponentInstance.componentName =this.msgCategory;

    // Assign the componentRef to this.dynamicComponentRef
    this.dynamicComponentRef = componentRef;
  
    // Pass selected row data to the dynamic component
    let sub1 = navActionsComponentInstance.selectAllEvent.subscribe(() => {
      // Logic to handle "Select All" event
      this.selectAllRows();
    });
    let sub2 = navActionsComponentInstance.deselectAllEvent.subscribe((res) => {
     if(res){
      this.distroyDynamicComponent();
      // this.selectionData.emit(this.selection);
    }
    });
    let sub3 =  navActionsComponentInstance.updateData.subscribe((res) => {
      if(res){
        this.getMessages(this.deviceId);
        this.distroyDynamicComponent();
        
      }
    });
    let sub4 =  navActionsComponentInstance.resendFailedMessages.subscribe((res) => {
      this.resendSelectedMessages();
    });
    this.navActionSubscriptions.push(sub1,sub2,sub3,sub4)

  }
distroyDynamicComponent(){
  this.selection.clear();
  this.dynamicComponentContainer.clear();
  this.dynamicComponentRef = null;
  this.navActionSubscriptions.map((sub)=>sub.unsubscribe());
}

onCheckboxChange(event,element: any) {
  if(event.checked == false && this.dynamicComponentRef){
    if(this.msgCategory === 'failed'){
      this.dynamicComponentRef.instance.showFailedMsgMenueItems();
    }
    else{
      this.dynamicComponentRef.instance.showMessageMenueItems();
    }
    
  }
  if(this.selection.selected.length  > 0 && !this.dynamicComponentRef){
    this.createDynamicComponent(this.selection.selected);
    this.dynamicComponentRef.instance.selectedItemsCount = this.selection.selected.length;

    // this.selectionData.emit(this.selection);

  }
  else if(this.selection.selected.length  === 0 && this.dynamicComponentRef){
    this.distroyDynamicComponent()

    // this.selectionData.emit(this.selection);
  }
  if (this.dynamicComponentRef && this.selection.selected.length  > 0 ) {
    this.dynamicComponentRef.instance.selectedItems=this.selection.selected;
    this.selectedItems=this.selection.selected;

    this.dynamicComponentRef.instance.selectedItemsCount = this.selection.selected.length;
  }
}

      getMessages(deviceId:string,msgCat?,filterdItems?,searchVal?){
        let shows=this.messageService.display;
        let email=this.messageService.email;
        let msgCategory=msgCat? msgCat : this.msgCategory;
        let search=searchVal?searchVal:"";
        let pageNumber=searchVal?0:this.pageIndex
        if(searchVal && this.paginator){
          this.paginator.pageIndex=0
        }
        this.loading = true;
        let messagesSub=this.messageService.getMessages(email,msgCategory,shows,pageNumber,search,deviceId,filterdItems).subscribe(
          (res)=>{
            this.numRows=res.length;
  
            
            // this.dataSource=new MatTableDataSource<Message>(res)
            this.messagesTableData=res
            //
          if(search!=""){
            this.length=res.length;
            this.loading = false;

            if(this.length==0){
              this.notFound=true;
            }
            else{
              this.notFound=false;
            }
          }
          else{
            if(this.paginator){
            this.paginator.pageIndex=this.pageIndex
            }
            this.notFound=false;
          
            this.getMessagesCount(deviceId,msgCategory,filterdItems);
  
          }
          },
          (err)=>{
           this.loading = false;
           this.length=0;
           this.noData=true;
  
          }
        )
        this.subscribtions.push(messagesSub)
      }
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
      onPageSizeChange(event){
        this.messageService.display=event.value;
        this.messageService.updateDisplayNumber(event.value)
        this.pageIndex=0; 
        
        if(this.paginator)
          {
            this.paginator.pageSize = event.value;
            this.paginator.pageIndex=0;
          }
        this.getMessages(this.deviceId);

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
      this.displayedColumns=['select',...event,'Action']
    }
    else if(this.msgCategory!='failed' && this.canEdit){
      this.displayedColumns=['select',...event]
    }
    else{
      this.displayedColumns=[...event]
    }
  
  
    }
  
    onPageChange(event){
      this.pageIndex=event.pageIndex;
      this.selection.clear();
      this.getMessages(this.deviceId);
  
    }
    tableData(){
      if(this.msgCategory=='inbox'){

        this.displayed = INBOXHEADER.filter((_, index) => index !== 1);
        this.displayedColumns = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At'];
      }
      else if(this.msgCategory=='outbox'){
        this.displayed = OUTBOX.filter((_, index) => index !== 1);;
        this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At','Updated At','Status'];
      }
      else if(this.msgCategory=='failed'){
        this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At',"Action"];
        this.displayed = FAILED.filter((_, index) => index !== 1);;
  
      }
      this.columns.setValue(this.displayedColumns)
  
    }
    displayMessage(row){
 
      const currentLang=this.translationService.getCurrentLanguage()
      const dialogConfig=new MatDialogConfig();
      dialogConfig.height='60vh';
      dialogConfig.width='100vw';
      dialogConfig.maxWidth='100%';
      dialogConfig.minWidth='100%';
      dialogConfig.disableClose = true;
      dialogConfig.position = { bottom: '0'} ;
      dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
      dialogConfig.panelClass ='bottom-to-top-dialog';

      dialogConfig.data={message:row};

      const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        }
  
      });
    this.openedDialogs.push(dialogRef)
    }
    reSendMessage(msgId){
      const dialogConfig=new MatDialogConfig();
      dialogConfig.height='40vh';
      dialogConfig.width='100vw';
      dialogConfig.minHeight='428';
      dialogConfig.maxWidth='100vw';
      dialogConfig.disableClose = true;
      dialogConfig.panelClass = 'custom-mat-dialog-container';

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
    resendSelectedMessages(){
      const messagesIDs=this.selection.selected.map((res)=>res.id)
       const dialogConfig=new MatDialogConfig();
       dialogConfig.height='40vh';
       dialogConfig.width='100vw';
       dialogConfig.minHeight='428';
       dialogConfig.maxWidth='100vw';
       dialogConfig.disableClose = true;
       dialogConfig.panelClass = 'custom-mat-dialog-container';
       dialogConfig.data ={
         from:"messages",
         data: {
           messageIds:messagesIDs,
           email: this.authService.getUserInfo().email,
           deviceId: this.deviceId
         }
       }
      
       const dialogRef = this.dialog.open(ResendMessagesComponent,dialogConfig);
       dialogRef.afterClosed().subscribe(result => {
         if(result){
           this.selection.clear();
           this.getMessages(this.deviceId,"failed");
           this.distroyDynamicComponent();

         }
       });
     }
    ngOnDestroy(){
     
      this.openedDialogs.forEach((dialog) => {
        if (dialog) {
          dialog.close();
        }
      })
      this.selection.clear();
  
      this.subscribtions.map(e => e.unsubscribe());
    }
    selectFilter(item){
    // this.selectedItems.push(item);
        let selected= this.selectedItems.map((sel)=>sel.value-1)
    this.getMessages(this.deviceId,"outbox",selected )  
    }
    deselectFilter(item){
        let selected= this.selectedItems.map((sel)=>sel.value-1)
      this.getMessages(this.deviceId,"outbox",selected )   
  
    }
  }
  


