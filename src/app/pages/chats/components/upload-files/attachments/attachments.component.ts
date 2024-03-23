import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
@Input() files:any=[];
@Output() onRemoveFile  = new EventEmitter<any>
  constructor() { }

  ngOnInit() {
  }
calcSize(file){

    let val = parseInt(file) < 1024*1024 ?
      `${(parseInt(file)/1024).toFixed(2)} KB` :
      `${(parseInt(file)/1024/1024).toFixed(2)} MB`;
    return val;
  }
  remove(file){
    this.files.splice(this.files.indexOf(file),1);
    this.onRemoveFile.emit(this.files)
    
  }
}

