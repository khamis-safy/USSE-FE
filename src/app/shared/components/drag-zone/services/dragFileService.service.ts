import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragFileServiceService {

constructor() { }
calculateFileSizeInKB(base64String: string): number {
  let base64=base64String.substring(base64String.indexOf(",")+1,base64String.length+1)
  // Decode the Base64 string to binary data
  const binaryData = atob(base64);

  // Calculate the length of the binary data
  const fileSizeInBytes = binaryData.length;

  // Convert the file size to kilobytes (KB)
  const fileSizeInKB = fileSizeInBytes / 1024;

  return fileSizeInKB;
}
extractTypeFromBase64(base64String: string):string{
  let type =base64String.substring(base64String.indexOf(":")+1,base64String.indexOf(";") );
  return type
}
}
