import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Automation } from 'src/app/pages/bot/interfaces/automation';

@Component({
  selector: 'app-automation-name',
  templateUrl: './automation-name.component.html',
  styleUrls: ['./automation-name.component.scss']
})
export class AutomationNameComponent implements OnInit {
  automationName:any = new FormControl('',[Validators.required]);
  criterias:any=[];
  @Input() automationData:Automation;
  disabled:boolean=false;
  form = new FormGroup({

    automationName:this.automationName
  });
  constructor() { }

  ngOnInit() {
    if(this.automationData){
      this.form.patchValue({
        automationName:this.automationData.name
      })
      this.setCriterias(this.automationData.criterias)
    }
  }
  setCriterias(event){
    this.criterias=event;
    }

}
