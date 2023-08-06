import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TemplatesService } from 'src/app/pages/templates/templates.service';
import { SelectOption } from 'src/app/shared/components/select/select-option.model';

@Component({
  selector: 'app-write-message',
  templateUrl: './write-message.component.html',
  styleUrls: ['./write-message.component.scss']
})
export class WriteMessageComponent implements OnInit {
  templates:SelectOption[];
  selectedtemplates:string[]=[];
  templatesData = new FormControl([]);
  message = new FormControl('',[Validators.required]);

  form = new FormGroup({
    templatesData:this.templatesData,
    message:this.message
  });
  constructor(private templateService:TemplatesService) { }

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates(){

    this.templateService.getTemplates("khamis.safy@gmail.com",10,0,"","").subscribe(
      (res)=>{
        // this.templates = res.map(res=>{
        //   return {
        //     title:res.name,
        //     value:res.id
        //   }
        // })
       },
       (err)=>{

       })
  }
  next(){
    this.selectedtemplates = this.form.value.templatesData.map((e)=>e.value);

  }
}
