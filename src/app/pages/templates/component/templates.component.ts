import { Component , ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddTemplateComponent } from '../components/addTemplate/addTemplate.component';
import { InnerTemplatesComponent } from '../components/innerTemplates/innerTemplates.component';

import { MatDialogModule} from '@angular/material/dialog';
import { TemplatesService } from '../templates.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent {

  @ViewChild(InnerTemplatesComponent) templates:InnerTemplatesComponent;
  canEdit: boolean;

  constructor(public dialog: MatDialog,private templateService:TemplatesService,private authService:AuthService) {
    let permission =this.templateService.TemplatesPermission
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
  }

  openAddTemplateModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='77vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='465px';
    dialogConfig.maxHeight='85vh';
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(AddTemplateComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.templates.getTemplates();
      }
    });
  }






}

