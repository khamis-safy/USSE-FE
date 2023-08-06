import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'us-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  @Input() size = 50

  constructor() { }

  ngOnInit() {
  }

}
