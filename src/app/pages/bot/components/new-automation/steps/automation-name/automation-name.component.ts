import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-automation-name',
  templateUrl: './automation-name.component.html',
  styleUrls: ['./automation-name.component.scss']
})
export class AutomationNameComponent implements OnInit {
  automationName:any = new FormControl('',[Validators.required]);
  criterias:any=[];

  form = new FormGroup({

    automationName:this.automationName
  });
  constructor() { }

  ngOnInit() {
  }
  setCriterias(event){
    this.criterias=event;
    }
}
