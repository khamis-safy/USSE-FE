import { Injectable } from '@angular/core';
import { EncryptionService } from './encription.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  constructor(private encryptionService: EncryptionService) { }


  saveEncryptedData(key: string, value: any): void {
    const encryptedValue = this.encryptionService.encrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  getDecryptedData(key: string): any {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      return this.encryptionService.decrypt(encryptedValue);
    }
    return null;
  }
}
