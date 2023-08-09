import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attatchment, Templates } from 'src/app/pages/templates/templates';
import { TemplatesService } from 'src/app/pages/templates/templates.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

export interface Filse{
  name:string,
  type:string,
  url:string,
  size:number
}
@Component({
  selector: 'app-write-message',
  templateUrl: './write-message.component.html',
  styleUrls: ['./write-message.component.scss']
})
export class WriteMessageComponent implements OnInit {
  templates:SelectOption[];
  allTemplates:Templates[]=[];
  fileData:Filse[]=[];
  @Output() messageBody = new EventEmitter<string>;
  @Output() attachments = new EventEmitter<Attatchment[]>;


  templatesData = new FormControl([]);
  message = new FormControl('',[Validators.required]);

  form = new FormGroup({
    templatesData:this.templatesData,
    message:this.message
  });
  constructor(private templateService:TemplatesService) { }

  ngOnInit() {
  }

  getTemplates(){

    this.templateService.getTemplates("khamis.safy@gmail.com",10,0,"","").subscribe(
      (res)=>{
        this.allTemplates=res;
        console.log(this.allTemplates)
        this.templates = this.allTemplates.map(res=>{
          return {
            title:res.templateName,
            value:res.id
          }
        })
       },
       (err)=>{

       })
  }
  // next(){
  //   this.selectedtemplates = this.form.value.templatesData.map((e)=>e.value);

  // }
  onSelect(event){


    let template=this.allTemplates.find((t)=>t.id==event.value);
    this.form.patchValue({
      message:template.messageBody
    });
    let attachment=template.attachments.map((e)=>{
      return {
          size:0,
          name:e.fileName,
          url:e.fileUrl,
          type:""
      }
    });


     this.fileData=attachment;

    this.messageBody.emit(this.form.value.message)




  }
  onFileChange(e){
    console.log(this.fileData)
  }
}
