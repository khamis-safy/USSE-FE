import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = environment.secretKey; // Replace this with your secret key

  encrypt(data: any): string {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    return encryptedData;
  }

  decrypt(encryptedData: string): any {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
}
