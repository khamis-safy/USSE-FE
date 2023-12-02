import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BotService } from '../../bot.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { AutomationActionComponent } from '../automationAction/automationAction.component';
import * as QRCode from 'qrcode-generator';
import { saveAs } from 'file-saver';
import { DeviceData } from 'src/app/pages/devices/device';
import { Automation } from '../../interfaces/automation';
@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Operations'];
  dataSource :MatTableDataSource<any>;
  length:number=0;
  id:number=0;
  loading:boolean=true;
  @Output() openNewAutomation = new EventEmitter<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  devices:SelectOption[];

  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData,
  });
  deviceId:string;
  pageNum: any=0;
  notFound: boolean;
  noData: boolean;
  display:number=10;
  search:string="";
  deviceNumber:string;
  alldevices:DeviceData[]=[];

  constructor(private botService : BotService ,
    private authService:AuthService,
    public dialog: MatDialog, ) { }

  ngOnInit() {
    this.getDevices();
 
  }

  exportQRCode(element) {
    // Generate QR code
    const typeNumber = 8; // adjust as needed
    const errorCorrectionLevel = 'M'; // adjust as needed
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    const qrData = this.generateQrString(element);
    qr.addData(qrData);
    qr.make();

    // Convert QR code to image data URL
    const qrCodeDataUrl = qr.createDataURL(10, 0);

    // Convert data URL to Blob
    const byteCharacters = atob(qrCodeDataUrl.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Save the Blob as a file using FileSaver.js
    saveAs(blob, 'qrcode.png');
  }
  generateQrString(element:Automation){
    let criteria=element.criterias[0].criteria
    const qrData =`https://api.whatsapp.com/send?phone=${this.deviceNumber}&text=${encodeURIComponent(criteria)}`
    return qrData
  }
   // get devices data
 getDevices(){
  this.authService.getDevices(this.authService.getUserInfo()?.email,10,0,"","").subscribe(
    (res)=>{
      this.alldevices=res;
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

      }
      else{
        this.noData=false

        this.deviceId=res[0].id;


        if(this.authService.selectedDeviceId ==""){

          this.form.patchValue({
          devicesData: {
          title:this.alldevices[0]?.deviceName,
          value:this.alldevices[0]?.id,
          deviceIcon:this.alldevices[0].deviceType

          }

          })
          this.deviceNumber=this.alldevices[0].deviceNumber;

        }
        else{
          let selected= this.devices.find((device)=>device.value==this.authService.selectedDeviceId);
          let deviceSelectedAllData=this.alldevices.find((device)=>device.id==this.authService.selectedDeviceId);
          this.deviceId=this.authService.selectedDeviceId;

          this.form.patchValue({
            devicesData: {
            title:selected.title,
            value:selected?.value,
            deviceIcon:selected.deviceIcon

            }

            })
            this.deviceNumber=deviceSelectedAllData.deviceNumber;

        }
      }
        this.getAutomations(this.deviceId);

    },
    (err)=>{
      this.loading = false;
      this.length=0;
      this.noData=true;

    }
  )
}
  getAutomations(deviceId,searchVal?){
 

    let shows=this.display;
    let email=this.authService.getUserInfo()?.email;
    let search=searchVal?searchVal:"";
    this.loading = true;
    let pageNumber=searchVal?0:this.pageNum
    if(searchVal && this.paginator){
      this.paginator.pageIndex=0
    }
      this.botService.getAutomations(email,shows,pageNumber,search,deviceId).subscribe(
        (res)=>{
          this.loading = false;
          this.dataSource=new MatTableDataSource<any>(res);
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
          this.paginator.pageIndex=this.pageNum
          this.notFound=false;
          this.getAutomationsCount(deviceId);


        }

        },
        (err)=>{
          this.loading = false;
          this.length=0;
      
  
        }
      )
    
  }
  getAutomationsCount(deviceId){
    this.loading=true
    let email=this.authService.getUserInfo()?.email;
    this.botService.getAutomationsCount(email,deviceId).subscribe(
      (res)=>{
        this.loading = false;
        this.length=res;
        if(this.length ==0){
          this.notFound=true;
        }
      }
      ,(err)=>{
  
        this.loading = false;
        this.length=0;
        this.noData=true;
  
      }
    )
  }
  onSelect(device){
    let foundDevice=this.alldevices.find((dev)=>dev.id==device.value)
    this.deviceNumber=foundDevice.deviceNumber;
    this.deviceId=device.value;
    this.authService.selectedDeviceId=device.value
    this.getAutomations(this.deviceId)

  }
  deleteAutomation(element){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data =
    {
      automationData:{automationId:element.id}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAutomations(this.deviceId);
      }
    });
  }
  editAutomation(element){

  }
  stopAutomation(element){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='45vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data ={id:element.id , action:'stop'}
   
    const dialogRef = this.dialog.open(AutomationActionComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAutomations(this.deviceId);
      }
    });
  }
  startAutomation(element){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='45vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.data ={id:element.id , action:'start'}
   
    const dialogRef = this.dialog.open(AutomationActionComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAutomations(this.deviceId);
      }
    });
  }
  addAutomation(){
    this.openNewAutomation.emit(true)
  }
  onPageChange(event){
    this.display=event.pageSize;
    this.pageNum=event.pageIndex;
    this.getAutomations(this.deviceId);

  }
  onSearch(event:any){

    this.getAutomations(this.deviceId,event.value);
  }
}
