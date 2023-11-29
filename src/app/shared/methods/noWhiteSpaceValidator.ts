import { FormControl } from "@angular/forms";

export function noWhitespaceValidator(control: FormControl): { [key: string]: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { 'whitespace': true } : null;
  }