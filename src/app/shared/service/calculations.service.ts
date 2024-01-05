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

  steps: BehaviorSubject<number> = new BehaviorSubject(0);
  checkStepStatus: BehaviorSubject<any> = new BehaviorSubject({status:false});
  checkModel: BehaviorSubject<any> = new BehaviorSubject({status:true});
  
  getCostOfEquity(payload:any){
    return this.http.get(`${HOST}coe/adjcoe/?riskFreeRate=${payload.riskFreeRate}&expMarketReturn=${payload.expMarketReturn}&beta=${payload.beta}&riskPremium=${payload.riskPremium}&coeMethod=${payload.coeMethod}`)
  }

  getWacc(payload:any){
    return this.http.get(`${HOST}coe/wacc?adjustedCostOfEquity=${payload.adjCoe}&equityProp=${payload.equityProp}&costOfDebt=${payload.costOfDebt}&taxRate=${payload.taxRate}&debtProp=${payload.debtProp}&copShareCapital=${payload.copShareCapital}&prefProp=${payload.prefProp}&coeMethod=${payload.coeMethod}`)
  }

  getWeightedValuation(payload:any){
    return this.http.post(`${HOST}calculation/weightedvaluation`,payload);
  }

  getWaccIndustryOrCompanyBased(payload:any){
    return this.http.get(`${HOST}coe/industryOrCompanyBasedWacc?adjCoe=${payload.adjCoe}&costOfDebt=${payload.costOfDebt}&copShareCapital=${payload.copShareCapital}&deRatio=${payload.deRatio}&type=${payload.type}&taxRate=${payload.taxRate}&excelSheetId=${payload.excelSheetId}`)

  }
}
