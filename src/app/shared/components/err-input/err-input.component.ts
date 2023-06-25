import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-err-input',
  templateUrl: './err-input.component.html',
  styleUrls: ['./err-input.component.css']
})
export class ErrInputComponent implements OnInit {
  @Input('formControl') formControl:any;
  @Input('patternText') patternText:any;

  constructor() { }

  ngOnInit() {
  }

}
