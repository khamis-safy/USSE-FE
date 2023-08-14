import { Component } from '@angular/core';
import { AddTemplateComponent } from '../components/addTemplate/addTemplate.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogConfig,
} from '@angular/material/dialog';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent {
  constructor(private matDialog: MatDialog) {}
  openDialog() {
    this.matDialog.open(AddTemplateComponent, {
      height:'70vh' ,
      width: '30vw',

    });



  }
}




