import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiqSPService {

  constructor(private http:HttpClient) { }
  
  HOST = environment.baseUrl;

  getSPIndustryList(){
    return this.http.get(`${this.HOST}ciq-sp/industry`)
   }

   getSPIndustryBasedCompany(){
     return this.http.get(`${this.HOST}ciq-sp/industry-based-company`)
   }
}
