import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR_CONFIG = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'us-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [VALUE_ACCESSOR_CONFIG],
})
export class InputComponent {
  // VALUE_ACCESSOR Methods & Properties
  private val: any = null;
  @Input() isDisabled: boolean;

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  writeValue(value: any): void {
    this.val = value;
  }
  // ================================

  // Inputs
  @Input() set value(value: any) {
    this.val = value;
    this.onChange(this.val);
  } // we use set to do some logic every time we change this property ( value )
  @Input() key = ''; // <label [for]="key">, <input [name/id]="key">
  @Input() placeholder = ''; // placeholder for the input
  @Input() label?: string; // label above the input
  @Input() optional?: boolean; // optional indicator above the input
  @Input() iconClass?: string; // icon font class e.g. si-info
  @Input() hintText?: string; // a hint/caption below the input
  @Input() hintIcon = 'si-info'; // the icon before the hint
  @Input() type: 'text' | 'number' = 'text'; // type [ text or number ]
  @Input() error?: boolean; // change styles for error appearance
  @Input() fullWidth?: boolean; // take full width of the parent
  @Input() trailingIcon?: boolean; // set icon to the END of the input [ in the START by default ]
  @Input() prefix?: string; // add a prefix
  @Input() suffix?: string; // add a suffix
  @Input() min?: number; // native attribute of number input
  @Input() max?: number; // native attribute of number input
  @Input() pattern!: string | RegExp; // regex for input validation
  @Input() grouped?: boolean; // in a group ?
  @Input() orderInGroup?: 'first' | 'last'; // order in group - to control border
  // an array of functions that takes input element as a parameter
  // and gets executed upon (ngModelChange) to modify the input value
  // e.g. input:number that has a max limit and you wanna reset the value if it exceeded the limit
  @Input() validators?: Function[];
  @Input() isTextArea?: boolean;

  // Native Events
  @Output() keyup = new EventEmitter();
  @Output() keydown = new EventEmitter();
  @Output() input = new EventEmitter();
  @Output() copy = new EventEmitter();
  @Output() paste = new EventEmitter();
  @Output() change = new EventEmitter();
  @Output() clicked = new EventEmitter();
  // Custom Events
  @Output() submit = new EventEmitter(); // on enter click
  @Output() onIconClick = new EventEmitter(); // on icon click e.g. search-icon

  get value(): any {
    return this.val;
  }

  increment() {
    // increase the value of the number input
    if (typeof this.max == 'number' && this.value >= this.max) {
      this.value = this.max;
      return;
    }
    this.value = +this.value + 1;
    this.onChange(this.value);
  }

  decrement() {
    // decrease the value of the number input
    if (typeof this.min == 'number' && this.value <= this.min) {
      this.value = this.min;
    return;
    }
    if (typeof this.max == 'number' && +this.value >= this.max) {
      this.value = +this.max - 1;
    return;
    }
    this.value = +this.value - 1;
    this.onChange(this.value);
  }

  onValueChange(element: any) {
    if (this.validators?.length) this.validators.forEach((fn) => fn(element));
  }
}
