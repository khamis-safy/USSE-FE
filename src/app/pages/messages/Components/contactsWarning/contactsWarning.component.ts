import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contactsWarning',
  templateUrl: './contactsWarning.component.html',
  styleUrls: ['./contactsWarning.component.scss']
})
export class ContactsWarningComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ContactsWarningComponent>,

  ) { }

  ngOnInit() {
  }
  onClose(data ?): void {
    this.dialogRef.close(data);
  }
}
