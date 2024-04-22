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

   getSPLevelFourIndustryBasedList(descriptor:string){
    return this.http.get(`${this.HOST}ciq-sp/hierarchy-based-level-four-industry/${descriptor}`)
   }
   
   getSPIndustryListByLevelFourIndustries(data:any){
    return this.http.post(`${this.HOST}ciq-sp/sp-level-four-industry-list`,data)
   }

   getSPCompanyStatusType(){
    return this.http.get(`${this.HOST}ciq-sp/sp-company-status-type`)
   }

   getSPCompanyType(){
    return this.http.get(`${this.HOST}ciq-sp/sp-company-type`)
   }

   calculateSPindustryBeta(payload:any){
    return this.http.post(`${this.HOST}ciq-sp/calculate-sp-beta-aggregate`,payload)
   }

   calculateSPCompaniesMeanMedianRatio(payload:any){
    return this.http.post(`${this.HOST}ciq-sp/calculate-sp-companies-mean-median`, payload)
   }

   searchCiqEntityByCompanyId(companyId:any){
    return this.http.get(`${this.HOST}ciq-elastic-search/ciq-elastic-search-company-details/${companyId}`)
   }

    calculateStockBeta(payload:any){
     return this.http.post(`${this.HOST}ciq-sp/calculate-sp-stock-beta`,payload);
    }
  
    upsertBetaWorking(payload:any){
     return this.http.put(`${this.HOST}ciq-sp/beta-working`,payload);
    }

    fetchBetaWorking(processId:any){
     return this.http.get(`${this.HOST}ciq-sp/fetch-beta-working/${processId}`);
    }

    updateCompaniesList(data:any){
      return this.http.post(`${this.HOST}ciq-elastic-search/update-selected-companies`,data)
     }
}
