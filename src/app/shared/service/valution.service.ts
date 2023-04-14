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

  submitForm(data:any){
    return this.http.post(`${HOST}valuationProcess`,{
      "userId":"641d654fa83ed4a5f0293a52",
      "excelSheetId":"1680591417855-FCFE Input Sheet with Formula (1).xlsx",
      "valuationDate":"",
      "company":"ABCD",
      "industry":"ABC",
      "projectionYears":"6",
      "model":"FCFF",
      "outstandingShares":1000,
      "taxRateType":"Normal_Tax_Rate",
      "taxRate":8,
      "discountRate":"WACC",
      "terminalGrowthRate":4.5,
      "discountingPeriod":"Full_Period",
      "coeMethod":"CAPM",
      "riskFreeRateType":"user_input_year",
      "riskFreeRateYear":3.5,
      "riskFreeRate":6,
      "expMarketReturnType":"ACE",
      "expMarketReturn":6,
      "historicalYears":"5",
      "betaType":"",
      "beta":5,
      "riskPremium":4,
      "copShareCapitalType":"user_input",
      "copShareCapital":1,
      "costOfDebtType":"Finance_Cost",
      "costOfDebt":10,
      "capitalStructure":"Company_Based",
      "popShareCapitalType":"CFBS"
      });
  }
}
