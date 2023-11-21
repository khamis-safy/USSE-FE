import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
interface files {
  name: string;
  type: string;
  url: string;
  size: number;
}
@Component({
  selector: 'app-autoReplay',
  templateUrl: './autoReplay.component.html',
  styleUrls: ['./autoReplay.component.scss']
})
export class AutoReplayComponent implements OnInit {
  isEdit:boolean=false;
  fileData: files[] = [];
  loading:boolean;
  isLoading:boolean;
  messageBody: any = new FormControl('' , Validators.required);
  attachments: any = new FormControl('');
  criterias:any=[];
  form = new FormGroup({
    messageBody: this.messageBody,
    attachments: this.attachments,
  });
  actionName:string;
  isDisabled:boolean;
  isCancel:boolean=false;

  constructor( public dialogRef: MatDialogRef<AutoReplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    this.actionName=this.data.actionName
    if(this.actionName == "cancel"){
      this.isCancel = true
    }
    if(this.data.data){
      this.isEdit=true;
      this.fillData()
    }
  }
  fillData(){
    this.criterias = this.data.data.criterias;
    this.form.patchValue({
      messageBody:this.data.data.messageContent,
    });
    // if(this.data.fileData){
    //   this.loading=true;
    //   this.fileData=this.data.fileData
    //   this.loading=false;
    // }
  }
  onClose(data?){
    this.dialogRef.close(data);
  }
  onFileChange(e){
    
  }
  onFileDelete(e){

  }
  setCriterias(event){
  this.criterias=event;
  }
  isButtonDisabled(ev){
    this.isDisabled=ev;
  }
  submit(){
    this.isLoading=true;
    if(this.isCancel){
      this.onClose({
        messageContent:this.form.value.messageBody,
        criterias:this.criterias
      })
    }
    else{

      this.onClose({
        messageContent:this.form.value.messageBody,
        criterias:this.criterias
        // fileData:this.fileData,
        // data:{
        //   messageContent:this.form.value.messageBody,
        //   criterias:this.criterias,
        //   attachment:this.fileData[0].url,
        //   filename:this.fileData[0].name
        // }
      })
    }

  }
 
}
