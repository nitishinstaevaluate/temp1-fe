import { Component,EventEmitter,Input,OnChanges,OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MODELS } from 'src/app/shared/enums/constant';
import { isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-profit-loss-data',
  templateUrl: './profit-loss-data.component.html',
  styleUrls: ['./profit-loss-data.component.scss']
})


export class ProfitLossDataComponent implements OnInit,OnChanges {
  @Input() transferStepperTwo :any;
  @Input() currentStepIndex :any;
  @Input() thirdStageInput :any;
  @Output() profitLossData :any = new EventEmitter();
  @Output() profitAndLossSheetData=new EventEmitter<any>();

  displayColumns:any;
  profitAndLossDataSource:any;
  floatLabelType:any='never';
  appearance:any='fill';
  dataSource:any;
  editedValues:any=[];
  isExcelModified=false;
  modifiedExcelSheetId:string='';
  excelSheetId:any='';
  financialSheetLoader = true;

  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar,
    private calculationService:CalculationsService){

  }
  ngOnChanges(){
    // this.fetchExcelData();
    if(this.thirdStageInput?.formThreeData?.isExcelModified){
      this.excelSheetId = this.thirdStageInput?.formThreeData.modifiedExcelSheetId;
      this.fetchExcelData(this.excelSheetId);
    }
    else{
      this.excelSheetId = this.transferStepperTwo?.excelSheetId;
      this.fetchExcelData();
    }
  }
  ngOnInit(): void {

    // this.checkProcessState()
  }
  checkProcessState(){
    if(this.thirdStageInput){
      const excelSheetId = this.thirdStageInput?.formThreeData?.isExcelModified ?this.thirdStageInput?.formThreeData.modifiedExcelSheetId :  this.thirdStageInput.formOneData.excelSheetId;
      this.excelSheetId = excelSheetId;
      this.fetchExcelData(excelSheetId)
    }
  }
  isRelativeValuation(modelName:string){
    if(!this.transferStepperTwo){
      return (isSelected(modelName,this.thirdStageInput?.formOneData.model) && this.thirdStageInput?.formOneData.model.length <= 1)
    }
    return (isSelected(modelName,this.transferStepperTwo?.model) && this.transferStepperTwo.model.length <= 1)
  }

  fetchExcelData(alreadyProcessedSheetId?:any){
    const pAndLExcelId = alreadyProcessedSheetId ? alreadyProcessedSheetId : localStorage.getItem('excelStat') === 'true' ? `edited-${this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo?.excelSheetId : this.thirdStageInput.formOneData.excelSheetId}` :  (this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo?.excelSheetId : this.thirdStageInput.formOneData.excelSheetId);
    this.excelSheetId = pAndLExcelId;
    this.valuationService.getProfitLossSheet(pAndLExcelId,'P&L').subscribe((response:any)=>{
     if(response.status){
      this.createprofitAndLossDataSource(response)
      this.profitLossData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
      this.profitAndLossSheetData.emit({status:true, result:response})
    }
  }
  ,(error)=>{
    this.profitAndLossSheetData.emit({status:true, error:error})
      this.profitLossData.emit({status:false,error:error});
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

      let excelId;
      if(this.thirdStageInput){
        if(localStorage.getItem('excelStat')==='true'){
          excelId = `edited-${this.thirdStageInput?.formOneData?.excelSheetId}`
        }
        else if(this.thirdStageInput?.formThreeData?.isExcelModified){
          excelId = this.thirdStageInput?.formThreeData.modifiedExcelSheetId
        }
        else {
          excelId = this.thirdStageInput.formOneData?.excelSheetId 
        }
      } 
      else{
        if(localStorage.getItem('excelStat')==='true'){
          excelId = `edited-${this.transferStepperTwo?.excelSheetId}`
        }
        else {
          excelId = this.transferStepperTwo?.excelSheetId
        }
      }
      
      const payload = {
        excelSheet:'P&L',
        excelSheetId:excelId,
        ...this.editedValues[0] 
      }
      if(payload.newValue !== null && payload.newValue !== undefined){
        this.calculationService.modifyExcel(payload).subscribe(
          (response:any)=>{
          if(response.status){
            this.isExcelModified = true;
            this.createprofitAndLossDataSource(response);
            this.profitAndLossSheetData.emit({status:true,result:response});
          }
          else{
             this.profitAndLossSheetData.emit({status:false,error:response.error});
             this.snackBar.open(response.error,'Ok',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
            })
          }
        },(error)=>{
          this.profitAndLossSheetData.emit({status:false,error:error.message});
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

  createprofitAndLossDataSource(response:any){
    this.dataSource = response?.data;
    this.displayColumns = Object.keys(this.dataSource[0]);
    
    this.displayColumns.splice(this.displayColumns.indexOf('lineEntry'),1,'Particulars')
    if(this.isRelativeValuation('Relative_Valuation') || this.isRelativeValuation('NAV') || this.isRelativeValuation('CTM')){
      this.displayColumns = this.displayColumns.splice(0,2)
    }
    this.profitAndLossDataSource = this.dataSource.map((result:any)=>{
      const transformedItem: any = {};
      transformedItem['Particulars'] = result.lineEntry.particulars;
      for (let i = 1; i < this.displayColumns.length; i++) {
        const yearKey = this.displayColumns[i];
        transformedItem[yearKey] = result[yearKey];
      }
      return transformedItem;
    });
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Income From Operation')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Revenue from Operations')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('EXPENSES')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Cost of Material Consumed')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Earnings before exceptional items, extraordinary items, interest, tax, depreciation and amortisation (EBITDA)')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Exceptional Items')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Profit / (Loss) from continuing operations')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('DISCONTINUING OPERATIONS')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Add / (Less): Tax expense of discontinuing operations')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Profit / (Loss) from discontinuing operations net of tax')),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Profit / (Loss) for the year')),0,{Particulars:"  "}) //push empty object for line break      
    if(response?.modifiedFileName){
      this.modifiedExcelSheetId=response.modifiedFileName;
      // this.profitAndLossSheetData.emit({modifiedExcelSheetId:this.modifiedExcelSheetId,isModified:true});
      localStorage.setItem('excelStat','true')
    }
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
}