import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl ,Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PluginsService } from 'src/app/services/plugins.service';
import { noWhitespaceValidator } from 'src/app/shared/methods/noWhiteSpaceValidator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss']
})
export class InquiryComponent implements OnInit ,AfterViewInit{
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

  @ViewChild('dialogElement') dialogElement: ElementRef;
  constructor(public dialogRef: MatDialogRef<InquiryComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb: FormBuilder,
    private plugin:PluginsService,
  ) { 
 // Set up Dragula
 
    }

  ngOnInit() {
    this.myForm = this.fb.group({
      questions: this.fb.array([this.createQuestionControl('')])
    });
  
    if (this.data) {
      this.fillData();
    }
  }
   isQuestionRepeated(index: number): boolean {
    const currentQuestion = this.questions.at(index).value;
    return this.questions.value.slice(0, index).includes(currentQuestion);
  }
  ngAfterViewInit() {
    // Set the appendTo option after the view has been initialized
    const dialogElement = this.dialogElement.nativeElement;
    const questionDragElements = document.querySelectorAll('.questions .question');

    questionDragElements.forEach((el) => {
      el.addEventListener('mousedown', () => {
        this.dialogElement.nativeElement.style.zIndex = '9999999';
      });

      el.addEventListener('mouseup', () => {
        this.dialogElement.nativeElement.style.zIndex = '';
      });
    });
  }

  private createQuestionControl(initialValue: string) {
    return this.fb.control(initialValue,  [Validators.required, noWhitespaceValidator]);
  }


  get questions(): FormArray {
    return this.myForm.get('questions') as FormArray;
  }
  addQuestion() {
    const questionControl = this.fb.control('',  [Validators.required, noWhitespaceValidator]);
    this.questions.push(questionControl);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // Define a custom function that moves an item in a FormArray to another position
  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number) {
    const item = formArray.at(fromIndex);
    formArray.removeAt(fromIndex);
    formArray.insert(toIndex, item);
  }

  // Handle the drop event and update the FormArray accordingly
  onDrop(event: CdkDragDrop<any>) {
    this.moveItemInFormArray(this.questions, event.previousIndex, event.currentIndex);
    console.log(this.questions.value)
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
  onClose(data?){
    this.dialogRef.close(data);
  }
  setCriterias(event){
    this.criterias=event;
    }
    isButtonDisabled(ev){
      this.isDisabled=ev;
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

