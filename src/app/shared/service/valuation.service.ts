import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const HOST = environment.baseUrl;

const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root',
})
export class ValuationService {
  constructor(private http: HttpClient) {}

  getValuationDropdown(): Observable<any> {
    return this.http.get(`${HOST}masters/all`);
  }

  submitForm(data: any): Observable<any> {
    return this.http.post(`${HOST}valuationProcess/v1`, data);
  }
  fileUpload(file: any): Observable<any> {
    return this.http.post(`${HOST}upload`, file);
  }
  exportFile(id: any): Observable<any> {
    return this.http.get(`${HOST}export/${id}`);
  }
  getActivity(): Observable<any> {
    return this.http.get(`${HOST}valuations/640a4783337b1b37d6fd04c7`); // Update with dynamic user
  }

  getIndustries(id:any){
    return this.http.get(`${HOST}subIndustries/${id}`);
  }
  getCompanies(id:any){
    return this.http.get(`${HOST}companies/${id}`);
  }

  getProfitLossSheet(filename:string,sheetName:string){
    return this.http.get(`${HOST}upload/sheet/${filename}/${sheetName}`)
  }
 
  getPaginatedValuations(userId: string, page: number, pageSize: number): Observable<any[]> {
    const url = `${HOST}process-status-manager/paginate/${userId}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url);
  }
  }

