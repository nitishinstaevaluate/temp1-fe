import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatTableDataSource } from '@angular/material/table';
import { COMMON_COLUMN, EXCESS_EARNING_COLUMN, FCFE_COLUMN, FCFF_COLUMN, MODELS} from 'src/app/shared/enums/constant';
import { CustomDatePipe } from 'src/app/shared/pipe/date.pipe';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-valuation-result-table',
  templateUrl: './valuation-result-table.component.html',
  styleUrls: ['./valuation-result-table.component.scss']
})
export class ValuationResultTableComponent implements OnInit, OnChanges{
@Input() transferStepperthree:any;
@ViewChild('dynamicTable') dynamicTable!: ElementRef;

HOST = environment.baseUrl

fcfe=false;
fcff=false;
relativeVal = false;
excessEarn = false;
nav=false;
ruleElevenUa=false;
tableData:any;
valuationDataReport:any=[];
columnName = COMMON_COLUMN;
dataSourceFcfe:any;
dataSourceFcff:any;
dataSourceExcessEarn:any;
dataSourceNav:any;
dataSourceElevenUa:any;
companyData :any;
formData :any;
industryData:any = new MatTableDataSource();
selectedTabIndex:any;
fcfeColumn:any=[];
excessEarnColumn:any=[];
fcffColumn:any=[];
isLoader=false;
displayFcfeColumn=FCFE_COLUMN;
displayFcffColumn=FCFF_COLUMN;
displayExcessEarnColumn=EXCESS_EARNING_COLUMN;
getKeys(navData:any){
this.dataSourceNav =[navData].map((response:any)=>{
  let obj = Object.values(response);
  obj = obj.map((objVal:any)=>{
    return {
      fieldName:objVal?.fieldName,
      bookValue:objVal?.bookValue ? parseFloat(objVal.bookValue) : objVal.bookValue,
      fairValue:objVal?.fairValue  ? parseFloat(objVal.fairValue) : objVal.value ? parseFloat(objVal.value) : objVal.fairValue,
      type:objVal?.type === 'book_value' ? 'Book Value' : objVal.type === 'market_value' ? 'Market Value' : objVal.type
    }
  })
  return obj;
})
this.dataSourceNav=this.dataSourceNav[0];
this.dataSourceNav.splice(this.dataSourceNav.findIndex((item:any) => item?.fieldName === 'Net Current Assets'),0,{fieldName:''})
this.dataSourceNav.splice(this.dataSourceNav.findIndex((item:any) => item?.fieldName === 'Firm Value'),0,{fieldName:''})
}

ngAfterViewInit(): void {
  this.setTableWidth();
}

ngOnInit(): void {}

constructor(private excelAndReportService:ExcelAndReportService,
  private snackbar:MatSnackBar,
  private customDatePipe:CustomDatePipe){}

ngOnChanges(changes:SimpleChanges): void {
  let equityValuationDate:any;
  this.formData = this.transferStepperthree;
  if(this.transferStepperthree?.formOneAndThreeData && !this.transferStepperthree?.formOneAndThreeData?.model?.includes(MODELS.RULE_ELEVEN_UA)){
    this.transferStepperthree?.formFourData?.appData?.valuationResult.map((response:any)=>{
    if(response.model === 'FCFE'){
      this.fcfeColumn = response?.columnHeader;
      this.dataSourceFcfe = (this.transposeData(response.valuationData))?.slice(1);

      equityValuationDate = this.customDatePipe.transform(response?.provisionalDate);
      
      let checkIfStubExistInColumnHeaders = this.displayFcfeColumn.some((values:any)=>{
        return (values.includes(`Equity Value as on`) || values.includes('Add:Stub Period Adjustment'))
      })
     
      const discPeriodIndex = this.displayFcfeColumn.findIndex(element => element.includes('Discounting Period'));
      if (discPeriodIndex !== -1  ) {
        this.displayFcfeColumn.splice(discPeriodIndex, 1, `Discounting Period - ${this.transferStepperthree.formOneAndThreeData.discountingPeriod} `);
      }

      this.displayFcfeColumn.splice(this.displayFcfeColumn.length-1,1,`Value per Share (${this.transferStepperthree?.formOneAndThreeData?.currencyUnit})`)
      
      let checkIfKeyExistInResult = this.dataSourceFcfe.some((item:any)=> {return item.some((checkVal:any)=>{return  (checkVal === 'stubAdjValue' || checkVal === 'equityValueNew')})});
      
      this.dataSourceFcfe = this.dataSourceFcfe.map((subArray: any, index: any) => {
      
        if(checkIfKeyExistInResult){
          const stubIndex = 17;
        const equityValueIndex = 18;
          
        if (!checkIfStubExistInColumnHeaders) {
          this.displayFcfeColumn.splice(16, 1, `Equity Value on ${equityValuationDate}`);
          
          if (!this.displayFcfeColumn.includes('Add:Stub Period Adjustment')) {
            this.displayFcfeColumn.splice(stubIndex, 0, 'Add:Stub Period Adjustment');
          }
  
          const equityValueString = `Equity Value as on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`;
          if (!this.displayFcfeColumn.includes(equityValueString)) {
            this.displayFcfeColumn.splice(equityValueIndex, 0, equityValueString);
          } 
        } else {
          if (this.displayFcfeColumn.includes('Add:Stub Period Adjustment')) {
            this.displayFcfeColumn = this.displayFcfeColumn.map((item: string) => {
              if (item.includes('Add:Stub Period Adjustment')) {
                return item.replace(item, 'Add:Stub Period Adjustment');
              }
              return item;
            });
          }
  
          const equityValueString = `Equity Value as on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`;
          if (this.displayFcfeColumn.includes(equityValueString)) {
            this.displayFcfeColumn = this.displayFcfeColumn.map((item: string) => {
              if (item.includes('Equity Value as on')) {
                return item.replace(item, equityValueString);
              }
              return item;
            });
          }
            this.displayFcfeColumn.splice(16, 1, `Equity Value on ${equityValuationDate}`);
        }
    
        return [this.displayFcfeColumn[index], ...subArray.slice(1)];
        }
        else{
          this.displayFcfeColumn.splice(16, 1, `Equity Value on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`);
          const indexOfEquity = this.displayFcfeColumn.findIndex(item => item.includes('Equity Value as on'));
          const indexOfStub = this.displayFcfeColumn.findIndex(item => item.includes('Add:Stub Period Adjustment'));
          if (indexOfEquity !== -1) {
              this.displayFcfeColumn.splice(indexOfEquity, 1);
          }
          if (indexOfStub !== -1) {
              this.displayFcfeColumn.splice(indexOfStub, 1);
          }
          return [this.displayFcfeColumn[index], ...subArray.slice(1)];
        }
    });
      
    }
    if(response.model === 'FCFF'){
      this.fcffColumn=response?.columnHeader;
      this.dataSourceFcff = (this.transposeData(response.valuationData))?.slice(1);
      
         equityValuationDate = this.customDatePipe.transform(response?.provisionalDate);
      // const particularsIndex = this.fcffColumn.map((values:any)=>values.toLowerCase()).indexOf('particulars');
      
      // if(particularsIndex !== -1){
      //    equityValuationDate = this.fcffColumn[particularsIndex+1]
      // }
      
      let checkIfStubExistInColumnHeaders = this.displayFcffColumn.some((values:any)=>{
        return (values.includes(`Equity Value as on`) || values.includes('Add:Stub Period Adjustment'))
      })
      
      let checkIfKeyExistInResult = this.dataSourceFcff.some((item:any)=> {return item.some((checkVal:any)=>{return  (checkVal === 'stubAdjValue' || checkVal === 'equityValueNew')})});
      
      const discPeriodIndex = this.displayFcffColumn.findIndex(element => element.includes('Discounting Period'));
      if (discPeriodIndex !== -1  ) {
        this.displayFcffColumn.splice(discPeriodIndex, 1, `Discounting Period - ${this.transferStepperthree?.formOneAndThreeData?.discountingPeriod} `);
      }
      
      this.displayFcffColumn.splice(this.displayFcffColumn.length-1,1,`Value per Share (${this.transferStepperthree?.formOneAndThreeData?.currencyUnit})`)
      
      this.dataSourceFcff = this.dataSourceFcff.map((subArray: any, index: any) => {
        if(checkIfKeyExistInResult){
          const stubIndex = 18;
          const equityValueIndex = 19;
      
          if (!checkIfStubExistInColumnHeaders) {
          this.displayFcffColumn.splice(17, 1, `Equity Value on ${equityValuationDate}`);    
            if (!this.displayFcffColumn.includes('Add:Stub Period Adjustment')) {
                  this.displayFcffColumn.splice(stubIndex, 0, 'Add:Stub Period Adjustment');
              }
      
              const equityValueString = `Equity Value as on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`;
              if (!this.displayFcffColumn.includes(equityValueString)) {
                  this.displayFcffColumn.splice(equityValueIndex, 0, equityValueString);
              }
          } else {
              if (this.displayFcffColumn.includes('Add:Stub Period Adjustment')) {
                  this.displayFcffColumn = this.displayFcffColumn.map((item: string) => {
                      if (item.includes('Add:Stub Period Adjustment')) {
                          return item.replace(item, 'Add:Stub Period Adjustment');
                      }
                      return item;
                  });
              }
      
              const equityValueString = `Equity Value as on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`;
              if (this.displayFcffColumn.includes(equityValueString)) {
                  this.displayFcffColumn = this.displayFcffColumn.map((item: string) => {
                      if (item.includes('Equity Value as on')) {
                          return item.replace(item, equityValueString);
                      }
                      return item;
                  });
              }
          this.displayFcffColumn.splice(17, 1, `Equity Value on ${equityValuationDate}`);
          }
          return [this.displayFcffColumn[index], ...subArray.slice(1)];
          
        }
        else{
          this.displayFcffColumn.splice(17, 1, `Equity Value on ${this.formatDate(this.transferStepperthree?.formOneAndThreeData?.valuationDate)}`);
          const indexOfEquity = this.displayFcffColumn.findIndex(item => item.includes('Equity Value as on'));
          const indexOfStub = this.displayFcffColumn.findIndex(item => item.includes('Add:Stub Period Adjustment'));
          if (indexOfEquity !== -1) {
              this.displayFcffColumn.splice(indexOfEquity, 1);
          }
          if (indexOfStub !== -1) {
              this.displayFcffColumn.splice(indexOfStub, 1);
          }
          return [this.displayFcffColumn[index], ...subArray.slice(1)];
        }
       
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
      equityValuationDate = this.customDatePipe.transform(response?.provisionalDate);
      // const particularsIndex = this.excessEarnColumn.map((values:any)=>values.toLowerCase()).indexOf('particulars');
      
      // if(particularsIndex !== -1){
      //    equityValuationDate = this.excessEarnColumn[particularsIndex+1]
      // }

      let checkIfStubExistInColumnHeaders = this.displayExcessEarnColumn.some((values:any)=>{
        return (values.includes(`Equity Value as on`) || values.includes('Add:Stub Period Adjustment'))
      })

      let checkIfKeyExistInResult = this.dataSourceExcessEarn.some((item:any)=> {return item.some((checkVal:any)=>{return  (checkVal === 'stubAdjValue' || checkVal === 'equityValueNew')})});
  
      const discPeriodIndex = this.displayExcessEarnColumn.findIndex(element => element.includes('Discounting Period'));
      if (discPeriodIndex !== -1  ) {
        this.displayExcessEarnColumn.splice(discPeriodIndex, 1, `Discounting Period - ${this.transferStepperthree.formOneAndThreeData.discountingPeriod} `);
      }

      this.displayExcessEarnColumn.splice(this.displayExcessEarnColumn.length-1,1,`Value per Share (${this.transferStepperthree?.formOneAndThreeData?.currencyUnit})`)
     
      this.dataSourceExcessEarn = this.dataSourceExcessEarn.map((subArray: any, index: any) => {
       if(checkIfKeyExistInResult){
        const stubIndex = 10;
        const equityValueIndex = 11;
    
        if (!checkIfStubExistInColumnHeaders) {
          this.displayExcessEarnColumn.splice(9, 1, `Equity Value on ${equityValuationDate}`);
          if (!this.displayExcessEarnColumn.includes('Add:Stub Period Adjustment')) {
              this.displayExcessEarnColumn.splice(stubIndex, 0, 'Add:Stub Period Adjustment');
          }
  
          const equityValueString = `Equity Value as on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`;
          if (!this.displayExcessEarnColumn.includes(equityValueString)) {
              this.displayExcessEarnColumn.splice(equityValueIndex, 0, equityValueString);
          }
        } else {
            if (this.displayExcessEarnColumn.includes('Add:Stub Period Adjustment')) {
              this.displayExcessEarnColumn = this.displayExcessEarnColumn.map((item: string) => {
                if (item.includes('Add:Stub Period Adjustment')) {
                    return item.replace(item, 'Add:Stub Period Adjustment');
                }
                return item;
              });
            }
    
            const equityValueString = `Equity Value as on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`;
            if (this.displayExcessEarnColumn.includes(equityValueString)) {
                this.displayExcessEarnColumn = this.displayExcessEarnColumn.map((item: string) => {
                    if (item.includes('Equity Value as on')) {
                        return item.replace(item, equityValueString);
                    }
                    return item;
                });
            }
          this.displayExcessEarnColumn.splice(9, 1, `Equity Value on ${equityValuationDate}`);
        }
    
        return [this.displayExcessEarnColumn[index], ...subArray.slice(1)];
      }
      
      else{
        this.displayExcessEarnColumn.splice(9, 1, `Equity Value on ${this.formatDate(this.transferStepperthree.formOneAndThreeData.valuationDate)}`);
        const indexOfEquity = this.displayExcessEarnColumn.findIndex(item => item.includes('Equity Value as on'));
        const indexOfStub = this.displayExcessEarnColumn.findIndex(item => item.includes('Add:Stub Period Adjustment'));
        if (indexOfEquity !== -1) {
          this.displayExcessEarnColumn.splice(indexOfEquity, 1);
        }
        if (indexOfStub !== -1) {
          this.displayExcessEarnColumn.splice(indexOfStub, 1);
        }
        return [this.displayExcessEarnColumn[index], ...subArray.slice(1)];
       }
    });
    }
    if(response.model === 'NAV'){
      this.getKeys(response.valuationData);
    }
  })
}
this.dataSourceFcff && this.transferStepperthree?.formOneAndThreeData?.model.includes('FCFF') ? this.fcff = true : this.fcff = false;
this.dataSourceFcfe && this.transferStepperthree?.formOneAndThreeData?.model.includes('FCFE') ? this.fcfe = true : this.fcfe = false;
this.valuationDataReport && (this.transferStepperthree?.formOneAndThreeData?.model.includes('Relative_Valuation') || this.transferStepperthree?.formOneAndThreeData?.model.includes('CTM')) ? this.relativeVal = true : this.relativeVal = false;
this.dataSourceExcessEarn && this.transferStepperthree?.formOneAndThreeData?.model.includes('Excess_Earnings') ? this.excessEarn = true : this.excessEarn = false;
this.dataSourceNav && this.transferStepperthree?.formOneAndThreeData?.model.includes('NAV') ? this.nav = true : this.nav = false;
this.transferStepperthree?.formFourData?.appData && this.transferStepperthree?.formOneAndThreeData?.model.includes(MODELS.RULE_ELEVEN_UA) ? this.ruleElevenUa = true : this.ruleElevenUa = false;
  this.onTabSelectionChange();
}
  
transposeData(data: any[][]): any[][] {
  return data[0].map((_, columnIndex) => data.map((row) => row[columnIndex]));
}

checkIndustryOrCompany(){
  return this.transferStepperthree.formOneAndThreeData?.preferenceRatioSelect === 'Company Based' ? true :false;
}

formatNumber(value: any, threeDecimalNeeded?:any) {
  if (!isNaN(value)  && typeof value === 'number') {
    if(value && `${value}`.includes('-')){
      let formattedNumber = value.toLocaleString(undefined, {
        minimumIntegerDigits: 1,
        minimumFractionDigits: threeDecimalNeeded ? 3 : 2,
        maximumFractionDigits: threeDecimalNeeded ? 3 : 2,
      });
      return `(${`${formattedNumber}`.replace(/-/g,'')})`;
    }
    else if(value){
     const formatValue =  value.toLocaleString(undefined, {
        minimumIntegerDigits: 1,
        minimumFractionDigits: threeDecimalNeeded ? 3 : 2,
        maximumFractionDigits: threeDecimalNeeded ? 3 : 2,
      })
      return formatValue;
    }
    else{
     return '-';
    }
  }
    else{
      return  value;
    }
  
}

checkVal(value:string,model:any){
  if(model === 'fcfe') return !!this.displayFcfeColumn.includes(value);
  if(model === 'fcff') return !!this.displayFcffColumn.includes(value);
  if(model === 'Excess_Earnings') return !!this.displayExcessEarnColumn.includes(value);
  return;
}

isDiscountingFactor(value:string){
  if(value.includes('Discounting Factor')){
    return true;
  }
  return false;
}

formatDate(epochTimestamp:any) {
  const date = new Date(epochTimestamp);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

onTabSelectionChange() {
  // Update the selectedTabIndex when the user selects a tab
  const findFirstEle = this.transferStepperthree?.formOneAndThreeData?.model.sort();
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
  this.transferStepperthree?.formFourData?.appData?.valuationResult.map((response:any)=>{
    if(response.model === modelName){
      model = response.model;
    }
  })
  const payload={
    model,
    reportId:this.transferStepperthree?.formFourData?.appData?.reportId,
  }
   this.excelAndReportService.generatePdf(payload, true).subscribe(
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

contentIsBig(data:any){
  if(data && data[0].length > 7)
    return true;
  return false
}

setTableWidth(){
  if(!this.fcfe || !this.fcff)
    return
  const tableElement = this.dynamicTable.nativeElement;
  const totalColumns = tableElement.getElementsByTagName('th').length;
  const columnWidth = 100 / totalColumns;
  const labelWidth = 20;
  const columns = tableElement.querySelectorAll('th, td');
  columns.forEach((column: HTMLElement, index: number) => {
    if (index === 0) {
      column.style.width = `${labelWidth}%`;
    } else {
      column.style.width = `${columnWidth}%`;
    }
  });
}
}

