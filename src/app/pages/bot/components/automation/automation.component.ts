import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BotService } from '../../bot.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

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
  constructor(private botService : BotService ,
    private authService:AuthService,
    public dialog: MatDialog, ) { }

  ngOnInit() {
    this.getDevices();

  }
   // get devices data
 getDevices(){
  this.authService.getDevices(this.authService.getUserInfo()?.email,10,0,"","").subscribe(
    (res)=>{
      let alldevices=res;
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
  editAutomation(elemen){

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
