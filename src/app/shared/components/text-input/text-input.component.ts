import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {
  @Input() value:any;
  @Input() formControler:any;
  @Output() clickEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
