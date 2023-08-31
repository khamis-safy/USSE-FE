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



@Component({
  selector: 'app-scheduled',
  templateUrl: './scheduled.component.html',
  styleUrls: ['./scheduled.component.scss']
})
export class ScheduledComponent implements OnInit  {
  length:number=0;
  numRows;
  loading:boolean=false;
  @Output() isChecked = new EventEmitter<Shceduled[]>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  cellClick:boolean=false;
  columns :FormControl;
  displayed: string[] = ['Device Name', 'Recipient', 'Messages', 'Created At','Scheduled At'];
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
  constructor(private messageService:MessagesService,public dialog: MatDialog,private devicesService:DevicesService){}
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


// set default device to be first one

// get device's messages
    this.getDevices();


    }
   // get devices data
   getDevices(){
    this.devicesService.getDevices(this.devicesService.email,10,0,"","").subscribe(
      (res)=>{

        let devicesData=res;
        this.devices = res.map(res=>{
          return {
            title:res.deviceName,
            value:res.id
          }
        });
        console.log(this.devices)
        if(this.devices.length==0){
          this.deviceLoadingText='No Results';
          // set no data design
          this.noData=true
        }
        else{
          this.noData=false

          this.deviceId=res[0].id;
          this.getMessages(this.deviceId);
            this.form.patchValue({
              devicesData: {
                title:devicesData[0]?.deviceName,
                value:devicesData[0]?.id
              }

     })
      }},
      (err)=>{

      }
    )
  }

  onSelect(device){
    this.deviceId=device.value;
    this.getMessages(this.deviceId)
        }
    getMessages(deviceId:string){
      this.getMessagesCount(deviceId);
      let shows=this.messageService.display;
      let pageNum=this.messageService.pageNum;
      let email=this.messageService.email;
      this.loading=true;
      let messagesSub=this.messageService.getScheduledMessages(email,shows,pageNum,deviceId).subscribe(
        (res)=>{
          this.numRows=res.length;
          this.loading = false;
          this.dataSource=new MatTableDataSource<Shceduled>(res)

        },
        (err)=>{
         this.loading = false;
         this.length=0;

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
          this.length=0;
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
        this.messageService.pageNum=event.pageIndex;
        this.selection.clear();

        this.getMessages(this.deviceId);

      }

      onCellClick(recipient){
        const dialogConfig=new MatDialogConfig();
        dialogConfig.height='100vh';
        dialogConfig.width='25vw';
        dialogConfig.maxWidth='100%';
        dialogConfig.disableClose = true;
        dialogConfig.position = { right: '2px'};
        dialogConfig.direction ="ltr";
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
          const dialogConfig=new MatDialogConfig();
          dialogConfig.height='100vh';
          dialogConfig.width='25vw';
          dialogConfig.maxWidth='100%';
          // dialogConfig.minWidth='200px';
          dialogConfig.disableClose = true;
          dialogConfig.position = { right: '2px'};
          dialogConfig.direction ="ltr";
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


