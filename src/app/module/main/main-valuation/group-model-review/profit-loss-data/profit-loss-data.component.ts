import { Component,EventEmitter,Input,OnChanges,OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  @Output() profitLossData :any = new EventEmitter();
  @Output() profitAndLossSheetData=new EventEmitter<any>();


  // data:any=[];
  // displayedColumns:any=[]
  // displayedRelativeColumns:any=[];
  // floatLabelType:any='never';
  // appearance:any='fill';
  // editedValues:any = [];
  // isExcelModified=false;




  displayColumns:any;
  profitAndLossDataSource:any;
  floatLabelType:any='never';
  appearance:any='fill';
  dataSource:any;
  editedValues:any=[];
  isExcelModified=false;
  modifiedExcelSheetId:string='';

  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar,private calculationService:CalculationsService){

  }
  ngOnChanges(){
    // this.fetchExcelData();
    this.fetchExcelData();
  }
  ngOnInit(): void {
  }
  isRelativeValuation(modelName:string){
    return (isSelected(modelName,this.transferStepperTwo?.model) && this.transferStepperTwo.model.length <= 1)
  }
  
  // fetchExcelData(){
  //   if(this.transferStepperTwo?.excelSheetId){
  //     this.valuationService.getProfitLossSheet(this.transferStepperTwo?.excelSheetId,'P&L').subscribe(
  //       (response:any)=>{
  //         this.displayedColumns= response[0];
  //        this.displayedColumns.map((val:any,index:any)=>{
  //         if(index <=1){
  //           this.displayedRelativeColumns.push(val);
  //         }
  //        })
  //         response.splice(0,1)
  //         if(this.isRelativeValuation('Relative_Valuation')){
            
  //           const firstKey = this.displayedColumns[0];
  //           const secondKey = this.displayedColumns[1];
  //           response = response.map((value:any)=>{
  //             return {
  //               [firstKey]:value[firstKey],
  //               [secondKey]:value[secondKey]
  //             }
  //           })
  //       }
  //         this.data = response
  //         this.profitLossData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
  //       },
  //       (err)=>{
  //         this.profitLossData.emit({status:false,error:err})
  //       })
  //     }
  //     else{
  //     this.profitLossData.emit({status:false})
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

  // convertIntoNumber(value:any){
  //   return parseFloat(value)?.toFixed(2);
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
  //     this.updateExcel();
  //   }
  //   // this.excelData.emit({ excelSheet:'P&L',editedValues: this.editedValues });
  // }
  
  // updateExcel(){
  //   const payload = {
  //     excelSheet:'P&L',
  //     excelSheetId:`${this.transferStepperTwo.excelSheetId}`,
  //     editedValues: this.editedValues 
  //   }
  //   this.calculationService.modifyExcel(payload).subscribe((response:any)=>{
  //     console.log(response)
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

  fetchExcelData(){
    this.valuationService.getProfitLossSheet(localStorage.getItem('excelStat') === 'true' ? `edited-${this.transferStepperTwo?.excelSheetId}` :  this.transferStepperTwo?.excelSheetId,'P&L').subscribe((response:any)=>{
     if(response.status){
      this.createprofitAndLossDataSource(response)
      this.profitLossData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
    }
  }
  ,(error)=>{
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
    // return (Object.values(value).some(value => typeof value === 'number' && !isNaN(value)) && value.Particulars !== 'Other Operating Assets' && value.Particulars !== 'Other Operating Liabilities');
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
        excelSheet:'P&L',
        excelSheetId:localStorage.getItem('excelStat')==='true' ? `edited-${this.transferStepperTwo.excelSheetId}` : this.transferStepperTwo.excelSheetId,
        ...this.editedValues[0] 
      }
      if(payload.newValue !== null && payload.newValue !== undefined){
        this.calculationService.modifyExcel(payload).subscribe(
          (response:any)=>{
          if(response.status){
            this.isExcelModified = true;
            this.createprofitAndLossDataSource(response);
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
      this.profitAndLossSheetData.emit({modifiedExcelSheetId:this.modifiedExcelSheetId,isModified:true});
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
}