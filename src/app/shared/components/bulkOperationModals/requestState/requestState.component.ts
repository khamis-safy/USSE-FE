import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BulkOperations } from 'src/app/shared/interfaces/bulkOperations';

@Component({
  selector: 'app-requestState',
  templateUrl: './requestState.component.html',
  styleUrls: ['./requestState.component.scss']
})
export class RequestStateComponent implements OnInit {
  message:string = '';
  numOfSuccess:number=0;
  numOfErrors:number=0;
  constructor(private translate:TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: BulkOperations,
     public dialogRef: MatDialogRef<RequestStateComponent>,) { }

  ngOnInit() {
    this.numOfSuccess = this.data.numberOfSuccess;
    this.numOfErrors=this.data.numberOfErrors;
    
    this.message=`${this.numOfSuccess} ${this.translate.instant('COMMON.SUCC_MSG')} , ${this.numOfErrors} ${this.translate.instant('COMMON.ERR')}`
  }
  reviewError(){
    this.dialogRef.close(true)
  }
  onClose(){
    this.dialogRef.close()
  }
}
