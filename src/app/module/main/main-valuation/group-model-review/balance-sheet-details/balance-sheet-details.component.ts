import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-balance-sheet-details',
  templateUrl: './balance-sheet-details.component.html',
  styleUrls: ['./balance-sheet-details.component.scss']
})
export class BalanceSheetDetailsComponent implements OnChanges {
  @Input() transferStepperTwo :any; 
  @Input() thirdStageInput :any; 
  @Output() balanceSheetData=new EventEmitter<any>();


  displayColumns:any;
  balanceSheetDataSource:any;
  floatLabelType:any='never';
  appearance:any='fill';
  dataSource:any;
  editedValues:any=[];
  isExcelModified=false;
  modifiedExcelSheetId:string='';
  excelSheetId:string='';

  constructor(private valuationService:ValuationService,
    private snackBar:MatSnackBar,
    private calculationService:CalculationsService ){}

  ngOnChanges(){
  //  this.fetchExcelData();
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

  // fetchExcelData(){
  //   if(this.transferStepperTwo?.excelSheetId){
  //     this.valuationService.getProfitLossSheet(this.transferStepperTwo.excelSheetId,'BS').subscribe(
  //       (response:any)=>{
  //         this.displayedColumns= response[0];
  //         this.displayedColumns.map((val:any,index:any)=>{
  //         if(index <=1){
  //           this.displayedRelativeColumns.push(val);
  //         }
  //        })
  //         response.splice(0,1);

  //         if(this.isRelativeValuation('Relative_Valuation')){
  //           const firstKey = this.displayedColumns[0];
  //           const secondKey = this.displayedColumns[1];
  //         response = response.map((value:any)=>{
  //           return {
  //             [firstKey]:value[firstKey],
  //             [secondKey]:value[secondKey]
  //           }
  //         })
  //       }
  //         this.data = response;
  //         this.balanceSheetData.emit({status:true,result:response});

  //     },
  //       (err)=>{
  //         this.balanceSheetData.emit({status:false,error:err})
  //       })
  //   }
  //   else{
  //     this.balanceSheetData.emit({status:false})
  //     this.snackBar.open('Data Retrieval Failed','Ok',{
  //       horizontalPosition: 'center',
  //       verticalPosition: 'bottom',
  //       duration: 4000,
  //       panelClass: 'app-notification-error'
  //     })
  //   }
  // }
  // checkType(ele:any){
  //   if(typeof ele === 'string' && isNaN(parseFloat(ele)))
  //    return true;
  //   return false
  // }

  // isNumberOrEmpty(value: any): boolean {
  //   return (typeof value === 'number' || value === '' || typeof value === 'string' || value === null || value === undefined) && !isNaN(value) ? true : false;
  // }

  // onInputChange(value: any, column: string,originalValue:any) {
  //   // const spanContent = (value as HTMLInputElement).closest('mat-row').querySelector('span').textContent;
  
  //   const inputElement = value;
  //   const closestRow = inputElement.closest('mat-row');
    
  //   if (closestRow) {
  //     const spanElement = closestRow.querySelector('span');
  //     const spanContent = spanElement ? spanElement.textContent : null;
  //     if(value?.value !== originalValue || (originalValue === null && value.value === '')){
  //       if(this.editedValues.some((item:any)=>item.subHeader == spanContent && item.columnName === column)){
  //         this.editedValues.map((val:any)=>{
  //           if(val.subHeader == spanContent && val.columnName === column){
  //             val.newValue = value.value;
  //           }
  //         })
  //       }
  //       else{
  //         let payload={
  //           subHeader:spanContent,
  //           originalValue,
  //           newValue:value.value,
  //           columnName:column
  //         }
  //         this.editedValues.push(payload)
  //       }
  //     }
  //   }
  //   // this.excelData.emit({ excelSheet:'P&L',editedValues: this.editedValues });
  // }

  // updateExcel(){
  //   const payload = {
  //     excelSheet:'BS',
  //     excelSheetId:`${this.transferStepperTwo.excelSheetId}`,
  //     editedValues: this.editedValues 
  //   }
  //   this.calculationService.modifyExcel(payload).subscribe((response:any)=>{
  //     if(response.status){
  //       this.isExcelModified = true;
  //       this.snackBar.open('Successfully updated excel','Ok',{
  //         horizontalPosition: 'right',
  //         verticalPosition: 'top',
  //         duration: 3000,
  //         panelClass: 'app-notification-success'
  //       })
  //     }
  //   })
  // }

  // convertIntoNumber(value:any){
  //   return parseFloat(value)?.toFixed(2);
  // }

  fetchExcelData(alreadyProcessedSheetId?:any){
    const balanceSheetExcelId = alreadyProcessedSheetId ? alreadyProcessedSheetId : localStorage.getItem('excelStat') === 'true' ? `edited-${this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo?.excelSheetId : this.thirdStageInput.formOneData.excelSheetId}` :  (this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo?.excelSheetId : this.thirdStageInput.formOneData.excelSheetId)
    this.excelSheetId = balanceSheetExcelId;
    this.valuationService.getProfitLossSheet(balanceSheetExcelId,'BS').subscribe((response:any)=>{
     if(response.status){
      this.createbalanceSheetDataSource(response);
      this.balanceSheetData.emit({status:true, result:response})
     }
    },
    (error)=>{
      this.balanceSheetData.emit({status:false, error:error})
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
    if(value?.Particulars){
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
    // return (Object.values(value).some(value => typeof value === 'number' && !isNaN(value)) && value.Particulars !== 'Other Operating Assets' && value.Particulars !== 'Other Operating Liabilities');
    if(value?.Particulars){
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
      if(value?.Particulars){
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
        excelSheet:'BS',
        excelSheetId:excelId,
        ...this.editedValues[0] 
      }

      if(payload.newValue !== null && payload.newValue !== undefined){
        this.calculationService.modifyExcel(payload).subscribe(
          (response:any)=>{
          if(response.status){
            this.isExcelModified = true;
            this.createbalanceSheetDataSource(response);
            this.balanceSheetData.emit({status:true,result:response});
          }
          else{
            this.balanceSheetData.emit({status:false,error:response.error});
              this.snackBar.open(response.error,'Ok',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
            })
          }
        },(error)=>{
          this.balanceSheetData.emit({status:false,error:error.message});
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
          // console.log(column,"changedColumn",changedColumn,"column reference",data.Particulars,"from changed values",row.lineEntry.particulars)
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

  createbalanceSheetDataSource(response:any){
    this.dataSource = response?.data;
    this.displayColumns = Object.keys(this.dataSource[0]);
    
    this.displayColumns.splice(this.displayColumns.indexOf('lineEntry'),1,'Particulars')
    if(this.isRelativeValuation('Relative_Valuation') || this.isRelativeValuation('NAV') || this.isRelativeValuation('CTM')){
      this.displayColumns = this.displayColumns.splice(0,2)
    }
    this.balanceSheetDataSource = this.dataSource.map((result:any)=>{
      const transformedItem: any = {};
      transformedItem['Particulars'] = result.lineEntry.particulars;
      for (let i = 1; i < this.displayColumns.length; i++) {
        const yearKey = this.displayColumns[i];
        transformedItem[yearKey] = result[yearKey];
      }
      return transformedItem;
    });
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes(`Shareholders' Funds`)),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Share Warrants')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Non Current Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Current Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('ASSETS')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Non-Current Assets')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Current Assets, Loans & Advances')),0,{Particulars:"  "}) //push empty object for line break      
         
    if(response?.modifiedFileName){
      this.modifiedExcelSheetId=response.modifiedFileName;
      // this.balanceSheetData.emit({modifiedExcelSheetId:this.modifiedExcelSheetId,isModified:true});
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
    return  null
  }

  contentIsBig(data:any){
    if(data && Object.keys(data[0]).length > 6){
      return true;
    }
    return false;
  }
}
