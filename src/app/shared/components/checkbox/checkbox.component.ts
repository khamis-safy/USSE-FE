import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR_CONFIG = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'sr-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [VALUE_ACCESSOR_CONFIG]
})
export class CheckboxComponent {
  // Value accessor methods [to use as a native form control]
  _value = false;

  onChange: any = () => {};
  onTouched: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  writeValue(value: any): void {
    this._value = value;
    if (value) {
      this.state = 'checked'
      if (value == 'mid') this.state = value
    } else this.state = ''
  }

  @Input() set value(val: any) {
    this._value = val;
    this.onChange(this._value);
  }
  get value(): any {
    return this._value;
  }

  // these types are givin to shut the tslint up!
  private states: ['', 'mid', 'checked'] = ['', 'mid', 'checked'];
  
  controlType: string = 'checkbox';
  
  @Input() state: '' | 'checked' | 'mid' = ''

  @Input() label: string = '';

  @Input() description?: string;

  // TODO: rename this to parentControl
  // as it allows u to control the state from parent only (not by click)
  @Input() disableControl?: boolean;

  @Input() enableIntermediate?: boolean;

  @Input() isDisabled = false;

  @Output() changed = new EventEmitter<'' | 'checked' | 'mid'>();

  changeState(): void {
    if (!this.disableControl) {
      // switch between states in order
      let i = this.states.indexOf(this.state);
      if (i == this.states.length - 1) {
        this.state = this.states[0];
        this.value = false
      } else {
        // if intermediate is not enabled then switch between 'checked' and '' only
        if (this.enableIntermediate) this.state = this.states[i + 1];
        else this.state = this.states[this.states.length - 1];

        if (!this.state) this.value = false
        else this.value = true

      }

    }
    // emit change
    this.changed.emit(this.state);
  }
}
