import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-expectedCampEndTime',
  templateUrl: './expectedCampEndTime.component.html',
  styleUrls: ['./expectedCampEndTime.component.scss']
})
export class ExpectedCampEndTimeComponent implements OnInit {
  isLoading:boolean;
  timeTaken:string;
  constructor(public dialogRef: MatDialogRef<ExpectedCampEndTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  this.timeTaken=this.data
  }
  continue() {
   this.onClose(true)
  }
    
  onClose(data?): void {
    this.dialogRef.close(data);
}
}
