import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessStatusManagerService {

  constructor(private http:HttpClient) {}

  HOST = environment.baseUrl;

  instantiateProcess(process:any,processId?:any){
    return this.http.put(`${this.HOST}process-status-manager/instantiateProcess?processId=${processId}`,process)
  }

  retrieveProcess(processId?:any){
    return this.http.get(`${this.HOST}process-status-manager/retrieveProcess/${processId}`)
  }

  retrieveActiveStage(processId:any){
    return this.http.get(`${this.HOST}process-status-manager/retrieveStage/${processId}`);
  }

  updateActiveStage(data:any){
    return this.http.put(`${this.HOST}process-status-manager/updateStage`,data);
  }

  getStageWiseDetails(processId:any, stage:any){
    return this.http.get(`${this.HOST}process-status-manager/retrieve-particular-stage/filter?processId=${processId}&stageDetails=${stage}`);
  }

  getExcelStatus(processId:any){
    return this.http.get(`${this.HOST}process-status-manager/excel-status/${processId}`);
  }
  
  updateEditedExcelStatus(processId:any){
    return this.http.put(`${this.HOST}process-status-manager/update-edited-excel-status/${processId}`,{});
  }
  
  fetchProcessIdentifierId(obId:any){
    return this.http.get(`${this.HOST}process-status-manager/fetch-process-identifier-id/${obId}`);
  }

  cloneLead(payload:any){
    return this.http.post(`${this.HOST}process-status-manager/clone-lead`,payload);
  }
}
