import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contactsWarning',
  templateUrl: './contactsWarning.component.html',
  styleUrls: ['./contactsWarning.component.scss']
})
export class ContactsWarningComponent implements OnInit {
@Input() warningMsg:string='';
  constructor(public dialogRef: MatDialogRef<ContactsWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {
    this.warningMsg=this.data;
  }
  onClose(data ?): void {
    this.dialogRef.close(data);
  }
}
