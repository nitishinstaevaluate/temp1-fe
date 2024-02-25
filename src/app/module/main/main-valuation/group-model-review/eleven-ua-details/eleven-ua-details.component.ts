import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-eleven-ua-details',
  templateUrl: './eleven-ua-details.component.html',
  styleUrls: ['./eleven-ua-details.component.scss']
})
export class ElevenUaDetailsComponent {

  @Input() transferStepperTwo :any;
  @Input() currentStepIndex :any;
  @Input() fourthStageInput :any;
  @Output() ruleElevenData :any = new EventEmitter();
  @Output() ruleElevenSheetData=new EventEmitter<any>();

  displayColumns:any;
  ruleElevenUaDataSource:any;
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

  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar,
    private excelAndReportService:ExcelAndReportService,
    private processStateManagerService:ProcessStatusManagerService){

  }
  ngOnChanges(){
    this.fetchExcelData();
  }
  ngOnInit(): void {

    // this.checkProcessState()
  }
  // checkProcessState(){
  //   if(this.fourthStageInput){
  //     const excelSheetId = this.fourthStageInput?.formFourData?.isExcelModified ?this.fourthStageInput?.formFourData.modifiedExcelSheetId :  this.fourthStageInput.formOneData.excelSheetId;
  //     this.excelSheetId = excelSheetId;
  //     this.fetchExcelData(excelSheetId)
  //   }
  // }
  isRelativeValuation(modelName:string){
    if(!this.transferStepperTwo){
      return (isSelected(modelName,this.fourthStageInput?.formOneData.model) && this.fourthStageInput?.formOneData.model.length <= 1)
    }
    return (isSelected(modelName,this.transferStepperTwo?.model) && this.transferStepperTwo.model.length <= 1)
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
    this.valuationService.getProfitLossSheet(this.excelSheetId,'Rule 11 UA').subscribe((response:any)=>{
      this.loadExcelTable = false;
      if(response.status){
        this.excelErrorMsg = false;
        this.createruleElevenUaDataSource(response)
        this.ruleElevenSheetData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
      }
      else{
        this.excelErrorMsg = true;
      }
    }
    ,(error)=>{
      this.excelErrorMsg = true;
     this.loadExcelTable = false;
     this.ruleElevenSheetData.emit({status:true, error:error})
       this.ruleElevenData.emit({status:false,error:error});
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
        particulars:originalValue.Particulars
      }
      this.editedValues.push(cellStructure);
      
      const payload = {
        excelSheet:'Rule 11 UA',
        excelSheetId:this.excelSheetId,
        ...this.editedValues[0] 
      }
      if(payload.newValue !== null && payload.newValue !== undefined){
        this.excelAndReportService.modifyExcel(payload).subscribe(
          async (response:any)=>{
          if(response?.status){
            this.isExcelModified = true;
            const excelResponse: any = await this.processStateManagerService.updateEditedExcelStatus(localStorage.getItem('processStateId')).toPromise();
            this.createruleElevenUaDataSource(response);
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

  createruleElevenUaDataSource(response:any){
    this.dataSource = response?.data;
    this.displayColumns = Object.keys(this.dataSource[0]);
    
    this.displayColumns.splice(this.displayColumns.indexOf('lineEntry'),1,'Particulars')
    if(this.isRelativeValuation('Relative_Valuation') || this.isRelativeValuation('NAV') || this.isRelativeValuation('CTM')){
      this.displayColumns = this.displayColumns.splice(0,2)
    }
    this.ruleElevenUaDataSource = this.dataSource.map((result:any)=>{
      const transformedItem: any = {};
      transformedItem['Particulars'] = result.lineEntry.particulars;
      for (let i = 1; i < this.displayColumns.length; i++) {
        const yearKey = this.displayColumns[i];
        transformedItem[yearKey] = result[yearKey];
      }
      return transformedItem;
    });
    this.ruleElevenUaDataSource.splice(this.ruleElevenUaDataSource.findIndex((item:any) => item.Particulars.includes('Current Assets')),0,{Particulars:"  "}) //push empty object for line break      
    this.ruleElevenUaDataSource.splice(this.ruleElevenUaDataSource.findIndex((item:any) => item.Particulars === 'Current Liabilities'),0,{Particulars:"  "}) //push empty object for line break      
    this.ruleElevenUaDataSource.splice(this.ruleElevenUaDataSource.findIndex((item:any) => item.Particulars.includes('Equity & Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
    this.ruleElevenUaDataSource.splice(this.ruleElevenUaDataSource.findIndex((item:any) => item.Particulars.includes('Non-Current Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
    // this.ruleElevenUaDataSource.splice(this.ruleElevenUaDataSource.findIndex((item:any) => item.Particulars.includes('Total Equity & Liabilities')),0,{Particulars:"  "}) //push empty object for line break      

    // if(response?.modifiedFileName){
    //   this.ruleElevenSheetData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
    // }
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
    if(element === 'Total Assets' || element === 'Assets' || element === 'Total Equity & Liabilities')
      return true;
    return false;
  }
}
