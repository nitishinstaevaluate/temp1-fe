import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
const HOST = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor(private http:HttpClient) { }

  steps: BehaviorSubject<number> = new BehaviorSubject(1);
  checkStepStatus: BehaviorSubject<any> = new BehaviorSubject({status:false});
  getCostOfEquity(payload:any){
    return this.http.get(`${HOST}coe/adjcoe/?riskFreeRate=${payload.riskFreeRate}&expMarketReturn=${payload.expMarketReturn}&beta=${payload.beta}&riskPremium=${payload.riskPremium}&coeMethod=${payload.coeMethod}`)
  }

  getWacc(payload:any){
    return this.http.get(`${HOST}coe/wacc?adjustedCostOfEquity=${payload.adjCoe}&equityProp=${payload.equityProp}&costOfDebt=${payload.costOfDebt}&taxRate=${payload.taxRate}&debtProp=${payload.debtProp}&copShareCapital=${payload.copShareCapital}&prefProp=${payload.prefProp}&coeMethod=${payload.coeMethod}`)
  }

  getWeightedValuation(payload:any){
    return this.http.post(`${HOST}calculation/weightedvaluation`,payload);
  }
  
  generatePdf(payload: any,specificity:boolean = false) {
    return this.http.get(`${HOST}upload/generate/${payload?.reportId}/${payload?.model}/${specificity}`);
  }

  modifyExcel(payload:any){
    return this.http.post(`${HOST}upload/modifyExcel`,payload)
  }

  postReportData(payload:any){
    return this.http.post(`${HOST}report/generateReport`,payload);
  }
  generateReport(reportId:string,approach:string){
    return this.http.get(`${HOST}report/getReport/${approach}/${reportId}`,{
    responseType: 'blob'
});
  }

  previewReport(reportId:string,approach:string){
    return this.http.get(`${HOST}report/previewReport/${approach}/${reportId}`
    // ,{
    // responseType: 'blob'
// }
);
  }

  getWaccIndustryOrCompanyBased(payload:any){
    return this.http.get(`${HOST}coe/industryOrCompanyBasedWacc?adjCoe=${payload.adjCoe}&costOfDebt=${payload.costOfDebt}&copShareCapital=${payload.copShareCapital}&deRatio=${payload.deRatio}&type=${payload.type}&taxRate=${payload.taxRate}&excelSheetId=${payload.excelSheetId}`)

  }

  docxToPdf(blob:any){
    return this.http.post(`${HOST}report/convertDocxToPdf`,blob)

  }
}
