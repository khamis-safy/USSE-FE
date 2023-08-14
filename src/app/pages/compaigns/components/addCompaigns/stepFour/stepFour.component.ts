import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepFour',
  templateUrl: './stepFour.component.html',
  styleUrls: ['./stepFour.component.scss']
})
export class StepFourComponent implements OnInit {
isDisapled:boolean=false;
disaple:boolean=false;
intFrom:any=new FormControl(15);
intTo:any=new FormControl(30);
rNum:any=new FormControl(100);
form = new FormGroup({
  intFrom:this.intFrom,
  intTo:this.intTo,
  rNum:this.rNum,


});
  constructor() { }

  ngOnInit() {
  }

}
