import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Message } from '../../message';

@Component({
  selector: 'app-display-message',
  templateUrl: './display-message.component.html',
  styleUrls: ['./display-message.component.scss']
})
export class DisplayMessageComponent implements OnInit {
message:Message;
test:string= "6781dde0-7946-4d49-ad27-a95421f19ff8.jpg";
  constructor( public dialogRef: MatDialogRef<DisplayMessageComponent>
            ,@Inject(MAT_DIALOG_DATA) public data:Message) { }

  ngOnInit() {
    this.message=this.data;
    console.log(this.test.split(".").pop())

  }
  onClose(data?) {
    this.dialogRef.close(data);
  }

}
