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
  templateLoadingText:string='Loading ...';
  // @Output() messageBody = new EventEmitter<string>;
  @Output() attachments = new EventEmitter<string[]>;
  messageBody:string="";

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

    this.templateService.getTemplates(this.templateService.email,10,0,"","").subscribe(
      (res)=>{
        this.allTemplates=res;
        console.log(this.allTemplates)
        this.templates = this.allTemplates.map(res=>{
          return {
            title:res.templateName,
            value:res.id
          }
        });
        if(res.length==0){
          this.templateLoadingText='No Results'
        }
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
    this.templateService.getTemplateById(event.value).subscribe(
      (res)=>{
          let attachments=res.result.attachments;
          // console.log("attachment",attachments)
        this.fileData=attachments.map((attach)=>{
          return{
            name:"",
            type:"",
            url:attach,
            size:0
          }
        })
      },
      (err)=>{

      }
    )



    // })




    this.messageBody=(this.form.value.message)

//  console.log("file data",this.fileData);


  }


  onFileChange(e){
    console.log(this.fileData);
  }
}
