import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { Observable } from 'rxjs';

import { Users } from './users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  constructor(private http:HttpClient) { }







}
