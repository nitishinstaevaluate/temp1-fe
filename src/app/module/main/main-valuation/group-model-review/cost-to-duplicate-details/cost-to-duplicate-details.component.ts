import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isSelected } from 'src/app/shared/enums/functions';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-cost-to-duplicate-details',
  templateUrl: './cost-to-duplicate-details.component.html',
  styleUrls: ['./cost-to-duplicate-details.component.scss']
})
export class CostToDuplicateDetailsComponent implements OnChanges {

  @Input() transferStepperTwo :any;
  @Input() currentStepIndex :any;
  @Input() fourthStageInput :any;
  @Output() costToDuplicate :any = new EventEmitter();
  @Output() costToDuplicateSheetData=new EventEmitter<any>();

  displayColumns:any;
  costToDuplicateDataSource:any;
  floatLabelType:any='never';
  appearance:any='fill';
  dataSource:any;
  editedValues:any=[];
  isExcelModified=false;
  modifiedExcelSheetId:string='';
  excelSheetId:any='';
  financialSheetLoader = true;
  loadExcelTable = false;
  excelErrorMsg = false;

  ngOnChanges(){
    this.fetchExcelData();
  }

  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar,
    private excelAndReportService:ExcelAndReportService,
    private processStateManagerService:ProcessStatusManagerService){

  }

  fetchExcelData(){
    this.processStateManagerService.getExcelStatus(localStorage.getItem('processStateId')).subscribe((excelResponse:any)=>{
      if(excelResponse.status){ 
        this.isExcelModified = excelResponse.isExcelModifiedStatus;
        this.excelSheetId = excelResponse.excelSheetId;
        this.loadExcel();
      }
      else{
        this.snackBar.open('Excel sheet Id not found, try reuploading', 'ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },(error)=>{
      this.snackBar.open('Backend error - excel sheet fetch failed', 'ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
    
  }

  loadExcel(){
    this.loadExcelTable = true;
    this.valuationService.getProfitLossSheet(this.excelSheetId,'Cost To Duplicate', localStorage.getItem('processStateId')).subscribe((response:any)=>{
      this.loadExcelTable = false;
      if(response.status){
        this.excelErrorMsg = false;
        this.createCostToDuplicateDataSource(response)
        this.costToDuplicateSheetData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
      }
      else{
        this.excelErrorMsg = true;
      }
    }
    ,(error)=>{
      this.excelErrorMsg = true;
     this.loadExcelTable = false;
     this.costToDuplicateSheetData.emit({status:true, error:error})
       this.costToDuplicate.emit({status:false,error:error});
     })
  }

  checkType(ele:any){
    if(typeof ele === 'string' && isNaN(parseFloat(ele)))
     return true;
    return false
  }

  isNumberOrEmpty(value: any): boolean {
    return (typeof value === 'number' || value === '') && !isNaN(value) ? true : false;
  }

  checkIfEditable(value:any){
    if(value?.Particulars && this.dataSource){
      return this.dataSource.some((data:any)=>{
        if(data.lineEntry.particulars === value?.Particulars && data.lineEntry?.editable){
          return true;
        }
        return false
      })
    }
    return false
  }

  ifOnlyNumber(value:any){
    if(value?.Particulars && this.dataSource){
      return this.dataSource.some((data:any)=>{
        if(data.lineEntry.particulars === value?.Particulars && data.lineEntry?.sysCode !== 3009 && data.lineEntry?.sysCode !== 3018){
          return true;
        }
        return false
      })
    }
    return false
  }

  convertIntoNumber(value:any){
    return parseFloat(value)?.toFixed(2);
  }
  checkSubHeader(value:any,index:number){
    if(index === 0){
      if(value?.Particulars && this.dataSource){
        return this.dataSource.some((data:any)=>{
          if(data.lineEntry.particulars === value?.Particulars && data.lineEntry?.subHeader){
            return true;
          }
          return false
        })
      }
      return false
    }
  }
  checkHeader(value:any,index:number){
    if(index === 0){
      if(value?.Particulars){
        return this.dataSource.some((data:any)=>{
          if(data.lineEntry.particulars === value?.Particulars && data.lineEntry?.header){
            return true;
          }
          return false
        })
      }
      return false
    }
  }
  onInputChange(value: any, column: string,originalValue:any) {
    this.editedValues=[];
    let newValue;
    const cellData = this.getCellAddress(originalValue,column);
    if (value.value.includes(',') || (value.value.includes('(') && value.value.includes(')'))) {
      newValue = parseFloat(value.value.replace(/,|\(|\)/g, ''));
      if (value.value.includes('(') && value.value.includes(')')) {
        newValue = -newValue;
      }
    } else{
      newValue = +value.value;
    }
      const cellStructure={
        cellData,
        oldValue:originalValue[`${column}`],
        newValue:newValue,
        particulars:originalValue.Particulars,
        processStateId:localStorage.getItem('processStateId')
      }
      this.editedValues.push(cellStructure);
      
      const payload = {
        excelSheet:'Cost To Duplicate',
        excelSheetId:this.excelSheetId,
        ...this.editedValues[0] 
      }
      if(payload.newValue !== null && payload.newValue !== undefined){
        this.excelAndReportService.modifyExcel(payload).subscribe(
          async (response:any)=>{
          if(response?.status){
            this.isExcelModified = true;
            this.createCostToDuplicateDataSource(response);
            const excelResponse: any = await this.processStateManagerService.updateEditedExcelStatus(localStorage.getItem('processStateId')).toPromise();
            if(excelResponse?.modifiedExcelSheetId){
              this.excelSheetId = excelResponse.modifiedExcelSheetId;
            }
          }
          // else{  [please uncomment this once backend error handling is done]
          //    this.ruleElevenSheetData.emit({status:false,error:response.error});
          //    this.snackBar.open(response.error,'Ok',{
          //     horizontalPosition: 'right',
          //     verticalPosition: 'top',
          //     duration: 3000,
          //     panelClass: 'app-notification-error'
          //   })
          // }
        },(error)=>{
          // this.ruleElevenSheetData.emit({status:false,error:error.message});
          this.snackBar.open(error.message,'Ok',{
            horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
          })
        })
      }
}

  getCellAddress(data:any,changedColumn:any){
    const cellAddresses:any = [];

    this.displayColumns.forEach((column:any, columnIndex:any) => {
      this.dataSource.forEach((row:any, rowIndex:any) => {
        if (row.lineEntry.particulars === data.Particulars && column === changedColumn) {
          cellAddresses.push({
            cellAddress: `${String.fromCharCode(columnIndex + 65)}${row.lineEntry?.rowNumber}`, // add one since we are looping inside for loop
            columnCell: String.fromCharCode(columnIndex + 65), // add one since we are looping inside for loop
            rowCell: row.lineEntry.rowNumber,
            sysCode: row.lineEntry.sysCode
          });
        }
      });
    });
  
    return cellAddresses;
  }

  createCostToDuplicateDataSource(response:any){
    this.dataSource = response?.data;
    this.displayColumns = Object.keys(this.dataSource[0]);
    
    this.displayColumns.splice(this.displayColumns.indexOf('lineEntry'),1,'Particulars')

    this.costToDuplicateDataSource = this.dataSource.map((result:any)=>{
      const transformedItem: any = {};
      transformedItem['Particulars'] = result.lineEntry.particulars;
      for (let i = 1; i < this.displayColumns.length; i++) {
        const yearKey = this.displayColumns[i];
        transformedItem[yearKey] = result[yearKey];
      }
      return transformedItem;
    });
    this.costToDuplicateDataSource.splice(this.costToDuplicateDataSource.findIndex((item:any) => item.Particulars.includes('Assets')),0,{Particulars:"  "}) //push empty object for line break      
    this.costToDuplicateDataSource.splice(this.costToDuplicateDataSource.findIndex((item:any) => item.Particulars === 'Development Cost'),0,{Particulars:"  "}) //push empty object for line break      
    this.costToDuplicateDataSource.splice(this.costToDuplicateDataSource.findIndex((item:any) => item.Particulars === 'Operational Exp'),0,{Particulars:"  "}) //push empty object for line break      
    this.costToDuplicateDataSource.splice(this.costToDuplicateDataSource.findIndex((item:any) => item.Particulars === 'Legal Cost'),0,{Particulars:"  "}) //push empty object for line break      
    this.costToDuplicateDataSource.splice(this.costToDuplicateDataSource.findIndex((item:any) => item.Particulars === 'Other Cost'),0,{Particulars:"  "}) //push empty object for line break      
    this.costToDuplicateDataSource.splice(this.costToDuplicateDataSource.findIndex((item:any) => item.Particulars === 'Total Cost'),0,{Particulars:"  "}) //push empty object for line break      
    this.costToDuplicateDataSource.splice(this.costToDuplicateDataSource.findIndex((item:any) => item.Particulars === 'Total Cost of Duplicate Value'),0,{Particulars:"  "}) //push empty object for line break
  }

  formatNegativeAndPositiveValues(value:any){
    if(value && `${value}`.includes('-')){
      let formattedNumber = value.toLocaleString(undefined, {
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `(${`${formattedNumber}`.replace(/-/g,'')})`;
    }
    else if(value){
      return value.toLocaleString(undefined, {
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    return  null;
  }
  contentIsBig(data:any){
    if(data && Object.keys(data[0]).length > 6){
      return true;
    }
    return false;
  }

  addDivider(element:string){
    if(element === 'Assets')
      return true;
    return false;
  }

}
