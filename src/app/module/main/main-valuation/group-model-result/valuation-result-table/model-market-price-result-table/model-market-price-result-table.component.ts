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
  convertEpochToPlusOneDate = getAdjustedTimestamp;
  sharePriceNinetyDays:any = [];
  sharePriceTenDays:any = [];
  valuePerShare = 0;
  vwapNinetyDays = 0;
  vwapTenDays = 0;
  formatNumber = formatPositiveAndNegativeValues;

  ngOnChanges(){
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
}
