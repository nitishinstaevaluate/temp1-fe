import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroments';
const HOST = environment.HOST;

@Injectable({
  providedIn: 'root',
})
export class ValutionService {
  constructor(private http: HttpClient) {}

  getValutionDropdown() {
    return this.http.get(`${HOST}masters/all`);
  }
}
