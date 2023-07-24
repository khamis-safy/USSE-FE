import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sr-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  @Input() title!: string;

  @Input() state!: string;

  @Input() readonly!: boolean;

  @Input() maxWidth = '50px';

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  onTagClose(e: MouseEvent): void {
    this.onClose.emit(e);
  }
}
