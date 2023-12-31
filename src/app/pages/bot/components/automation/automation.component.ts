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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit {
  displayedColumns: string[] = ['Reorder','Name', 'Criterias','Status','Operations'];
  dataSource :MatTableDataSource<any>;
  length:number=0;
  id:number=0;
  loading:boolean=true;
  @Output() openNewAutomation = new EventEmitter<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  devices:SelectOption[];
  email:string=this.authService.getUserInfo()?.email;
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
  WrapperScrollLeft =0;
  WrapperOffsetWidth =250;
  constructor(private botService : BotService ,
    private authService:AuthService,
    public dialog: MatDialog, ) { }

  ngOnInit() {
    this.getDevices();
 
  }
  onListDrop(event: CdkDragDrop<string[]>) {
    const data = [...this.dataSource.data];
    moveItemInArray (data, event.previousIndex, event.currentIndex);
    this.dataSource.data = data;
    let orderedData=this.dataSource.data.map((automation, index)=>{
      return {
        automationId:automation.id,
        order:index
      }
    })
    this.botService.reOrderAutomations(this.email,this.deviceId,orderedData).subscribe()
  
  }

  exportQRCode(element) {
    const typeNumber = 16; // or adjust as needed
    const errorCorrectionLevel = 'L'; // or adjust as needed
    const qrData = this.generateQrString(element);
  
    // Convert the string to a Uint8Array using UTF-8 encoding
    const utf8Bytes = new TextEncoder().encode(qrData);
  
    // Convert the Uint8Array to a string
    const utf8String = String.fromCharCode.apply(null, utf8Bytes);
  
    // Generate QR code using the string
    const qr = QRCode(typeNumber, errorCorrectionLevel);
    qr.addData(utf8String, 'Byte');
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
    saveAs(blob, `${element.name}_qrcode.png`);
  }
  
  generateQrString(element: Automation): string {
    let criteria = element.criterias[0].criteria;
    return `https://api.whatsapp.com/send?phone=${this.deviceNumber}&text=${encodeURIComponent(criteria)}`;
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
scrollRight(element, wrapper: HTMLElement) {
  element.hideLeftArrow = false;
element.WrapperOffsetWidth = wrapper.offsetWidth;

// Calculate the total width of list items dynamically
const totalListWidth = Array.from(wrapper.querySelectorAll('.criteriaName')).reduce((acc, listItem) => {
  // Calculate the width of each list item and add it to the accumulator
  const listItemWidth = listItem.clientWidth;
  return acc + listItemWidth;
}, 0);



// Update hideRightArrow based on the scroll position
if (this.WrapperScrollLeft > totalListWidth - element.WrapperOffsetWidth) {
  element.hideRightArrow = true;
} else {
  element.hideRightArrow = false;
}
this.WrapperScrollLeft = wrapper.scrollLeft + 100;
// Scroll to the calculated position
wrapper.scrollTo({
  left: this.WrapperScrollLeft,
  behavior: "smooth",
});
}
scrollLeft(element , wrapper){
  element.hideRightArrow = false;
  this.WrapperScrollLeft =wrapper.scrollLeft-100
  if(this.WrapperScrollLeft<=5){
    this.WrapperScrollLeft =0;
    element.hideLeftArrow=true;
    
  }
  wrapper.scrollTo({
    left: this.WrapperScrollLeft,
    behavior: "smooth",
  })
  


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

  addAutomation(){
    this.openNewAutomation.emit({openNewAutomation:true , editAutomationData:null})

  }
    editAutomation(element){
    this.openNewAutomation.emit({openNewAutomation:true , editAutomationData:element})
  }
  onPageChange(event){
    this.display=event.pageSize;
    this.pageNum=event.pageIndex;
    this.getAutomations(this.deviceId);

  }
  onSearch(event:any){

    this.getAutomations(this.deviceId,event.value);
  }
  onSwitcherChange(e,automation){
    e.target.checked ? this.startAutomation(automation):this.stopAutomation(automation)
  }


  stopAutomation(automation){
    this.botService.stopWhatsappBusinessAutomation(automation.id, this.authService.getUserInfo()?.email).subscribe(
      (res) => {
      


      },
      (err) => {
       
      }
    
    )
    
  }
  startAutomation(automation){
    this.botService.startWhatsappBusinessAutomation(automation.id, this.authService.getUserInfo()?.email).subscribe(
      (res) => {
     


      },
      (err) => {
     
      }
    
    )
  }
}
