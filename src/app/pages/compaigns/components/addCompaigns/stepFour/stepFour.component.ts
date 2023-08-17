import { Component, OnInit,ChangeDetectorRef, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputComponent } from 'src/app/shared/components/text-input/text-input.component';

@Component({
  selector: 'app-stepFour',
  templateUrl: './stepFour.component.html',
  styleUrls: ['./stepFour.component.scss']
})
export class StepFourComponent implements OnInit ,AfterViewInit{

  maxNum = 1000
  minNum = 0

  disableInterval:boolean=true;
disableRepeate:boolean=true;
disable:boolean=true;
isSendingOutTimeChecked:boolean=false;
isIntervalChecked:boolean=true;
// @ViewChild(InputComponent) inputCom1:InputComponent;
// @ViewChild(InputComponent) inputCom1:InputComponent;
// @ViewChild(InputComponent) inputCom1:InputComponent;
time1Sub$

time1 = new FormControl({value: new Date(), disabled: true});
time2= new FormControl({value: new Date(), disabled: true});
toggleTime:boolean=false;
intFrom:any=new FormControl({value:15,disabled:false});
intTo:any=new FormControl({value:30,disabled:false});
rNum:any=new FormControl({value:100,disabled:true});
repeate:any=new FormControl({value:0,disabled:true});

form = new FormGroup({
  intFrom:this.intFrom,
  intTo:this.intTo,
  rNum:this.rNum,
  repeate:this.repeate,
  time1:this.time1,
  time2:this.time2
});
  constructor() { }
  ngAfterViewInit() {
    // this.disableInterval=true;
    // this.disableRepeate=true;
    // this.inputCom.isDisabled=true;
    // this.cdRef.detectChanges();

  }


  ngOnInit() {
    this.time1Sub$ =  this.time1.valueChanges.subscribe(res=>{
      console.log(res)
    })
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
  test(e){
    console.log("here",e)
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.time1Sub$.unsubscribe()
  }
}
