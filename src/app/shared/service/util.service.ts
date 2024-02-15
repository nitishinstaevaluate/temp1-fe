import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http:HttpClient) { }
  
  HOST = environment.baseUrl;

  
  getWordList(word:any){
    return this.http.get(`${this.HOST}util/get-word-list/search?word=${word}`)
  }

  fuzzySearchCompanyName(companyName:any){
    return this.http.get(`${this.HOST}fuse-search/fuse-search-by-company-name/${companyName}`)
  }

  generateUniqueLinkId(){
    return this.http.get(`${this.HOST}util/generate-link-id`)
  }

  validateLinkId(linkId:any){
    return this.http.get(`${this.HOST}util/validate-link-id/${linkId}`)
  }
}