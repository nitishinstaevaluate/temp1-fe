import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http:HttpClient) { }

  HOST = environment.baseUrl;

  contactSalesEmail(payload:any){
    return this.http.post(`${this.HOST}email/send-email`, payload)
  }

  dataCheckListEmail(payload:any){
    return this.http.post(`${this.HOST}email/v2/send-data-checklist-email`, payload)
  }
}
