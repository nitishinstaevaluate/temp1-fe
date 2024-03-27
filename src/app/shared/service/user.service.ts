import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  
  HOST = environment.baseUrl;
  
  getUser(){
    return this.http.get(`${this.HOST}users/fetch-user`);
  }

  create(payload:any){
    return this.http.post(`${this.HOST}users/create-user`, payload);
  }

  resetUserPassword(payload:any){
    return this.http.post(`${this.HOST}users/reset-password`, payload);
  }
}