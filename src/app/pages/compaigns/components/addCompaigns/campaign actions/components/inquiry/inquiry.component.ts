import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl ,Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PluginsService } from 'src/app/services/plugins.service';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit {
  isLoading:boolean;
  isEdit:boolean=false;
  loading:boolean;
  criterias:any=[];
  isDisabled:boolean;
  myForm: FormGroup;
  acknowledgment: any = new FormControl('');
  email: any = new FormControl('',Validators.pattern(this.plugin.emailReg) );
  whatsapp: any = new FormControl('' );
  whatsappNumbers:string[]=[];
  emails:string[]=[]
  form = new FormGroup({
    acknowledgment: this.acknowledgment,
    email:this.email,
    whatsapp:this.whatsapp
  });
  noQuestions:boolean=false;
  constructor(public dialogRef: MatDialogRef<InquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb: FormBuilder,
    private plugin:PluginsService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      questions: this.fb.array([this.createQuestionControl('')])
    });
  
    if (this.data) {
      this.fillData();
    }
  }
  fillData(){
    if (this.myForm && this.myForm.get('questions')) {
      let allQuestions = this.data.questions.map((q) => q.question);
      this.setQuestionsFromArray(allQuestions);
    }
    
    this.criterias = this.data.criterias;
    this.emails=this.data.emailAddress? this.data.emailAddress.split(";"): [];
    this.whatsappNumbers=this.data.whatsappNumber? this.data.whatsappNumber.split(";") : [];
    this.form.patchValue(
      {
        acknowledgment:this.data.completeMessage

      }
    )
    
  }
  private createQuestionControl(initialValue: string) {
    return this.fb.control(initialValue, Validators.required);
  }
  onClose(data?){
    this.dialogRef.close(data);
  }
  setCriterias(event){
    this.criterias=event;
    }
    isButtonDisabled(ev){
      this.isDisabled=ev;
    }

  get questions(): FormArray {
    return this.myForm.get('questions') as FormArray;
  }
  addQuestion() {
    const questionControl = this.fb.control('', Validators.required);
    this.questions.push(questionControl);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }
  addEmail(){
    if(this.form.value.email && this.plugin.emailReg.test(this.form.value.email)){
    
        this.emails.push(this.form.value.email);
        this.form.patchValue({
          email:""
        })
        
    }

  }
  setQuestionsFromArray(questionArray: string[]) {
    const questionControls = questionArray.map(question => this.fb.control(question, Validators.required));
    this.myForm.setControl('questions', this.fb.array(questionControls));
  }
  addWhatsappNumber(){
    if(this.form.value.whatsapp){
    this.whatsappNumbers.push(this.form.value.whatsapp);
    this.form.patchValue({
      whatsapp:""
    })
  }
  }
  onTagClose(type:string , index:number){
    if(type == 'email'){
      this.emails.splice(index,1)
    }
    else{
      this.whatsappNumbers.splice(index,1)
    }
  }
  submitAdd(){
    let allQuestions = this.questions.value.map((q, index) => {
      return {
        question: q,
        orderNumber: index
      };
    });
    this.onClose({
      questions:allQuestions,
      criterias:this.criterias,
      completeMessage:this.form.value.acknowledgment,
      emailAddress: this.emails.join(";"),
      whatsappNumber : this.whatsappNumbers.join(";")
    })
  }
}

// "enqueryForm": {
//   "id": 0,
//   "questions": [
//     {
//       "id": 0,
//       "question": "string",
//       "orderNumber": 0
//     }
//   ],
//   "criterias": [
//     {
//       "criteria": "string",
//       "type": "string"
//     }
//   ],
//   "completeMessage": "string",
//   "attachment": "string",
//   "filename": "string",
//   "whatsappNumber": "string",
//   "emailAddress": "string"
// }
// }