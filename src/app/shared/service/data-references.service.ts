import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroments';
const HOST = environment.HOST;

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root',
})
export class DataReferencesService {
  constructor(private http: HttpClient) {}

  getValuationDropdown(): Observable<any> {
    return this.http.get(`${HOST}masters/all`);
  }

  getIndianTreasuryYields(): Observable<any> {
    return this.http.get(`${HOST}indiantreasuryyields`);
  }

  getHistoricalReturns(): Observable<any> {
    return this.http.get(`${HOST}historicalreturns`);
  }

  getBSE500(baseYears:string,asOnDate:string): Observable<any> {
    return this.http.get(`${HOST}historicalreturns/bse500?baseYrs=${baseYears}&asOnDate=${asOnDate}`);
  }

  getBetaIndustries(): Observable<any> {
    return this.http.get(`${HOST}betaindustries`);
  }

  getBetaIndustriesById(id: any): Observable<any> {
    return this.http.get(`${HOST}betaindustries/${id}`);
  }

  getIndustriesRatio(id:any){
    return this.http.get(`${HOST}industriesratio/${id}`);
  }

//   submitForm(data: any): Observable<any> {
//     return this.http.post(`${HOST}valuationProcess`, data);
//   }
//   fileUpload(file: any): Observable<any> {
//     return this.http.post(`${HOST}upload`, file);
//   }
//   exportFile(id: any): Observable<any> {
//     return this.http.get(`${HOST}export/${id}`);
//   }
//   getActivity(): Observable<any> {
//     return this.http.get(`${HOST}valuations/640a4783337b1b37d6fd04c7`); // Update with dynamic user
//   }

//   getIndustries(id:any){
//     return this.http.get(`${HOST}subIndustries/${id}`);
//   }
//   getCompanies(id:any){
//     return this.http.get(`${HOST}companies/${id}`);
//   }
}

