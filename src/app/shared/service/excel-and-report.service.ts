import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelAndReportService {

  HOST=environment.baseUrl;
  
  constructor(private http:HttpClient) { }

  updateReportDocxBuffer(id:any,formData:any){
    return this.http.put(`${this.HOST}report/updateReportDoc/${id}`,formData)
  }

  generatePdf(payload: any,specificity:boolean = false) {
    return this.http.get(`${this.HOST}upload/generate/${payload?.reportId}/${payload?.model}/${specificity}`);
  }

  modifyExcel(payload:any){
    return this.http.post(`${this.HOST}upload/modifyExcel`,payload)
  }

  postReportData(payload:any){
    return this.http.post(`${this.HOST}report/generateReport`,payload);
  }
  generateReport(reportId:string,approach:string, formatType:string){
    return this.http.get(`${this.HOST}report/getReport/${approach}/${reportId}/${formatType}`,{
      responseType: 'blob'
    });
  }

  previewReport(reportId:string,approach:string){
    return this.http.get(`${this.HOST}report/previewReport/${approach}/${reportId}`);
  }

  generateElevenUaReport(reportId:string, formatType:string){
    return this.http.get(`${this.HOST}report/rule-eleven-ua-report/${reportId}/${formatType}`,{
      responseType: 'blob'
    });
  }

  previewElevenUaReport(reportId:string){
    return this.http.get(`${this.HOST}report/preview-rule-eleven-ua-report/${reportId}`);
  }

  generateSebiReport(reportId:any, formatType:string){
    return this.http.get(`${this.HOST}report/sebi-report/${reportId}/${formatType}`,{
      responseType: 'blob'
    });
  }

  previewSebiReport(reportId:any){
    return this.http.get(`${this.HOST}report/preview-sebi-report/${reportId}`);
  }

  previewNavReport(reportId:any){
    return this.http.get(`${this.HOST}report/preview-nav-report/${reportId}`);
  }

  generateMandateReport(reportId:any){
    return this.http.get(`${this.HOST}report/mandate-report/${reportId}`,{
      responseType: 'blob'
    });
  }

  generateMrlReport(processStateId:any){
    return this.http.get(`${this.HOST}report/mrl-report/${processStateId}`,{
      responseType: 'blob'
    });
  }

  generateNavReport(processStateId:any, formatType:string){
    return this.http.get(`${this.HOST}report/nav-report/${processStateId}/${formatType}`,{
      responseType: 'blob'
    });
  }

  generateMrlDocxReport(processStateId:any){
    return this.http.get(`${this.HOST}report/mrl-docx-report/${processStateId}`,{
      responseType: 'blob'
    });
  }
  
  generateElevenUaMrlReport(processStateId:any){
    return this.http.get(`${this.HOST}report/rule-eleven-mrl-report/${processStateId}`,{
      responseType: 'blob'
    });
  }
  
  generateElevenUaMrlDocxReport(processStateId:any){
    return this.http.get(`${this.HOST}report/rule-eleven-mrl-docx-report/${processStateId}`,{
      responseType: 'blob'
    });
  }
}
