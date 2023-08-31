import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-message-type',
  templateUrl: './message-type.component.html',
  styleUrls: ['./message-type.component.scss']
})
export class MessageTypeComponent implements OnInit ,OnDestroy {

  length:number=0;
  numRows;
  loading:boolean=false;
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
  displayed: string[] = ['Device Name', 'Sender', 'Messages', 'Received At'];
  displayedColumns: string[] = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At','Updated At','Status','Ation'];
  dataSource:MatTableDataSource<Message>;
  selection = new SelectionModel<Message>(true, []);

  subscribtions:Subscription[]=[];
  noData: boolean;
  notFound: boolean;

  constructor(public dialog: MatDialog,private devicesService:DevicesService,private messageService:MessagesService){}
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

        }
      )
      this.subscribtions.push(messagesSub)
    }
    getMessagesCount(deviceId){
      let email=this.messageService.email;
      let msgCategory=this.msgCategory;
      this.messageService.getMessagesCount(email,msgCategory,deviceId).subscribe(
        (res)=>{
          this.length=res;
        }
        ,(err)=>{
          this.length=0;
        }
      )
    }
    onSelect(device){
      this.deviceId=device.value;
      this.getMessages(this.deviceId)
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
  if(this.msgCategory=='failed'){
    this.displayedColumns=['select',...event,'Ation']
  }
  else{

    this.displayedColumns=['select',...event]
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

      this.displayed = ['Device Name', 'Sender', 'Messages', 'Received At'];
      this.displayedColumns = ['select' ,'Device Name', 'Sender', 'Messages', 'Received At'];
    }
    else if(this.msgCategory=='outbox'){
      this.displayed = ['Device Name', 'Recipient', 'Messages', 'Received At','Updated At','Status'];
      this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At','Updated At','Status'];
    }
    else if(this.msgCategory=='failed'){
      if(this.canEdit){
        this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At','Ation'];
      }
      else{
        this.displayedColumns = ['select' ,'Device Name', 'Recipient', 'Messages', 'Received At'];
      }
      this.displayed = ['Device Name', 'Recipient', 'Messages', 'Received At'];

    }

  }
  displayMessage(row){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='100vh';
    dialogConfig.width='25vw';
    dialogConfig.maxWidth='100%';
    // dialogConfig.minWidth='200px';
    dialogConfig.disableClose = true;
    dialogConfig.position = { right: '2px'};
    dialogConfig.direction ="ltr";
    dialogConfig.data={message:row};
    const dialogRef = this.dialog.open(DisplayMessageComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });

  }
  ngOnDestroy(){
    this.subscribtions.map(e=>e.unsubscribe());
  }
}

