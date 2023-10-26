import { Component, OnInit,ChangeDetectorRef, AfterViewInit, ViewChild, OnChanges, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stepFour',
  templateUrl: './stepFour.component.html',
  styleUrls: ['./stepFour.component.scss']
})
export class StepFourComponent implements OnInit ,AfterViewInit,OnDestroy{

  maxNum = 1000
  minNum = 0
  @ViewChild("timePicker1") timePicker1!: ElementRef;
  @ViewChild("timePicker2") timePicker2!: ElementRef;

  isRepeatable:boolean=false;
  isInterval:boolean=true;

  disableInterval:boolean=true;
  disableRepeate:boolean=true;
  disable:boolean=true;
  isSendingOutTimeChecked:boolean=false;
  isIntervalChecked:boolean=true;

time1Sub$
time2Sub$

utcTime1;
utcTime2;


toggleTime:boolean=false;
time1:any = new FormControl({value:'',  disabled: true}, [Validators.required]);
time2:any= new FormControl({value: '',  disabled: true}, [Validators.required]);
intFrom:any=new FormControl({value:15, disabled:false}, [Validators.required]);
intTo:any=new FormControl({value:30, disabled:false}, [Validators.required]);
rNum:any=new FormControl({value:100, disabled:false}, [Validators.required]);
repeate:any=new FormControl({value:0, disabled:true}, [Validators.required]);
selectedTime: Date= new Date();
form: FormGroup;
@Output() formValidityChange = new EventEmitter<boolean>(true);

constructor(private fb: FormBuilder, private datePipe: DatePipe) {
  this.form = this.fb.group(
    {
      intFrom: this.intFrom,
      intTo: this.intTo,
      rNum: this.rNum,
      repeate: this.repeate,
      time1: this.time1,
      time2: this.time2,
    },
    { validators: [this.intervalInvalid] }
  );
}
  ngAfterViewInit() {


  }

test(evet){
}
  intervalInvalid(formGroup: FormGroup){
    const intervalFrom = formGroup.get('intFrom')!.value;
    const intervalTo = formGroup.get('intTo')!.value;
    if(intervalFrom && intervalTo){
      if(intervalFrom < intervalTo || intervalTo > intervalFrom){
        return null; // Valid
      }
      else {
        return { intervalInvalid: true }; // Invalid
      }

    }
    return null; // No comparison if values are not set

  }
  setDefaultTime(){
    this.time1.setValue(new Date());
    this.time2.setValue(new Date());
  }
  ngOnInit() {
    this.setDefaultTime()
    this.form.valueChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);
    });

    this.utcTime1=this.convertToUTC(this.time1);
    this.utcTime2=this.convertToUTC(this.time2);
    this.time1Sub$ =  this.time1.valueChanges.subscribe(res=>{
      this.utcTime1=this.convertToUTC(this.time1);


    });
    this.time2Sub$ =  this.time2.valueChanges.subscribe(res=>{
      this.utcTime2=this.convertToUTC(this.time2)


    })
  }

  // for date time

convertToUTC(timecontrol: any): any {
  const selectedTime = timecontrol.value;

  if (selectedTime) {
    const timeOnly = new Date();
    timeOnly.setHours(selectedTime.getHours());
    timeOnly.setMinutes(selectedTime.getMinutes());
    timeOnly.setSeconds(selectedTime.getSeconds());


    const utcTime = this.datePipe.transform(timeOnly, 'HH:mm:ss', 'UTC');

    return utcTime;
  }
}
  onSwitcherChange(e,data){

      for(let item of data){
        e.target.checked ? item.enable() : item.disable()
      }
  }

  toggleInterval(){
    this.disableInterval=!this.disableInterval;
  }
  toggleRepeate(){
    this.disableRepeate=!this.disableRepeate;

  }
  changeValue() {
    if(this.isRepeatable){

      this.form.get('repeate')?.setValue(1);
    }
    else{
      this.form.get('repeate')?.setValue(0);

    }
 }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.time1Sub$.unsubscribe();
    this.time2Sub$.unsubscribe()

  }

}
