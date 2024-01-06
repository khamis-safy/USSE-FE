import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
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
import { DEVICESHEADERS } from '../constants/constants';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit,OnDestroy{
  length:number;
  active:boolean=false;
  numRows;
  loading:boolean = true;
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
  displayed: string[] = DEVICESHEADERS;
  displayedColumns: string[] = ['Device Name', 'Device Type', 'Number',"Create At", "Status","Delay Interval(s)","action"];
  dataSource:MatTableDataSource<DeviceData>;
  canEdit: any;
  email:string=this.authService.getUserInfo()?.email;
  isTrialCustomer:boolean;
  constructor(public dialog: MatDialog,    private translate: TranslateService,
    private  toaster: ToasterServices,private authService:AuthService,private devicesService:DevicesService){
  }
  ngOnInit() {
    this.isTrialCustomer=this.authService.getSubscriptionState().isTrail ? this.authService.getSubscriptionState()?.isTrail : false;
    this.getDevices();
    this.columns=new FormControl(this.displayedColumns)
    let permission =this.devicesService.DevicesPermission
    let customerId=this.authService.getUserInfo()?.customerId;

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

  getDevices(searchVal?){
    let shows=this.devicesService.display;
    let pageNum=searchVal? 0 : this.devicesService.pageNum;
    let email=this.authService.getUserInfo()?.email;
    let orderedBy=this.devicesService.orderedBy;
    let search=searchVal?searchVal:"";
    this.loading = true;
    this.isReonnect=false;
  if(searchVal && this.paginator){
      this.paginator.pageIndex=0
    }
    
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
        this.paginator.pageIndex=this.devicesService.pageNum
        this.notFound=false;
        this.getDevicesCount();

      }
       },
       (err)=>{
        this.loading = false;
        this.length=0;
        this.noData=true;
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
    this.loading = true;
    this.devicesService.getDevicesCount(this.authService.getUserInfo()?.email).subscribe(
      (res)=>{
       this.length=res;
       this.loading = false;
       if( this.length==0){
        this.noData=true;

      
      }
      else{
         this.noData=false;

     
       }
       },
       (err)=>{
        
        this.loading = false;
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
    this.getDevices(event.value);
  }
  exportChats(device:DeviceData){
    this.devicesService.extractChats(this.email,device.id).subscribe(
      (response: any) => {
        // Use FileSaver.js to save the Excel file
        const filename = `${device.deviceName} whatsapp chats.xlsx`; // Set your desired filename and extension
        saveAs(response, filename);
      }
    )
  }
  reconnect(device:DeviceData){
    this.loading=true;
    this.isReonnect=true;
    this.devicesService.reconnectWPPDevice(device.id,this.email).subscribe(
      (res)=>{

        this.getDevices();
      },
      (error) => {
        this.loading=false;
        this.openStepsModal({sessionName:device.instanceId,device:device})
      }
    )
  }

  openStepsModal(data?){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='95vh';
    dialogConfig.width='70vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='987px';
    dialogConfig.maxHeight='705px';
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
    this.devicesService.updateDeviceDelay(this.authService.getUserInfo()?.email, id, this.delay).subscribe(
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
    dialogConfig.minWidth='465px';
    dialogConfig.data =
    {
      deviceData:{deviceId:id}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(id== this.authService.selectedDeviceId){
          this.authService.selectedDeviceId="";
        }
        this.getDevices();
      }
    });
  }
  ngOnDestroy(){
    this.devicesService.display=10;
    this.devicesService.pageNum=0;
    this.devicesService.orderedBy='';
    this.devicesService.search='';
  };
}
