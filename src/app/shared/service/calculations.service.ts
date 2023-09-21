import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroments';
const HOST = environment.HOST;

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor(private http:HttpClient) { }

  getCostOfEquity(payload:any){
    return this.http.get(`${HOST}coe/adjcoe/?riskFreeRate=${payload.riskFreeRate}&expMarketReturn=${payload.expMarketReturn}&beta=${payload.beta}&riskPremium=${payload.riskPremium}&coeMethod=${payload.coeMethod}`)
  }

  getWacc(payload:any){
    return this.http.get(`${HOST}coe/wacc?adjustedCostOfEquity=${payload.adjCoe}&equityProp=${payload.equityProp}&costOfDebt=${payload.costOfDebt}&taxRate=${payload.taxRate}&debtProp=${payload.debtProp}&copShareCapital=${payload.copShareCapital}&prefProp=${payload.prefProp}&coeMethod=${payload.coeMethod}`)
  }

  getWeightedValuation(payload:any){
    return this.http.post(`${HOST}calculation/weightedvaluation`,payload);
  }
}
