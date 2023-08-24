import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';

import { ErrSucc } from '../manage-contacts/list-data';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

constructor(private http:HttpClient) { }




}
