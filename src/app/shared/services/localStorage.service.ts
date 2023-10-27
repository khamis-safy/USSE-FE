import { Injectable } from '@angular/core';
import { EncryptionService } from './encription.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  constructor(private encryptionService: EncryptionService,
    private router:Router,) { }


  saveEncryptedData(key: string, value: any): void {
    const encryptedValue = this.encryptionService.encrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  getDecryptedData(key: string): any {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      try {
        return this.encryptionService.decrypt(encryptedValue);
      } catch (error) {
        // Handle decryption error here
        let localData=['email',"token"]
        localData.map((key)=>localStorage.removeItem(key));
        const expirationDate = new Date('2000-01-01'); // Set expiration date to a past date
        const removedCookie = "refreshToken" + '=; expires=' + expirationDate.toUTCString() + '; path=/';
        document.cookie = removedCookie;
        location.reload();
        // You can throw the error or return a default value based on your application's requirements
        throw new Error('Error decrypting data'); // or return a default value like return null;
      }
    }
    return null;
  }
 
}
