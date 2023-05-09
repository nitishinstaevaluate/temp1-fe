import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroments';
const HOST = environment.HOST;

const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root',
})
export class ValuationService {
  constructor(private http: HttpClient) {}

  getValuationDropdown() {
    return this.http.get(`${HOST}masters/all`);
  }

  submitForm(data:any){
    return this.http.post(`${HOST}valuationProcess`,data);
  }
  fileUpload(file:any){
    return this.http.post(`${HOST}upload`,file);
  }
  exportFile(id:any) {
    return this.http.get(`${HOST}export/${id}`);
  }
  
}


