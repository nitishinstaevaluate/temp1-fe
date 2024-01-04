import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiqSPService {

  constructor(private http:HttpClient) { }
  
  HOST = environment.baseUrl;

  fetchSPHierarchyBasedIndustry(){
    return this.http.get(`${this.HOST}ciq-sp/hierarchy-based-industry-list`);
   }

   fetchAllSPIndustry(){
     return this.http.get(`${this.HOST}ciq-sp/sp-industry-list`);
   }

   getSPCompanyBasedIndustry(industry:string,location:string){
    return this.http.get(`${this.HOST}ciq-sp/sp-industry-list/search?industry=${industry}&location=${location}`);
   }
}
