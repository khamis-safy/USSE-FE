import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CompaignsService } from '../../../compaigns.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { parse, addMinutes } from 'date-fns';

@Component({
  selector: 'app-stepFour',
  templateUrl: './stepFour.component.html',
  styleUrls: ['./stepFour.component.scss']
})
export class StepFourComponent implements OnInit, OnDestroy ,AfterViewInit{

  maxNum = 1000;
  minNum = 0;

  @ViewChild("timePicker1") timePicker1!: ElementRef;
  @ViewChild("timePicker2") timePicker2!: ElementRef;

  isRepeatable: boolean  ;
  isInterval: boolean ;

  disableInterval: boolean = true;
  disableRepeate: boolean = true;
  disable: boolean = true;
  isSendingOutTimeChecked: boolean = false;
  isIntervalChecked: boolean = true;

  time1Sub$;
  time2Sub$;

  utcTime1;
  utcTime2;
  @Input() lastCampaignData:{
    intervalFrom:number,
    intervalTo:number,
    repeatedDays:number,
    isRepeatable:boolean,
    isInterval:boolean,
    maxPerDay:number,
    sendingoutFrom:string,
    sendingoutTo:string
  
  };
  toggleTime: boolean = false;
  time1: any = new FormControl({ value: '', disabled: true }, [Validators.required]);
  time2: any = new FormControl({ value: '', disabled: true }, [Validators.required]);
  intervalFrom: any = new FormControl({ value: 15, disabled: false }, [Validators.required]);
  intervalTo: any = new FormControl({ value: 30, disabled: false }, [Validators.required]);
  maxPerDay: any = new FormControl({ value: 100, disabled: false }, [Validators.required]);
  repeatedDays: any = new FormControl({ value: 0, disabled: true }, [Validators.required]);
  selectedTime: Date = new Date();
  form: FormGroup;

  @Output() formValidityChange = new EventEmitter<boolean>(true);

  constructor(private fb: FormBuilder, private datePipe: DatePipe,
    private campaignServeice: CompaignsService,
    private authService: AuthService) {
    this.form = this.fb.group(
      {
        intervalFrom: this.intervalFrom,
        intervalTo: this.intervalTo,
        maxPerDay: this.maxPerDay,
        repeatedDays: this.repeatedDays,
        time1: this.time1,
        time2: this.time2,
      },
      { validators: [this.intervalInvalid] }
    );
  }
  ngAfterViewInit(): void {
  }
  getDefaultLocalTime(): string {
    const now = new Date();
    now.setHours(12); // Set default hours to 12
    now.setMinutes(30); // Set default minutes to 30
    return this.datePipe.transform(now, 'HH:mm');
  }
  ngOnInit() {
    this.setDefaultTime();
    this.form.valueChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);
    });

    this.utcTime1 = this.convertToUTC(this.time1);
    this.utcTime2 = this.convertToUTC(this.time2);
    this.time1Sub$ = this.time1.valueChanges.subscribe(res => {
      this.utcTime1 = this.convertToUTC(this.time1);
    });
    this.time2Sub$ = this.time2.valueChanges.subscribe(res => {
      this.utcTime2 = this.convertToUTC(this.time2);
    });
  }

  ngOnDestroy(): void {
    this.time1Sub$.unsubscribe();
    this.time2Sub$.unsubscribe();
  }

  intervalInvalid(formGroup: FormGroup) {
    const intervalFrom = formGroup.get('intervalFrom')!.value;
    const intervalTo = formGroup.get('intervalTo')!.value;
    if (intervalFrom && intervalTo) {
      if (intervalFrom < intervalTo || intervalTo > intervalFrom) {
        return null; // Valid
      } else {
        return { intervalInvalid: true }; // Invalid
      }
    }
    return null; // No comparison if values are not set
  }

  setDefaultTime() {
if(this.lastCampaignData ){
  this.form.patchValue({
    intervalFrom:this.lastCampaignData.intervalFrom,
    intervalTo:this.lastCampaignData.intervalTo,
    maxPerDay:this.lastCampaignData.maxPerDay,
    repeatedDays:this.lastCampaignData.repeatedDays,
    time1:this.lastCampaignData.sendingoutFrom,
    time2:this.lastCampaignData.sendingoutTo
  }

  )
  this.isRepeatable=this.lastCampaignData.isRepeatable;
  if(this.isRepeatable){
    this.repeatedDays.enable();
  }
  
  this.isInterval=this.lastCampaignData.isInterval;
  if(!this.isInterval){
    this.intervalFrom.disable();
    this.intervalTo.disable()
  }
  this.isIntervalChecked=this.lastCampaignData.isInterval;

  this.isSendingOutTimeChecked=true;
  this.time1.enable();
  this.time2.enable();

}
else{
  this.isRepeatable= false;
  this.isInterval= true;
  this.time1.setValue(new Date());
  this.time2.setValue(new Date());
}
   
  }


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
  
  convertUTCToLocal(utcTime: string): Date {
    const [hoursStr, minutesStr] = utcTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
  
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes);
    console.log(utcDate,"date:",new Date())
    // Convert UTC time to local time
    return utcDate;
  }
  onSwitcherChange(e, data) {
    for (let item of data) {
      e.target.checked ? item.enable() : item.disable();
    }
  }

  toggleInterval() {
    this.disableInterval = !this.disableInterval;
  }

  toggleRepeate() {
    this.disableRepeate = !this.disableRepeate;
  }

  changeValue() {
    if (this.isRepeatable) {
      this.form.get('repeatedDays')?.setValue(1);
    } else {
      this.form.get('repeatedDays')?.setValue(0);
    }
  }
}
