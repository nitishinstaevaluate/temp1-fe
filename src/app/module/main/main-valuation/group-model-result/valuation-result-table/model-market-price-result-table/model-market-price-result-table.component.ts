import { Component, Input, OnChanges } from '@angular/core';
import { MODELS } from 'src/app/shared/enums/constant';
import {  convertToNumberOrZero, formatPositiveAndNegativeValues, getAdjustedTimestamp } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-model-market-price-result-table',
  templateUrl: './model-market-price-result-table.component.html',
  styleUrls: ['./model-market-price-result-table.component.scss']
})
export class ModelMarketPriceResultTableComponent implements OnChanges{
  @Input() formData:any;
  @Input() marketMethodType:any;
  convertEpochToPlusOneDate = getAdjustedTimestamp;
  sharePriceNinetyDays:any = [];
  sharePriceTenDays:any = [];
  valuePerShare:any = 0;
  vwapNinetyDays:any = 0;
  vwapTenDays:any = 0;
  formatNumber = formatPositiveAndNegativeValues;

  ngOnChanges(){
    console.log(this.marketMethodType,"market price method type")
    if(this.formData){
      this.formData?.formFourData?.appData?.valuationResult.map((indValuations:any)=>{ 
        if(indValuations?.model === MODELS.MARKET_PRICE){
          this.sharePriceNinetyDays = indValuations?.valuationData?.sharePriceLastNinetyDays;
          this.sharePriceTenDays = indValuations?.valuationData?.sharePriceLastTenDays;
          this.valuePerShare = indValuations?.valuation;
          this.vwapNinetyDays = indValuations.valuationData?.vwapLastNinetyDays;
          this.vwapTenDays = indValuations.valuationData?.vwapLastTenDays;
        }
      })
    }
  }

  totalRevenue(vwap:any, volume:any){
    return formatPositiveAndNegativeValues(convertToNumberOrZero(vwap) * convertToNumberOrZero(volume));
  }

  columnToBeDisabled(columnName:any){
    return this.marketMethodType && this.marketMethodType === columnName ? 'overlayBackgrnd' : '';
  }

  dataExist(vwapType:any){
      if(vwapType === 'vwapNse' && this.valuePerShare?.valuePerShareNse) return true;
      if(vwapType === 'vwapBse' && this.valuePerShare?.valuePerShareBse) return true;
      return false;

  }

  getColspan(type?:any): string {
    if(type === 'finalVal'){
      const { valuePerShareNse, valuePerShareBse } = this.valuePerShare || {};
      if (!valuePerShareNse && !valuePerShareBse) {
        return '6';
      } else if (!valuePerShareNse || !valuePerShareBse) {
        return '3';
      } else {
        return '3';
      }
    }
    const { valuePerShareNse, valuePerShareBse } = this.valuePerShare || {};
    if (!valuePerShareNse && !valuePerShareBse) {
      return '6';
    } else if (!valuePerShareNse || !valuePerShareBse) {
      return '4';
    } else {
      return '6';
    }
  }
}
