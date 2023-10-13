import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatTableDataSource } from '@angular/material/table';
import { COMMON_COLUMN, EXCESS_EARNING_COLUMN, FCFE_COLUMN, FCFF_COLUMN} from 'src/app/shared/enums/constant';
import { CalculationsService } from 'src/app/shared/service/calculations.service';

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
excessEarn = false;
nav=false;
tableData:any;
valuationDataReport:any=[];
columnName = COMMON_COLUMN;
dataSourceFcfe:any;
dataSourceFcff:any;
dataSourceExcessEarn:any;
dataSourceNav:any;
companyData :any;
formData :any;
industryData:any = new MatTableDataSource();
selectedTabIndex:any;
fcfeColumn=[];
excessEarnColumn=[];
fcffColumn=[];
isLoader=false;

getKeys(navData:any){
this.dataSourceNav =[navData].map((response:any)=>{
  let obj = Object.values(response);
  obj = obj.map((objVal:any)=>{
    return {
      fieldName:objVal?.fieldName,
      value:objVal?.value ? parseFloat(objVal.value)?.toFixed(3) : objVal.value,
      type:objVal?.type === 'book_value' ? 'Book Value' : objVal.type === 'market_value' ? 'Market Value' : objVal.type
    }
  })
  return obj;
})
this.dataSourceNav=this.dataSourceNav[0];
}
ngOnInit(): void {}

constructor(private calculationService:CalculationsService,private snackbar:MatSnackBar){}

ngOnChanges(changes:SimpleChanges): void {
  this.formData = this.transferStepperthree;
  this.transferStepperthree?.formThreeData?.appData?.valuationResult.map((response:any)=>{
    if(response.model === 'FCFE'){
      this.fcfeColumn = response?.columnHeader;
      this.dataSourceFcfe = (this.transposeData(response.valuationData))?.slice(1);
      this.dataSourceFcfe = this.dataSourceFcfe.map((subArray:any, index:any) => {
        subArray.map((subelements:any)=>{
            if(subelements && subelements === 'stubAdjValue'){
              FCFE_COLUMN.splice(17,0,'Add: Stub Period Adjustment');
            }
            else if( subelements && subelements === 'equityValueNew'){
              FCFE_COLUMN.splice(18,0,'Equity Value as on ');
            }
        })
        return [FCFE_COLUMN[index], ...subArray.slice(1)];
      });
    }
    if(response.model === 'FCFF'){
      this.fcffColumn=response?.columnHeader;
      this.dataSourceFcff = (this.transposeData(response.valuationData))?.slice(1);
      this.dataSourceFcff = this.dataSourceFcff.map((subArray:any, index:any) => {
        subArray.map((subelements:any)=>{
          if(subelements && subelements === 'stubAdjValue'){
            FCFE_COLUMN.splice(18,0,'Add: Stub Period Adjustment');
          }
          else if( subelements && subelements === 'equityValueNew'){
            FCFE_COLUMN.splice(19,0,'Equity Value as on ');
          }
      })
        return [FCFF_COLUMN[index], ...subArray.slice(1)];
      });
    }
    if(response.model === 'Relative_Valuation' || response.model === 'CTM'){
      const company = response?.valuationData?.companies;
      const industry = response?.valuationData?.industries;
      const toggleIndustryOrCompany = this.checkIndustryOrCompany();
      this.tableData = {company,industry,status:toggleIndustryOrCompany,tableClass:true};
      this.valuationDataReport = response?.valuationData?.valuation;
    }
    if(response.model === 'Excess_Earnings'){
      this.excessEarnColumn = response?.columnHeader;
      this.dataSourceExcessEarn = (this.transposeData(response.valuationData))?.slice(1);
      this.dataSourceExcessEarn = this.dataSourceExcessEarn.map((subArray:any, index:any) => {
        return [EXCESS_EARNING_COLUMN[index], ...subArray.slice(1)];
      });
    }
    if(response.model === 'NAV'){
      this.getKeys(response.valuationData);
    }
  })
  this.dataSourceFcff && this.transferStepperthree?.formOneAndTwoData?.model.includes('FCFF') ? this.fcff = true : this.fcff = false;
  this.dataSourceFcfe && this.transferStepperthree?.formOneAndTwoData?.model.includes('FCFE') ? this.fcfe = true : this.fcfe = false;
  this.valuationDataReport && (this.transferStepperthree?.formOneAndTwoData?.model.includes('Relative_Valuation') || this.transferStepperthree?.formOneAndTwoData?.model.includes('CTM')) ? this.relativeVal = true : this.relativeVal = false;
  this.dataSourceExcessEarn && this.transferStepperthree?.formOneAndTwoData?.model.includes('Excess_Earnings') ? this.excessEarn = true : this.excessEarn = false;
  this.dataSourceNav && this.transferStepperthree?.formOneAndTwoData?.model.includes('NAV') ? this.nav = true : this.nav = false;
  this.onTabSelectionChange();
}
  
transposeData(data: any[][]): any[][] {
  return data[0].map((_, columnIndex) => data.map((row) => row[columnIndex]));
}

checkIndustryOrCompany(){
  return this.transferStepperthree.formOneAndTwoData?.preferenceRatioSelect === 'Company Based' ? true :false;
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
  if(model === 'Excess_Earnings') return !!EXCESS_EARNING_COLUMN.includes(value);
  return;
}

onTabSelectionChange() {
  // Update the selectedTabIndex when the user selects a tab
  const findFirstEle = this.transferStepperthree?.formOneAndTwoData?.model.sort();
  if(findFirstEle){
    switch (findFirstEle[0]) {
      case 'FCFE':
        this.selectedTabIndex = 0;
        break;
      case 'FCFF':
        this.selectedTabIndex = 1;
        break;
      case 'Relative_Valuation':
        this.selectedTabIndex = 2;
        break;
      case 'Excess_Earnings':
        this.selectedTabIndex = 3;
        break;
      default:
        console.log("went in default");
    
  }
  }
}

exportPdf(modelName:string){
  this.isLoader=true;
  let model
  this.transferStepperthree?.formThreeData?.appData?.valuationResult.map((response:any)=>{
    if(response.model === modelName){
      model = response.model;
    }
  })
  const payload={
    model,
    reportId:this.transferStepperthree?.formThreeData?.appData?.reportId,
  }
   this.calculationService.generatePdf(payload, true).subscribe(
    (data:any) => {
      this.isLoader = false;
      if(data.status){
        this.snackbar.open('Pdf is downloaded successfully','Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
        
      }
      else{
        this.snackbar.open(data.msg,'Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },
    (error) => {
      this.isLoader = false;
      this.snackbar.open(error.message,'Ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 4000,
        panelClass: 'app-notification-error'
      })
      // Handle the error here
    }
  );
}
}

