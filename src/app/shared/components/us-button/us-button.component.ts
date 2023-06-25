import { Component, Input, OnInit , Output , EventEmitter  } from '@angular/core';

@Component({
  selector: 'us-button',
  templateUrl: './us-button.component.html',
  styleUrls: ['./us-button.component.scss']
})
export class UsButtonComponent implements OnInit {

  @Input() label:string = 'label';
  @Input() size:string = 'sm';
  @Input() matIcon:string = '';
  @Input() iconClass:string = '';
  @Input() img:string = '';
  @Input() loading:boolean = true;
  @Input() disabled:boolean = false;
  @Input() fill:boolean =true
  @Input() appearance:string ='primary'

  @Output() clicked = new EventEmitter<any>();
  setClick(clickInfo:Event) {
    this.clicked.emit(clickInfo);
  }




  constructor() { }


  ngOnInit() {

    }
  }
