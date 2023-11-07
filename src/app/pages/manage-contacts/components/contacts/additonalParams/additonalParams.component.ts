import { Component, Inject, OnInit } from '@angular/core';
import { Contacts } from '../../../contacts';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-additonalParams',
  templateUrl: './additonalParams.component.html',
  styleUrls: ['./additonalParams.component.scss']
})
export class AdditonalParamsComponent implements OnInit {
contact:Contacts;
  constructor(public dialogRef: MatDialogRef<AdditonalParamsComponent>
    ,@Inject(MAT_DIALOG_DATA) public data:Contacts) { }

  ngOnInit() {
    this.contact=this.data
  }
  onClose(data?) {
    this.dialogRef.close(data);
  }
}
