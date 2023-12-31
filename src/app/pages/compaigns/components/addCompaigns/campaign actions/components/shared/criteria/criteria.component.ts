import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToasterServices } from 'src/app/shared/components/us-toaster/us-toaster.component';
import { noWhitespaceValidator } from 'src/app/shared/methods/noWhiteSpaceValidator';


@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss']
})
export class CriteriaComponent implements OnInit {
  showInputs:boolean;
  criteria:any=new FormControl('',[Validators.required ,noWhitespaceValidator]);
  type:any=new FormControl([]);
  conditionsData:any;
 @Input() criteriaParameters:{criteria:string, type:string}[]=[];
  conditionValue = new FormControl([]);
  form = new FormGroup({
    keyWord:this.criteria,
    conditionValue:this.conditionValue,
  });
  @Output() allCriterias = new EventEmitter<any>;
  @Output() disableSaveButton = new EventEmitter<boolean>;
  criteriaConditions:string[] = ["full" , "start","end","contain"]

  selectedCondition:{title:string, value:number};
  constructor(private translate:TranslateService,
              private toaster:ToasterServices) { 
    this.conditionsData=[
      {title:translate.instant('full') , value:1},
      {title:translate.instant('start') , value:2},
      {title:translate.instant('end') , value:3},
      {title:translate.instant('contain') , value:4},

    ]
  }

  ngOnInit() {
    this.allCriterias.emit(this.criteriaParameters)
  }
  onSelect(event){
    this.selectedCondition={title:event.title , value:event.value - 1};
  }
  remove(i){
    this.criteriaParameters.splice(i,1);
    this.allCriterias.emit(this.criteriaParameters)
  }
  save(){
    this.showInputs=false;
    this.disableSaveButton.emit(this.showInputs)
    if(this.criteriaParameters.find((criteria)=> criteria.criteria == this.form.value.keyWord && criteria.type == this.criteriaConditions[this.selectedCondition.value])){
      this.toaster.warning(this.translate.instant('criteria_already_exist'))
    }
    else{
    this.criteriaParameters.push({
      criteria:this.form.value.keyWord,
      type:this.criteriaConditions[this.selectedCondition.value]
      
    })
    this.allCriterias.emit(this.criteriaParameters)
   }
    this.form.patchValue({
      keyWord:"",
      conditionValue:null
    })
  }
  cancel(){
    this.showInputs=false;
    this.disableSaveButton.emit(this.showInputs)
    this.form.patchValue({
      keyWord:"",
      conditionValue:null
    })

  }
  show(){
    this.showInputs=true;
    this.disableSaveButton.emit(this.showInputs)
  }
}
