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

  generateUniqueLinkId(checklistType:string){
    return this.http.get(`${this.HOST}util/generate-link-id/${checklistType}`)
  }

  validateLinkId(linkId:any, checklistType:any){
    return this.http.get(`${this.HOST}util/validate-link-id/${linkId}/${checklistType}`)
  }

  postMandateChecklistDetails(id:any,payload:any){
    return this.http.put(`${this.HOST}util/update-mandate-checklist/${id}`, payload)
  }
}