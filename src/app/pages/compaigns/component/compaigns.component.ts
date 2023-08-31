import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { CompaignsService } from '../compaigns.service';
import { Router } from '@angular/router';
import { compaignDetails } from '../campaigns';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';
import { DevicesService } from '../../devices/devices.service';



@Component({
  selector: 'app-compaigns',
  templateUrl: './compaigns.component.html',
  styleUrls: ['./compaigns.component.scss']
})
export class CompaignsComponent implements AfterViewInit ,OnInit {

  length:number=0;
  loading:boolean=false;
  cellClick:boolean=false;
  isCompagins:boolean=true;
  isSearch:boolean=false;
  columns :FormControl;
  displayed: string[] = ['Name', 'Status', 'Creator Name', 'Start Date'];
  displayedColumns: string[] = ['Name', 'Status', 'Creator Name', 'Start Date','Action'];
  dataSource:MatTableDataSource<compaignDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  noData: boolean=false;
  notFound: boolean=false;
  canEdit: boolean;
  // devices
  devices:SelectOption[];
  deviceLoadingText:string='Loading ...';
  devicesData :any= new FormControl([]);
  form = new FormGroup({
    devicesData:this.devicesData,
  });
  deviceId:string;
  constructor(private devicesService:DevicesService,private compaignsService:CompaignsService,public dialog: MatDialog, private router:Router,private authService:AuthService){}


  ngOnInit() {

// set default device to be first one

// get device's messages
this.getDevices();



    this.columns=new FormControl(this.displayedColumns)

    let permission =this.compaignsService.compaignssPermission
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
this.displayedColumns=this.canEdit?['Name', 'Status', 'Creator Name', 'Start Date','Action']:['Name', 'Status', 'Creator Name', 'Start Date'];
  }
  ngAfterViewInit() {
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
        this.getCompaigns(this.deviceId);
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
  this.getCompaigns(this.deviceId)
      }

backToCompaigns(event){
this.isCompagins=event;
if(this.isCompagins){
  this.getCompaigns(this.deviceId);
}
}
  getCompaigns(deviceId:string){

    let shows=this.compaignsService.display;
    let pageNum=this.compaignsService.pageNum;
    let email=this.compaignsService.email;
    let search=this.compaignsService.search;
    this.loading = true;
    this.compaignsService.getCampaigns(email,shows,pageNum,search,deviceId).subscribe(
      (res)=>{
        this.loading = false;
        this.dataSource=new MatTableDataSource<compaignDetails>(res);
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
          this.compaignsCount(deviceId);
          this.isSearch=false;


        }
        console.log(res)

      },
      (err)=>{
       this.loading = false;
       this.length=0;

      }
    )
  }
compaignsCount(deviceId){
  let email=this.compaignsService.email;
  this.compaignsService.compaignsCount(email,deviceId).subscribe(
    (res)=>{
      this.length=res;
    }
    ,(err)=>{
      this.length=0;
    }
  )

}
  changeColumns(event){
    this.displayedColumns=[...event]
    }

  addCampaigns(){
    this.isCompagins=false;
  }

  onPageChange(event){
    this.compaignsService.display=event.pageSize;
    this.compaignsService.pageNum=event.pageIndex;

    this.getCompaigns(this.deviceId);

  }

  compaignDetails(com:compaignDetails){
    if(!this.cellClick){
      let id=com.id;
      this.router.navigateByUrl(`compaign/${id}`)
    }
  }
  stopComaign(element){

    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data =
    {
      compaignData:{compaignId:element.id,action:"stop"}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompaigns(this.deviceId);
      }
    });


  }
  deleteCompaign(element){
    console.log("delete compaign")

    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height='50vh';
    dialogConfig.width='35vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.data =
    {
      compaignData:{compaignId:element.id,action:"delete"}
    }
    const dialogRef = this.dialog.open(DeleteModalComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCompaigns(this.deviceId);
      }
    });
  }

  onSearch(event:any){
    this.compaignsService.search=event.value;

    this.getCompaigns(this.deviceId);
  }
}

