import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  HostListener
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
export class InputComponent implements  AfterViewInit {

  // VALUE_ACCESSOR Methods & Properties
  private val: any = null;
  @Input() isDisabled: boolean;
  @ViewChild('srInputEl') textarea: ElementRef;

  onChange: any = () => {};
  onTouched: any = () => {};
  isPasswordVisible: boolean = false;
  divHeight: string;
    togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
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
    if (this.isTextArea && this.limitTextarea) {
      // Update the character count for the initial value
      this.charCount = this.val ? this.val.length : 0;
    }
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
  @Input() warning?: boolean=false; // change styles for warning appearance
  @Input() fullWidth?: boolean; // take full width of the parent
  @Input() hideSteppers?: boolean=false; // hide steppers butttons
  @Input() isCriteria?: boolean = false;
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
  @Input() isEmoji?: boolean = false;
  @Input() limitTextarea?: boolean = true;

  @Input() maxCharLimit?: number;
  charCount: number = 0;
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

  showEmoji = false;
  isEmojiClicked: boolean = false;
  constructor(private el: ElementRef) {}
  get value(): any {

    return this.val;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateDivHeight();
      if (this.isTextArea && this.limitTextarea) {
        this.maxCharLimit=1600;
        // Emit the initial character count
        this.input.emit(this.val);
      }
    }, 0);
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
    if(this.isTextArea && this.limitTextarea){
        // Update the character count
      this.charCount = this.value ? this.value.length : 0;

      // Emit the input event
      this.input.emit(this.value);
    }
  }
  addEmoji(e){
    let val = this.value ? this.value : ""
    let sym = e.emoji.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray);
    this.value =  val.slice(0, this.curPos) + emoji + val.slice(this.curPos);
    this.isEmojiClicked = true;

  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isEmojiClicked = false;
    }
  }
  curPos = 0;
  getCursorPosition(e){
    this.curPos = e.target.selectionStart;
  }
  updateDivHeight(): void {
    const textareaElement = this.textarea.nativeElement;
    const lineHeight = parseInt(window.getComputedStyle(textareaElement).lineHeight, 10);
    const lines = textareaElement.value.split('\n').length;
    const minHeight = 100; // Set your minimum height here

    this.divHeight = Math.max(minHeight, lines * lineHeight) + 'px';
  }
  getInitialHeight(): number {
    const resizableDiv = document.querySelector('.resizable-div') as HTMLElement;
    return resizableDiv ? resizableDiv.offsetHeight : 100;
  }
}
