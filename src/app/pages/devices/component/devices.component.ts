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
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

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
  delay:number;
  @Input() isCanceled:boolean;
  noData: boolean;
  sessionName:string;
  notFound: boolean=false;
  isReonnect:boolean=false;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("search") search!:ElementRef
  deletedContacts:string[]=[];
  columns :FormControl;
  displayed: string[] = ['Device Name', 'Device Type', 'Number',"Create At", "Status","Delay Interval(s)"];
  displayedColumns: string[] = ['Device Name', 'Device Type', 'Number',"Create At", "Status","Delay Interval(s)","action"];
  dataSource:MatTableDataSource<DeviceData>;
  canEdit: any;
  constructor(public dialog: MatDialog,    private translate: TranslateService,
    private  toaster: ToasterServices,private authService:AuthService,private devicesService:DevicesService){
  }
  ngOnInit() {
    this.getDevices();
    this.columns=new FormControl(this.displayedColumns)
    let permission =this.devicesService.DevicesPermission
    let customerId=this.authService.userInfo.customerId;

if(permission){
  if(permission.value=="ReadOnly" || permission.value =="None"){
    this.canEdit=false
  }
  else{
    this.canEdit=true
  }

}
else{

  this.canEdit=true
}
this.displayedColumns=this.canEdit?['Device Name', 'Device Type', 'Number',"Create At", "Status","Delay Interval(s)","action"]:['Device Name', 'Device Type', 'Number',"Create At", "Status"];
  }

  getDevices(){
    let shows=this.devicesService.display;
    let pageNum=this.devicesService.pageNum;
    let email=this.devicesService.email;
    let orderedBy=this.devicesService.orderedBy;
    let search=this.devicesService.search;
    this.loading = true;
    this.isReonnect=false;

    this.devicesService.getDevices(email,shows,pageNum,orderedBy,search).subscribe(
      (res)=>{
        this.numRows=res.length;
        this.loading = false;
        this.dataSource=new MatTableDataSource<DeviceData>(res);
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
        this.getDevicesCount();

      }
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
       this.length=res;
       if( this.length==0){
        this.noData=true;

      }
      else{
         this.noData=false;

       }
       },
       (err)=>{
        this.length=0;
        this.noData=true;
       })
  }

  changeColumns(event){
    if(this.canEdit){

      this.displayedColumns=[...event,'action']
    }
else{
  this.displayedColumns=[...event]

}

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

  reconnect(device:DeviceData){
    this.loading=true;
    this.isReonnect=true;
    this.devicesService.reconnectWPPDevice(device.id,this.devicesService.email).subscribe(
      (res)=>{

        this.getDevices();
      },
      (error: HttpErrorResponse) => {
        this.loading=false;
        if (error.status === 400 && error.error) {


          const sessionName = error.error.sessionName;

          this.openStepsModal({sessionName:sessionName,device:device})


        } else {
          // Handle other error scenarios
          this.toaster.error("Error")
        }
      }
    )
  }

  openStepsModal(data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='95vh';
    dialogConfig.width='70vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.disableClose = true;
    if(data){
      dialogConfig.data=data
    }
    const dialogRef = this.dialog.open(StepsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(data){

           this.reconnect(data.device)
        }
                this.toaster.success( this.translate.instant("COMMON.SUCC_MSG"));

      }
      this.getDevices();

    });


  }

  updateDeviceDelay(id: string) {

     //console.log(this.delay)
    this.devicesService.updateDeviceDelay(this.devicesService.email, id, this.delay).subscribe(
      (res) => {

        this.delay=  res.delayIntervalInSeconds ;
        this.getDevices()
         // console.log(res);
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
