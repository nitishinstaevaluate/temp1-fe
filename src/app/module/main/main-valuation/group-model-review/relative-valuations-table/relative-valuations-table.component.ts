import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RELATIVE_VALUATION_COMPANY_COLUMNS, RELATIVE_VALUATION_COMPANY_MAPPING, RELATIVE_VALUATION_INDUSTRY_COLUMNS, RELATIVE_VALUATION_INDUSTRY_MAPPING } from 'src/app/shared/enums/constant';
import { IS_ARRAY_EMPTY_OR_NULL } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-relative-valuations-table',
  templateUrl: './relative-valuations-table.component.html',
  styleUrls: ['./relative-valuations-table.component.scss']
})
export class RelativeValuationsTableComponent implements OnChanges {
  constructor(private changeDetectorRef: ChangeDetectorRef){}
  @Input() tableData : any = [];

  companyColumn = RELATIVE_VALUATION_COMPANY_COLUMNS;
  companyColumnMap = RELATIVE_VALUATION_COMPANY_MAPPING;
  industryColumn = RELATIVE_VALUATION_INDUSTRY_COLUMNS;
  industryColumnMap = RELATIVE_VALUATION_INDUSTRY_MAPPING;

  companyData :any;
  industryData:any = new MatTableDataSource();

  ngOnChanges(changes: SimpleChanges): void {
    this.companyData = [];
    this.industryData = [];
    this.companyData = this.tableData?.company;
    this.industryData = this.tableData?.industry;
    if(this.companyData && this.companyData?.length>0 && !this.isArrayEmptyOrNull(this.companyData)){
    this.checkAverageExist(); // check if average object already exist or not in company array,if exist then splice and add new one,else create new
    this.checkMedianExist(); // check if median object already exist or not in company array,if exist then splice and add new one,else create new one
    }
  }

  checkAverageExist(){
    const ind = this.companyData.findIndex((index:any) => index.company === 'Average')
    if(ind !== -1){
      this.companyData.splice(ind,1)
      const values = {
        'company':'Average',
        'peRatio':this.findAverage('peRatio').toFixed(2),
        'pbRatio':this.findAverage('pbRatio').toFixed(2),
        'ebitda':this.findAverage('ebitda').toFixed(2),
        'sales': this.findAverage('sales').toFixed(2)
      }
      this.companyData.push(values);
    }
    else{
      const values = {
        'company':'Average',
        'peRatio':this.findAverage('peRatio').toFixed(2),
        'pbRatio':this.findAverage('pbRatio').toFixed(2),
        'ebitda':this.findAverage('ebitda').toFixed(2),
        'sales': this.findAverage('sales').toFixed(2)
      }
      this.companyData.push(values);
    }
  }

  checkMedianExist(){
    const ind = this.companyData.findIndex((index:any) => index.company === 'Median')
    if(ind !== -1){
      this.companyData.splice(ind,1)
      const values = {
        'company':'Median',
        'peRatio':this.findMedian('peRatio').toFixed(2),
        'pbRatio':this.findMedian('pbRatio').toFixed(2),
        'ebitda':this.findMedian('ebitda').toFixed(2),
        'sales': this.findMedian('sales').toFixed(2)
      }
      this.companyData.push(values);
    }
    else{
      const values = {
        'company':'Median',
        'peRatio':this.findMedian('peRatio').toFixed(2),
        'pbRatio':this.findMedian('pbRatio').toFixed(2),
        'ebitda':this.findMedian('ebitda').toFixed(2),
        'sales': this.findMedian('sales').toFixed(2)
      }
      this.companyData.push(values);
    }
  }

  isArrayEmptyOrNull(array: any): boolean {
    return IS_ARRAY_EMPTY_OR_NULL(array);
  }

  findAverage(type:any){
    const numbers = this.tableData.company.map((c: any) => {
      if (c.company !== 'Median') {
        return c[type];
      } else {
        return null; 
      }
    }).filter((value: any) => value !== null);
    const sum = numbers.reduce(
      (accumulator:any, currentValue:any) => accumulator + currentValue,
      0
    );
    const average = sum / numbers.length;
    return average
  }

  findMedian(type: string) {
    const ind = this.companyData.findIndex((index: any) => index.company === 'Average');
    const numbers = this.tableData.company.map((c: any) => {
      if (c.company !== 'Average') {
        return c[type];
      } else {
        return null; 
      }
    }).filter((value: any) => value !== null);
  
    numbers.sort((a: any, b: any) => a - b);
    const middleIndex = Math.floor(numbers.length / 2);
    const isEvenLength = numbers.length % 2 === 0;
  
    if (isEvenLength) {
      return (numbers[middleIndex - 1] + numbers[middleIndex]) / 2;
    } else {
      return numbers[middleIndex];
    }
  }
}
