import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {  MatTableDataSource } from '@angular/material/table';
import { COMMON_COLUMN, FCFE_COLUMN, FCFF_COLUMN} from 'src/app/shared/enums/constant';

@Component({
  selector: 'app-valuation-result-table',
  templateUrl: './valuation-result-table.component.html',
  styleUrls: ['./valuation-result-table.component.scss']
})
export class ValuationResultTableComponent implements OnInit, OnChanges{
@Input() transferStepperthree:any;

fcfe=false;
fcff=false;
relativeVal = false;
tableData:any;
valuationDataReport:any=[];
columnName = COMMON_COLUMN;
dataSourceFcfe:any;
dataSourceFcff:any;
companyData :any;
formData :any;
industryData:any = new MatTableDataSource();

ngOnInit(): void {}

ngOnChanges(): void {
  this.formData = this.transferStepperthree;
  this.transferStepperthree?.formTwoData?.appData?.valuationResult.map((response:any)=>{
    if(response.model === 'FCFE'){
      this.dataSourceFcfe = (this.transposeData(response.valuationData))?.slice(1);
      this.dataSourceFcfe = this.dataSourceFcfe.map((subArray:any, index:any) => {
        return [FCFE_COLUMN[index], ...subArray.slice(1)];
      });
    }
    if(response.model === 'FCFF'){
      this.dataSourceFcff = (this.transposeData(response.valuationData))?.slice(1);
      this.dataSourceFcff = this.dataSourceFcff.map((subArray:any, index:any) => {
        return [FCFF_COLUMN[index], ...subArray.slice(1)];
      });
    }
    if(response.model === 'Relative_Valuation'){
      const company = response?.valuationData?.companies;
      const industry = response?.valuationData?.industries;
      const toggleIndustryOrCompany = this.checkIndustryOrCompany();
      this.tableData = {company,industry,status:toggleIndustryOrCompany,tableClass:true};
      this.valuationDataReport = response?.valuationData?.valuation;
    }
  })
  this.dataSourceFcff && this.transferStepperthree?.formOneData?.model.includes('FCFF') ? this.fcff = true : this.fcff = false;
  this.dataSourceFcfe && this.transferStepperthree?.formOneData?.model.includes('FCFE') ? this.fcfe = true : this.fcfe = false;
  this.valuationDataReport && this.transferStepperthree?.formOneData?.model.includes('Relative_Valuation') ? this.relativeVal = true : this.relativeVal = false;
}
  
transposeData(data: any[][]): any[][] {
  return data[0].map((_, columnIndex) => data.map((row) => row[columnIndex]));
}

checkIndustryOrCompany(){
  return this.transferStepperthree.formOneData?.preferenceRatioSelect === 'Company Based' ? true :false;
}

formatNumber(value: any): string {
  if (!isNaN(value)  && typeof value === 'number') {
    return value?.toFixed(2);
  } else {
    return value;
  }
}

checkVal(value:string,model:any){
  if(model === 'fcfe') return !!FCFE_COLUMN.includes(value);
  if(model === 'fcff') return !!FCFF_COLUMN.includes(value);
  return;
}
}

