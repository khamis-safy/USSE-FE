import { Component, OnInit } from '@angular/core';
import { DevicesService } from '../devices.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { StepsComponent } from '../components/steps/steps.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit{
  constructor(public dialog: MatDialog,private  toaster: ToasterServices,private devicesService:DevicesService){
  }
  ngOnInit() {

  }


  openStepsModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='95vh';
    dialogConfig.width='70vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
    dialogConfig.maxHeight='85vh';
    const dialogRef = this.dialog.open(StepsComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }

    });


  }
}
