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

  generateUniqueLinkId(payload:any){
    return this.http.post(`${this.HOST}util/generate-link-id`, payload)
  }

  validateLinkId(linkId:any, checklistType:any){
    return this.http.get(`${this.HOST}util/validate-link-id/${linkId}/${checklistType}`)
  }

  postMandateChecklistDetails(id:any,payload:any){
    return this.http.put(`${this.HOST}util/update-mandate-checklist/${id}`, payload)
  }

  postDataChecklistDetails(id:any,payload:any){
    return this.http.put(`${this.HOST}util/update-data-checklist/${id}`, payload)
  }

  fetchAllDataChecklistEmails(page: number, pageSize: number){
    return this.http.get(`${this.HOST}util/get-all-datachecklist/paginate?page=${page}&pageSize=${pageSize}`)
  }

  fetchDataChecklistById(id:any){
    return this.http.get(`${this.HOST}util/get-data-checklist/${id}`)
  }

  resendDataChecklist(id:any){
    return this.http.get(`${this.HOST}util/resend-data-checklist/${id}`)
  }
}