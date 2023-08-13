import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { DevicesService } from '../devices.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { StepsComponent } from '../components/steps/steps.component';
import { DeviceData } from '../device';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteContactComponent } from '../../manage-contacts/components/contacts/deleteContact/deleteContact.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit{
  length:number;
  active:boolean=false;
  numRows;
  loading;
  delay:number=5;
  @Input() isCanceled:boolean;


  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("search") search!:ElementRef

  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: string[] = ['Device Name', 'Device Type', 'Number',"Create At", "Status","Delay Interval(s)"];
  displayedColumns: string[] = ['Device Name', 'Device Type', 'Number',"Create At", "Status","Delay Interval(s)","action"];
  dataSource:MatTableDataSource<DeviceData>;
  constructor(public dialog: MatDialog,private  toaster: ToasterServices,private devicesService:DevicesService){
  }
  ngOnInit() {
    this.getDevices();
    this.columns=new FormControl(this.displayedColumns)

  }
  getDevices(){
    this.getDevicesCount();
    let shows=this.devicesService.display;
    let pageNum=this.devicesService.pageNum;
    let email=this.devicesService.email;
    let orderedBy=this.devicesService.orderedBy;
    let search=this.devicesService.search;
    this.loading = true;
    this.devicesService.getDevices(email,shows,pageNum,orderedBy,search).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;
        this.dataSource=new MatTableDataSource<DeviceData>(res)
       },
       (err)=>{
        this.loading = false;
        this.length=0;
       })
  }

  onSortChange(event){
    let sorting = event.active=='Device Name' && event.direction=='asc'?'nameASC':
                  event.active=='Device Name' && event.direction=='desc'?'nameDEC':

                  event.active=='Create At' && event.direction=='asc'?'createdAtASC':
                  event.active=='Create At' && event.direction=='desc'?'createdAtDEC':
                  '';
    this.devicesService.orderedBy=sorting;

    this.getDevices();
  }



  getDevicesCount(){
    this.devicesService.getDevicesCount(this.devicesService.email).subscribe(
      (res)=>{
       this.length=res
       },
       (err)=>{
        this.length=0;
       })
  }
  openStepsModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='95vh';
    dialogConfig.width='70vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(StepsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getDevices();
      }

    });


  }

  changeColumns(event){

      this.displayedColumns=[...event,'action']


  }

  onPageChange(event){
    this.devicesService.display=event.pageSize;
    this.devicesService.pageNum=event.pageIndex;
    this.getDevices();

  }
  onSearch(event:any){
    this.devicesService.search=event.value;
    this.getDevices();
  }

  reconnect(id:string){
    this.devicesService.reconnectWPPDevice(this.devicesService.email,id).subscribe(
      (res)=>{
        this.getDevices();
      },
      (err)=>{
        this.toaster.error("Error")

      }
    )
  }
  updateDeviceDelay(id: string) {

    this.devicesService.updateDeviceDelay(this.devicesService.email, id, this.delay).subscribe(
      (res) => {

          res.delayIntervalInSeconds = this.delay;
          console.log(res);
        }



    )
  }
  openDeleteModal(id:string){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data =
    {
      deviceData:{deviceId:id}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getDevices();
      }
    });
  }
}
