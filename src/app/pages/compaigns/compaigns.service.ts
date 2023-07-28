import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class CompaignsService {

  constructor(private http:HttpClient) {

  }
  display:number=10;
    pageNum:number=0;

}
