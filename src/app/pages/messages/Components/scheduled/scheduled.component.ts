import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {  Shceduled } from '../../message';
import { MessagesService } from '../../messages.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DisplayMessageComponent } from '../display-message/display-message.component';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DevicesService } from 'src/app/pages/devices/devices.service';
import { DevicesPermissions } from 'src/app/pages/compaigns/compaigns.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SCHEDULED } from '../constants/messagesConst';
import { TranslationService } from 'src/app/shared/services/translation.service';



@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss']
})
export class ScheduledComponent implements OnInit ,AfterViewInit {
  length:number=0;
  numRows;
  loading:boolean=true;
  @Output() isChecked = new EventEmitter<Shceduled[]>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  cellClick:boolean=false;
  columns :FormControl;
  displayed: string[] = SCHEDULED;
  displayedColumns: string[] = ['Device Name', 'Recipient', 'Messages', 'Created At','Scheduled At'];
  dataSource:MatTableDataSource<Shceduled>;
  selection = new SelectionModel<Shceduled>(true, []);

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
  pageNum: number;
  display: number;
  constructor(private messageService:MessagesService,
    public dialog: MatDialog,
    private authService:AuthService,
    private translationService:TranslationService){
      this.display=this.messageService.getUpdatedDisplayNumber()
      this.pageNum=this.messageService.pageNum;
    }
  ngAfterViewInit(): void {
    this.paginator.pageSize=this.messageService.display;
    }
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
 // get devices data
 getDevices(){
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
      let messagesSub=this.messageService.getScheduledMessages(email,shows,this.pageNum,deviceId).subscribe(
        (res)=>{
          this.numRows=res.length;
          this.loading = false;
          this.dataSource=new MatTableDataSource<Shceduled>(res)

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

      onPageChange(event){
        this.messageService.display=event.pageSize;
        this.selection.clear();
        this.pageNum=event.pageIndex;
        this.messageService.updateDisplayNumber(event.pageSize)
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


