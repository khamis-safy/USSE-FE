import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ToasterService {

constructor(
  ) { }



  private toastMessageSubject = new BehaviorSubject<string | null>(null);

  // Observable to subscribe to for toast messages
  toastMessage$ = this.toastMessageSubject.asObservable();

  // Method to trigger a toast message
  showToast(message: string) {
    this.toastMessageSubject.next(message);
  }
}
