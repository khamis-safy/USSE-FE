import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild , ChangeDetectorRef } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MessagesService } from '../../messages.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../../message';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DisplayMessageComponent } from '../display-message/display-message.component';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { DevicesPermissions } from 'src/app/pages/compaigns/compaigns.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FAILED, INBOXHEADER, OUTBOX } from '../constants/messagesConst';
import { TranslationService } from 'src/app/shared/services/translation.service';

@Component({
  selector: 'app-message-type',
  templateUrl: './message-type.component.html',
  styleUrls: ['./message-type.component.scss']
})
export class MessageTypeComponent implements OnInit ,OnDestroy {

  length:number=0;
  numRows;
  loading:boolean=true;
  @Input() msgCategory:string="inbox"
  @Output() isChecked = new EventEmitter<Message[]>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild("search") search!:ElementRef
  @Input() canEdit: boolean;

  // devices
  devices:SelectOption[];
  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData,
  });
  deviceId:string;

  columns :FormControl;
  displayed: string[] ;
  displayedColumns: string[] = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At','Updated At','Status','Ation'];
  dataSource:MatTableDataSource<Message>;
  selection = new SelectionModel<Message>(true, []);

  subscribtions:Subscription[]=[];
  noData: boolean;
  notFound: boolean;
  isUser: boolean;
  permission:DevicesPermissions[];
  constructor(public cdr: ChangeDetectorRef ,
    public dialog: MatDialog,
    private messageService:MessagesService,
    private authService:AuthService,
    private translationService:TranslationService){}
  ngOnInit() {

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

this.permission =this.messageService.devicesPermissions;
if(this.authService.userInfo.customerId!=""){
  this.isUser=true;
}
else{
  this.isUser=false;
}
// get device's messages
    this.getDevices(this.msgCategory);


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
  this.authService.getDevices(this.messageService.email,10,0,"","").subscribe(
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
          value:res.id
        }
      });
      if(this.devices.length==0){
        this.deviceLoadingText='No Results';
        // set no data design
        this.noData=true
      }
      else{
        this.noData=false

        this.deviceId=res[0].id;

      this.getDevicePermission(this.deviceId);

        if(this.authService.selectedDeviceId ==""){

          this.form.patchValue({
          devicesData: {
          title:alldevices[0]?.deviceName,
          value:alldevices[0]?.id
          }

          })
        }
        else{
          let selected= this.devices.find((device)=>device.value==this.authService.selectedDeviceId)
          this.deviceId=this.authService.selectedDeviceId;
          this.form.patchValue({
            devicesData: {
            title:selected.title,
            value:selected?.value
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

    getMessages(deviceId:string){
      let shows=this.messageService.display;
      let pageNum=this.messageService.pageNum;
      let email=this.messageService.email;
      let msgCategory=this.msgCategory;
      let search=this.messageService.search;
      this.loading = true;
      let messagesSub=this.messageService.getMessages(email,msgCategory,shows,pageNum,search,deviceId).subscribe(
        (res)=>{
          this.numRows=res.length;

          this.loading = false;
          this.dataSource=new MatTableDataSource<Message>(res)

          //
          if(search!=""){
            this.length=res.length;
            if(this.length==0){
              this.notFound=true;
            }
            else{
              this.notFound=false;
            }
        }
        else{
          this.getMessagesCount(deviceId);


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
    getMessagesCount(deviceId){
      this.loading=true
      let email=this.messageService.email;
      let msgCategory=this.msgCategory;
      this.messageService.getMessagesCount(email,msgCategory,deviceId).subscribe(
        (res)=>{
          this.length=res;
          this.loading=false
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
    this.messageService.search=event.value;
    this.selection.clear();
    this.getMessages(this.deviceId);
  }

  changeColumns(event){
  //  change displayed column based on component type
console.log("can edit",this.canEdit)
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
    this.messageService.pageNum=event.pageIndex;
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
      this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At'];
      this.displayed = FAILED;

    }
    this.columns.setValue(this.displayedColumns)

  }
  displayMessage(row){
    const currentLang=this.translationService.getCurrentLanguage()
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='100vh';
    dialogConfig.width='25vw';
    dialogConfig.maxWidth='100%';
    // dialogConfig.minWidth='200px';
    dialogConfig.disableClose = true;
    dialogConfig.position =  currentLang=='en'?{ right: '2px'} :{ left: '2px'} ;
    dialogConfig.direction = currentLang=='en'? "ltr" :"rtl";
    dialogConfig.data={message:row};
    const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });

  }
  ngOnDestroy(){
    this.selection.clear()
    this.subscribtions.map(e=>e.unsubscribe());
  }
}

