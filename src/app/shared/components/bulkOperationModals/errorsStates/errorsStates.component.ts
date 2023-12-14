import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ErrorDetails } from 'src/app/shared/interfaces/bulkOperations';

@Component({
  selector: 'app-errorsStates',
  templateUrl: './errorsStates.component.html',
  styleUrls: ['./errorsStates.component.scss']
})
export class ErrorsStatesComponent implements OnInit {


  dataSource:MatTableDataSource<ErrorDetails[]>;
 
  displayedColumns: string[] = ['objectName', 'errorState'];

  constructor(

    public dialogRef: MatDialogRef<ErrorsStatesComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit() {
    this.dataSource=new MatTableDataSource<ErrorDetails[]>(this.data.errorDetails)
  }
  onClose(){
    this.dialogRef.close()
  }
}
