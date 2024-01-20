import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DevicesPermissions } from 'src/app/pages/compaigns/compaigns.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslationService } from 'src/app/shared/services/translation.service';
import { SCHEDULED } from '../../Components/constants/messagesConst';
import { DisplayMessageComponent } from '../../Components/display-message/display-message.component';
import { Shceduled } from '../../message';
import { MessagesService } from '../../messages.service';

@Component({
  selector: 'app-scheduled-mobileView',
  templateUrl: './scheduled-mobileView.component.html',
  styleUrls: ['./scheduled-mobileView.component.scss']
})
export class ScheduledMobileViewComponent implements OnInit {

    length:number=0;
    numRows;
    loading:boolean=true;
    @Output() isChecked = new EventEmitter<Shceduled[]>;
    @Output() isOpenNewMessage = new EventEmitter<boolean>;
    @Output() selectedDeviceId = new EventEmitter<string>;

    @ViewChild(MatPaginator)  paginator!: MatPaginator;
    cellClick:boolean=false;
    columns :FormControl;
    displayed: string[] = SCHEDULED.filter((_, index) => index !== 1);;
    displayedColumns: string[] = ['Device Name', 'Recipient', 'Messages', 'Created At','Scheduled At'];
    dataSource:MatTableDataSource<Shceduled>;
    selection = new SelectionModel<Shceduled>(true, []);
    messagesTableData:any=[]

    // devices
    devices:SelectOption[];
    deviceLoadingText:string='Loading ...';
    devicesData :any= new FormControl([]);
    form = new FormGroup({
      devicesData:this.devicesData,
    });
    deviceId:string;
    subscribtions:Subscription[]=[];
    noData: boolean;
    isUser: boolean;
    permission:DevicesPermissions[];
    pageIndex: number;
    display: number;
    showsOptions:SelectOption[]=[
      {title:'10',value:10},
      {title:'50',value:50},
      {title:'100',value:100}
  
  
    ];
    showsSelectedOptions:any = new FormControl([]);
  
    displayForm = new FormGroup({
      showsSelectedOptions:this.showsSelectedOptions,
     
    });
    constructor(private messageService:MessagesService,
      public dialog: MatDialog,
      private authService:AuthService,
      private translationService:TranslationService){
        this.display=this.messageService.getUpdatedDisplayNumber()
        this.pageIndex=this.messageService.pageNum;
      }
    ngAfterViewInit(): void {
      }
    ngOnInit() {
     
      this.columns=new FormControl(this.displayedColumns)
      this.displayForm.patchValue({
        showsSelectedOptions: {
        title:String(this.messageService.getUpdatedDisplayNumber()),
        value:this.messageService.getUpdatedDisplayNumber(),
        }
        })
      this.selection.changed.subscribe(
        (res) => {
  
          if(res.source.selected.length){
  
            this.isChecked.emit(res.source.selected)
          }
          else{
            this.isChecked.emit()
          }
        });
  
  
        this.permission =this.messageService.devicesPermissions;
        if(this.authService.getUserInfo()?.customerId!=""){
          this.isUser=true;
        }
        else{
          this.isUser=false;
        }
  // get device's messages
      this.getDevices();
  
  
      }
      openNewMessage(){
        this.isOpenNewMessage.emit(true)
      }
   // get devices data
   getDevices(){
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
            this.form.patchValue({
              devicesData: {
              title:selected.title,
              value:selected?.value,
              deviceIcon:selected.deviceIcon
              }
  
              })
          }
          this.getMessages(this.deviceId);
      }},
      (err)=>{
        this.loading = false;
        this.length=0;
        this.noData=true;
      }
    )
  }
    onSelect(device){
      this.deviceId=device.value;
      this.authService.selectedDeviceId=device.value
  
      this.getMessages(this.deviceId)
          }
      getMessages(deviceId:string){
        this.getMessagesCount(deviceId);
        let shows=this.messageService.display;
        let email=this.messageService.email;
        this.loading=true;
        let messagesSub=this.messageService.getScheduledMessages(email,shows,this.pageIndex,deviceId).subscribe(
          (res)=>{
            this.numRows=res.length;
            this.loading = false;
            this.messagesTableData=res
  
          },
          (err)=>{
           this.loading = false;
           this.length=0;
           this.noData=true;
  
          }
        )
        this.subscribtions.push(messagesSub)
      }
  
      getMessagesCount(deviceId){
        let email=this.messageService.email;
        this.messageService.listScheduledMessagesCount(email,deviceId).subscribe(
          (res)=>{
            this.length=res;
          }
          ,(err)=>{
            this.loading = false;
            this.length=0;
            this.noData=true;
          }
        )
  
      }
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
  
      changeColumns(event){
        //  change displayed column based on component type
        this.displayedColumns=[...event]
  
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
        onPageChange(event){
          this.pageIndex=event.pageIndex;
          this.selection.clear();
          this.getMessages(this.deviceId);
  
        }
  
        onCellClick(recipient){
          const currentLang=this.translationService.getCurrentLanguage()
  
          const dialogConfig=new MatDialogConfig();
          dialogConfig.height='100vh';
          dialogConfig.width='25vw';
          dialogConfig.maxWidth='100%';
          dialogConfig.disableClose = true;
          dialogConfig.position =  currentLang=='en'?{ right: '2px'} :{ left: '2px'} ;
          dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
          dialogConfig.data={
            recipients:recipient,
            isScheduleN:true
          };
          const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);
  
          dialogRef.afterClosed().subscribe(result => {
            if(result){
            }
  
          });
        }
  
        displayMessage(row){
          if(!this.cellClick){
            const currentLang=this.translationService.getCurrentLanguage()
            const dialogConfig=new MatDialogConfig();
            dialogConfig.height='100vh';
            dialogConfig.width='25vw';
            dialogConfig.maxWidth='100%';
            // dialogConfig.minWidth='200px';
            dialogConfig.disableClose = true;
            dialogConfig.position =  currentLang=='en'?{ right: '2px'} :{ left: '2px'} ;
            dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
            dialogConfig.data={
              schedule:row,
              isScheduleM:true
            };
            const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);
  
            dialogRef.afterClosed().subscribe(result => {
              if(result){
              }
  
            });
          }
  
        }
  
  }

