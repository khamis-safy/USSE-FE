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
  intFrom: any = new FormControl({ value: 15, disabled: false }, [Validators.required]);
  intTo: any = new FormControl({ value: 30, disabled: false }, [Validators.required]);
  rNum: any = new FormControl({ value: 100, disabled: false }, [Validators.required]);
  repeate: any = new FormControl({ value: 0, disabled: true }, [Validators.required]);
  selectedTime: Date = new Date();
  form: FormGroup;

  @Output() formValidityChange = new EventEmitter<boolean>(true);

  constructor(private fb: FormBuilder, private datePipe: DatePipe,
    private campaignServeice: CompaignsService,
    private authService: AuthService) {
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
    this.getLastCampaign();
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
    const intervalFrom = formGroup.get('intFrom')!.value;
    const intervalTo = formGroup.get('intTo')!.value;
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
    intFrom:this.lastCampaignData.intervalFrom,
    intTo:this.lastCampaignData.intervalTo,
    rNum:this.lastCampaignData.maxPerDay,
    repeate:this.lastCampaignData.repeatedDays,
    time1:this.lastCampaignData.sendingoutFrom,
    time2:this.lastCampaignData.sendingoutTo
  }

  )
  this.isRepeatable=this.lastCampaignData.isRepeatable;
  
  this.isInterval=this.lastCampaignData.isInterval;
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

  getLastCampaign() {
    this.campaignServeice.getLastCampaign(this.authService.getUserInfo().email).subscribe(
      (res) => {
        if (res) {
      
          this.form.patchValue({
            intFrom: res.intervalFrom || 15,
            intTo: res.intervalTo || 30,
            rNum: res.maxPerDay || 100,
            repeate: res.repeatedDays || 0,
            
          });
          
          this.isIntervalChecked = res.isInterval || true;
          this.isRepeatable = res.isRepeatable || false;
          this.isSendingOutTimeChecked = res.isInterval || false;
        } 
      }
    );
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
      this.form.get('repeate')?.setValue(1);
    } else {
      this.form.get('repeate')?.setValue(0);
    }
  }
}
