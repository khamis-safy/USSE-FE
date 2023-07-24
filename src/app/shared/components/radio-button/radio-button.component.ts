import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sr-radio',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent {
  // these types are givin to shut the tslint up!

  @Input() state: '' | 'checked' = '';

  @Input() label?: string;

  @Input() description?: string;

  @Input() disableControl?: boolean;

  @Input() disabled?: boolean;

  @Output() changed = new EventEmitter<'' | 'checked'>();

  onChange(): void {
    if (!this.disabled) {
      if (!this.disableControl) {
        // switch between states in order
        if (this.state === '') this.state = 'checked'
        else this.state = ''
      }
      // emit change
      this.changed.emit(this.state);
    }
  }
}
