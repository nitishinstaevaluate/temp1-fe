import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ADD_SPACE_BEFORE_LINE_ITEM_CASH_FLOW } from 'src/app/shared/enums/constant';
import { formatPositiveAndNegativeValues } from 'src/app/shared/enums/functions';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-cash-flow-details',
  templateUrl: './cash-flow-details.component.html',
  styleUrls: ['./cash-flow-details.component.scss']
})
export class CashFlowDetailsComponent implements OnChanges{
  @Input() transferStepperTwo :any;
  @Input() currentStepIndex :any;
  @Input() fourthStageInput :any;
  @Output() cashFlowData :any = new EventEmitter();
  @Output() cashFlowSheetData=new EventEmitter<any>();

  displayColumns:any;
  cashFlowDataSource:any;
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
  cfLoader = false;
  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar,
    private excelAndReportService:ExcelAndReportService,
    private processStateManagerService: ProcessStatusManagerService){
  }

  ngOnChanges(){
    this.fetchExcelData();
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
    // this.cfLoader = true;
    this.valuationService.getProfitLossSheet(this.excelSheetId,'Cash Flow', localStorage.getItem('processStateId')).subscribe((response:any)=>{
      this.loadExcelTable = false;
      if(response.status){
        this.excelErrorMsg = false;
       this.createCashFlowDataSource(response)
       this.cashFlowData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
     }
     else{
      this.excelErrorMsg = true;
    }
    // this.cfLoader = false;
  }
  ,(error)=>{
      // this.cfLoader = false;
      this.excelErrorMsg = true;
      this.loadExcelTable = false;
      // this.profitAndLossSheetData.emit({status:true, error:error})
      this.cashFlowData.emit({status:false,error:error});
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
        if(data.lineEntry.particulars === value?.Particulars){
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
    if(index === 1){
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
    if(index === 1){
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
    this.cfLoader = true;
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
        particulars:originalValue.Particulars
      }
      this.editedValues.push(cellStructure);
      
      const payload = {
        excelSheet:'Cash Flow',
        excelSheetId:this.excelSheetId,
        ...this.editedValues[0] 
      }
      if(payload.newValue !== null && payload.newValue !== undefined){
        this.excelAndReportService.modifyExcel(payload).subscribe(
          async (response:any)=>{
            this.cfLoader = false;
          if(response.status){
            this.isExcelModified = true;
            this.createCashFlowDataSource(response);
            const excelResponse: any = await this.processStateManagerService.updateEditedExcelStatus(localStorage.getItem('processStateId')).toPromise();
            if(excelResponse?.modifiedExcelSheetId){
              this.excelSheetId = excelResponse.modifiedExcelSheetId;
            }
          }
          else{
             this.snackBar.open(response.error,'Ok',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
            })
          }
        },(error)=>{
          this.cfLoader = false;
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

createCashFlowDataSource(response:any){
  this.dataSource = response?.data;
  this.displayColumns = Object.keys(this.dataSource[0]);
  this.displayColumns.splice(this.displayColumns.indexOf('lineEntry'),1,'Particulars')
  const srNoIndex = this.displayColumns.indexOf('Sr No');
  
  
  this.cashFlowDataSource = this.dataSource.map((result:any)=>{
    const transformedItem: any = {};
    transformedItem['Particulars'] = result.lineEntry.particulars;

    for (let i = 1; i < this.displayColumns.length; i++) {
      const yearKey = this.displayColumns[i];
      transformedItem[yearKey] = result[yearKey];
    }
    return transformedItem;
  });
  if (srNoIndex !== -1) {
    const [srNo] = this.displayColumns.splice(srNoIndex, 1);
    this.displayColumns.unshift(srNo);
}

ADD_SPACE_BEFORE_LINE_ITEM_CASH_FLOW.forEach((particular) => {
    const index = this.cashFlowDataSource.findIndex((item: any) => item.Particulars === particular);
    if (index !== -1) {
      this.cashFlowDataSource.splice(index, 0, { Particulars: "  " });
    }
  });

  if(response?.modifiedFileName){
    this.cashFlowData.emit({status:true, isExcelModified:this.isExcelModified});
  }
}

formatNegativeAndPositiveValues(value:any){
  if(value && `${value}`.includes('-')){
    let formattedNumber = formatPositiveAndNegativeValues(value);
    return formattedNumber;
  }
  else if(value){
    return formatPositiveAndNegativeValues(value);
  }
  return  null;
}
contentIsBig(data:any){
  if(data && Object.keys(data[0]).length > 6){
    return true;
  }
  return false;
}
}
