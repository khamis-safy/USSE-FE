import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  @Input() additionalParameters: { name: string; value: string }[];
  @Input() lists:string[];

  @Input() contactName: string="";
  @Input() contactNumber: string="";
  @Input() title: string="";

  constructor() { }

  ngOnInit() {
  }

}
