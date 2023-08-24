import { Component , ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddTemplateComponent } from '../components/addTemplate/addTemplate.component';
import { InnerTemplatesComponent } from '../components/innerTemplates/innerTemplates.component';

import { MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent {

  @ViewChild(InnerTemplatesComponent) templates:InnerTemplatesComponent;

  constructor(public dialog: MatDialog) {}

  openAddTemplateModal(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.height='77vh';
    dialogConfig.width='40vw';
    dialogConfig.maxWidth='100%';
    dialogConfig.minWidth='300px';
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
