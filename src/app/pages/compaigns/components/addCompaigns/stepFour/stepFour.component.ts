import { Component, OnInit,ChangeDetectorRef, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputComponent } from 'src/app/shared/components/text-input/text-input.component';

@Component({
  selector: 'app-stepFour',
  templateUrl: './stepFour.component.html',
  styleUrls: ['./stepFour.component.scss']
})
export class StepFourComponent implements OnInit ,AfterViewInit, OnChanges{
  disableInterval:boolean=true;
disableRepeate:boolean=true;
disable:boolean=true;
timeDisabled:boolean=true;
// @ViewChild(InputComponent) inputCom1:InputComponent;
// @ViewChild(InputComponent) inputCom1:InputComponent;
// @ViewChild(InputComponent) inputCom1:InputComponent;

time1 = new FormControl({value: new Date(), disabled: true});
time2= new FormControl({value: new Date(), disabled: true});
toggleTime:boolean=false;
intFrom:any=new FormControl(15);
intTo:any=new FormControl(30);
rNum:any=new FormControl(100);
repeate:any=new FormControl(0);

form = new FormGroup({
  intFrom:this.intFrom,
  intTo:this.intTo,
  rNum:this.rNum,
  repeate:this.repeate



});
  constructor(private cdRef: ChangeDetectorRef) { }
  ngAfterViewInit() {
    // this.disableInterval=true;
    // this.disableRepeate=true;
    // this.inputCom.isDisabled=true;
    // this.cdRef.detectChanges();

  }
  ngOnChanges() {
    // this.input.isDisabled=true;

    // Manually trigger change detection when input changes
  }

  ngOnInit() {
  }
  toggleTimeSwitch(){
this.timeDisabled=!this.timeDisabled;
this.cdRef.detectChanges();
  }
  toggleInterval(){
    this.disableInterval=!this.disableInterval;
    this.cdRef.detectChanges();
  }
  toggleRepeate(){
    this.disableRepeate=!this.disableRepeate;
    this.cdRef.detectChanges();

  }
  test(e){
    console.log(e)
  }
}
