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
  generateReport(reportId:string,approach:string){
    return this.http.get(`${this.HOST}report/getReport/${approach}/${reportId}`,{
      responseType: 'blob'
    });
  }

  previewReport(reportId:string,approach:string){
    return this.http.get(`${this.HOST}report/previewReport/${approach}/${reportId}`);
  }

  generateElevenUaReport(reportId:string){
    return this.http.get(`${this.HOST}report/rule-eleven-ua-report/${reportId}`,{
      responseType: 'blob'
    });
  }

  previewElevenUaReport(reportId:string){
    return this.http.get(`${this.HOST}report/preview-rule-eleven-ua-report/${reportId}`);
  }

  generateSebiReport(reportId:any){
    return this.http.get(`${this.HOST}report/sebi-report/${reportId}`,{
      responseType: 'blob'
    });
  }

  previewSebiReport(reportId:any){
    return this.http.get(`${this.HOST}report/preview-sebi-report/${reportId}`);
  }
}
