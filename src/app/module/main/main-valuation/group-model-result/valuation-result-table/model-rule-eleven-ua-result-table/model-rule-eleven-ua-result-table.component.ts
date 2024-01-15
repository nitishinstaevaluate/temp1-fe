import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-model-rule-eleven-ua-result-table',
  templateUrl: './model-rule-eleven-ua-result-table.component.html',
  styleUrls: ['./model-rule-eleven-ua-result-table.component.scss']
})
export class ModelRuleElevenUaResultTableComponent implements OnChanges {
  @Input() formData:any;
  totalCalculationA = 0;
  totalCalculationB = 0;
  totalCalculationC = 0;
  totalCalculationD = 0;
  totalCalculationL = 0;
  jewelleryOrArtisticWork:any=[];
  constructor(){}

  ngOnChanges(){
    if(this.formData){
      this.jewelleryOrArtisticWork=[];
      const jewellery = this.formData?.formThreeData?.appData?.inputData?.fairValueJewellery;
      const artisticWork = this.formData?.formThreeData?.appData?.inputData?.fairValueArtistic;
      const jewelleryAndArtisticWorkArray = [
        {
          name:"Jewellery",
          value:jewellery
        },
        {
          name:"Artistic Value",
          value:artisticWork
        }
      ]
      for(let i = 0; i <= jewelleryAndArtisticWorkArray.length; i++){
        if(jewelleryAndArtisticWorkArray[i]?.name){
            const romanNumeral = this.convertToRomanNumeral(i);
            const obj = {
              index:romanNumeral,
              label:jewelleryAndArtisticWorkArray[i]?.name,
              value:jewelleryAndArtisticWorkArray[i]?.value ? jewelleryAndArtisticWorkArray[i].value : '-' 
            }
            this.jewelleryOrArtisticWork.push(obj);
          }
        }
      }
  }

  convertToRomanNumeral(num:any) {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
  
    if (num === undefined || num === null || num > romanNumerals.length) {
      return '';
    }
  
    return romanNumerals[num];
  }

  calculateTotalA(){
    if(this.formData){
      const totalIncomeTaxPaid = this.formData?.formThreeData?.appData?.totalIncomeTaxPaid;
      const unamortisedAmountOfDeferredExpenditure = this.formData?.formThreeData?.appData?.unamortisedAmountOfDeferredExpenditure;
      this.totalCalculationA = totalIncomeTaxPaid + unamortisedAmountOfDeferredExpenditure; 
      return totalIncomeTaxPaid + unamortisedAmountOfDeferredExpenditure;
    }
  }

  calculateTotalB(){
    let totalValue = 0;
    if(this.formData){
      for(let i= 0; i< this.jewelleryOrArtisticWork.length; i++){
        if(this.jewelleryOrArtisticWork[i]?.value && this.jewelleryOrArtisticWork[i]?.value !== '-'){
          totalValue += parseFloat(this.jewelleryOrArtisticWork[i].value)
        }
      }
    }
    this.totalCalculationB = totalValue ? totalValue : 0;
    return totalValue ? totalValue : '-';
  }

  calculateTotalD(){
    if(this.formData){
      this.totalCalculationD = this.formData?.formThreeData?.appData?.inputData?.fairValueImmovableProp ? parseFloat(this.formData.formThreeData.appData.inputData.fairValueImmovableProp) : 0;
      return this.formData?.formThreeData?.appData?.inputData?.fairValueImmovableProp ? this.formData.formThreeData.appData.inputData.fairValueImmovableProp : '-';
    }
  }

  calculateTotalL(){
    if(this.formData){
      const paidUpCapital = this.formData?.formThreeData?.appData?.paidUpCapital;
      const paymentDividends = this.formData?.formThreeData?.appData?.paymentDividends;
      const reservAndSurplus = this.formData?.formThreeData?.appData?.reserveAndSurplus;
      const provisionForTaxation = this.formData?.formThreeData?.appData?.provisionForTaxation;
      const contingentLiabilities = isNaN(parseFloat(this.formData?.formThreeData?.appData?.inputData?.contingentLiability)) ? 0 : parseFloat(this.formData?.formThreeData?.appData?.inputData?.contingentLiability);
      const otherThanAscertainLiability = isNaN(parseFloat(this.formData?.formThreeData?.appData?.inputData?.otherThanAscertainLiability)) ? 0 : parseFloat(this.formData?.formThreeData?.appData?.inputData?.otherThanAscertainLiability);
      this.totalCalculationL = paidUpCapital + paymentDividends + reservAndSurplus + provisionForTaxation + contingentLiabilities + otherThanAscertainLiability; 
      return paidUpCapital + paymentDividends + reservAndSurplus + provisionForTaxation + contingentLiabilities + otherThanAscertainLiability;
    }
    return '-';
  }

  calculateAll() {
      return  this.totalCalculationA+ this.totalCalculationB + this.totalCalculationC + this.totalCalculationD - this.totalCalculationL;
  }
  
  calculateFairMarketValue(){
    const phaseValue = !isNaN(parseFloat(this.formData?.formThreeData?.appData?.inputData?.phaseValue)) ? parseFloat(this.formData?.formThreeData?.appData?.inputData?.phaseValue) : 1;
    const paidUpCapital = !isNaN(parseFloat(this.formData?.formThreeData?.appData?.paidUpCapital)) ? parseFloat(this.formData?.formThreeData?.appData?.paidUpCapital) : 1;

    const totalSum = this.totalCalculationA + this.totalCalculationB + this.totalCalculationC + this.totalCalculationD + this.totalCalculationL;

    let result;

    if (!isNaN(totalSum) && !isNaN(paidUpCapital) && totalSum > 0 && paidUpCapital > 0) {
        result = (totalSum * phaseValue) / paidUpCapital;
    } else {
        result = 0;
    }

    return result.toFixed(2);
  }

  calculateTotalInvestmentSharesAndSecurities(){
    const investmentTotalFromExcel = this.formData?.formThreeData?.appData.totalInvestmentSharesAndSecurities;
    const elevenUaInvestment = this.formData?.formThreeData.appData.inputData.fairValueinvstShareSec;
    if(!elevenUaInvestment){
      return investmentTotalFromExcel;
    }
    return elevenUaInvestment;
  }
}
