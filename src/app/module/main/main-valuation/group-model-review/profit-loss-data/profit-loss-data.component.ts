import { Component,EventEmitter,Input,OnChanges,OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ADD_SPACE_BEFORE_LINE_ITEM_PL, MODELS } from 'src/app/shared/enums/constant';
import { formatPositiveAndNegativeValues, isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-profit-loss-data',
  templateUrl: './profit-loss-data.component.html',
  styleUrls: ['./profit-loss-data.component.scss']
})


export class ProfitLossDataComponent implements OnInit,OnChanges {
  @Input() transferStepperTwo :any;
  @Input() currentStepIndex :any;
  @Input() fourthStageInput :any;
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
  loadExcelTable = false;
  excelErrorMsg = false;
  plLoader = false;
  isUpdating = false;
  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar,
    private excelAndReportService:ExcelAndReportService,
    private processStateManagerService: ProcessStatusManagerService){

  }
  ngOnChanges(){
    this.fetchExcelData();
  }
  ngOnInit(): void {

    // this.checkProcessState()
  }
  // checkProcessState(){
  //   if(this.fourthStageInput){
  //     // const excelSheetId = this.fourthStageInput?.formFourData?.isExcelModified ?this.fourthStageInput?.formFourData.modifiedExcelSheetId :  this.fourthStageInput.formOneData.excelSheetId;
  //     // this.excelSheetId = excelSheetId;
  //     this.fetchExcelData()
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
    // this.plLoader = true;
    this.valuationService.getProfitLossSheet(this.excelSheetId,'P&L', localStorage.getItem('processStateId')).subscribe((response:any)=>{
      this.loadExcelTable = false;
      if(response.status){
        this.excelErrorMsg = false;
       this.createprofitAndLossDataSource(response)
       this.profitLossData.emit({status:true,result:response,isExcelModified:this.isExcelModified});

      //  Calling assessment api so that when new excel is generated in backend it also has assessment sheet
      //  this.valuationService.getProfitLossSheet(this.excelSheetId, 'Assessment of Working Capital').subscribe((assessmentResponse)=>{
      //   //Do nothing for now
      //  })
      //  this.profitAndLossSheetData.emit({status:true, result:response})
     }
     else{
      this.excelErrorMsg = true;
    }
    // this.plLoader = false;
  }
  ,(error)=>{
      this.excelErrorMsg = true;
      this.loadExcelTable = false;
      // this.plLoader = false;
      // this.profitAndLossSheetData.emit({status:true, error:error})
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
        // if(data.lineEntry.particulars === value?.Particulars && data.lineEntry?.sysCode !== 3009 && data.lineEntry?.sysCode !== 3018){
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
  async onInputChange(value: any, column: string,originalValue:any) {
    this.plLoader = true;
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
        excelSheet:'P&L',
        excelSheetId:this.excelSheetId,
        ...this.editedValues[0] 
      }
      if(payload.newValue !== null && payload.newValue !== undefined){
        await this.queueModifyExcelRequest(payload);
        // this.excelAndReportService.modifyExcel(payload).subscribe(
        //   async (response:any)=>{
        //     this.plLoader = false;
        //   if(response.status){
        //     this.isExcelModified = true;
        //     this.createprofitAndLossDataSource(response);
        //     const excelResponse: any = await this.processStateManagerService.updateEditedExcelStatus(localStorage.getItem('processStateId')).toPromise();
        //     if(excelResponse?.modifiedExcelSheetId){
        //       this.excelSheetId = excelResponse.modifiedExcelSheetId;
        //     }
        //     // this.profitAndLossSheetData.emit({status:true,result:response,isExcelModified:this.isExcelModified});
        //   }
        //   else{
        //     //  this.profitAndLossSheetData.emit({status:false,error:response.error});
        //      this.snackBar.open(response.error,'Ok',{
        //       horizontalPosition: 'right',
        //       verticalPosition: 'top',
        //       duration: 3000,
        //       panelClass: 'app-notification-error'
        //     })
        //   }
        // },(error)=>{
        //   // this.profitAndLossSheetData.emit({status:false,error:error.message});
        //   this.plLoader = false;
        //   this.snackBar.open(error.message,'Ok',{
        //     horizontalPosition: 'right',
        //       verticalPosition: 'top',
        //       duration: 3000,
        //       panelClass: 'app-notification-error'
        //   })
        // })
      }
}

sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async queueModifyExcelRequest(payload: any) {
  while (this.isUpdating) {
    await this.sleep(100); // Wait for 100ms before checking again
  }
  this.isUpdating = true;
  try{
    const response: any = await this.excelAndReportService.modifyExcel(payload).toPromise();
    this.plLoader = false;
    if (response.status) {  
      this.isExcelModified = true;
      this.createprofitAndLossDataSource(response);
      const excelResponse: any = await this.processStateManagerService.updateEditedExcelStatus(localStorage.getItem('processStateId')).toPromise();
      if (excelResponse?.modifiedExcelSheetId) {
        this.excelSheetId = excelResponse.modifiedExcelSheetId;
      }
    }
    else {
      this.snackBar.open(response.error, 'Ok', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      });
    }
  }
  catch(error:any){
    this.snackBar.open(error.message, 'Ok', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'app-notification-error'
    });
  }
  finally {
    this.isUpdating = false;
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
    const srNoIndex = this.displayColumns.indexOf('Sr no.');
    
    // if(this.isRelativeValuation('Relative_Valuation') || this.isRelativeValuation('NAV') || this.isRelativeValuation('CTM')){
    //   // this.displayColumns = this.displayColumns.splice(0,3)
    //   const yearRegex = /\b\d{4}\b/;
    
    //   const dateRegex = /^([0-2]?\d|30|31)-(0?[1-9]|1[0-2])-\d{4}$/;
  
    //   this.displayColumns = this.displayColumns.filter((value:any) => {
    //       return !yearRegex.test(value) || dateRegex.test(value);
    //   });
  
    //   this.displayColumns.splice(3);
    // }
    if(
      (
        (
          this.fetchExistingModel().includes(MODELS.RELATIVE_VALUATION) || 
          this.fetchExistingModel().includes(MODELS.COMPARABLE_INDUSTRIES)
        ) && 
        this.fetchExistingModel().length === 1
    ) ||
    (
      this.fetchExistingModel().includes(MODELS.RELATIVE_VALUATION) &&
      this.fetchExistingModel().includes(MODELS.NAV)
    ) && 
    this.fetchExistingModel().length === 2
    ){
      this.displayColumns = this.displayColumns.splice(0,4)
    }
    if(this.singularModelCheck(MODELS.NAV)){
      this.createProfitLossSheetDisplayColumnsNavBased();
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
    if (srNoIndex !== -1) {
      const [srNo] = this.displayColumns.splice(srNoIndex, 1);
      this.displayColumns.unshift(srNo);
  }
  
    ADD_SPACE_BEFORE_LINE_ITEM_PL.forEach((particular) => {
      const index = this.profitAndLossDataSource.findIndex((item: any) => item.Particulars === particular);
      if (index !== -1) {
        this.profitAndLossDataSource.splice(index, 0, { Particulars: "  " });
      }
    });

    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars === 'Total Comprehensive Income for the period (XIII+XIV) (Comprising Profit (Loss) and Other Comprehensive Income for the period)'),0,{Particulars:"  "}) //push empty object for line break      
    // this.profitAndLossDataSource.splice(this.profitAndLossDataSource.findIndex((item:any) => item.Particulars.includes('Profit / (Loss) for the year')),0,{Particulars:"  "}) //push empty object for line break      
    if(response?.modifiedFileName){
      this.profitLossData.emit({status:true, isExcelModified:this.isExcelModified});
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

  isNavOrCcm(){
    const models = this.fetchExistingModel();
    return models.length === 2 && models.includes(MODELS.NAV) && models.includes(MODELS.RELATIVE_VALUATION);
  }

  fetchExistingModel(){
    return this.transferStepperTwo?.model || this.fourthStageInput?.formOneData?.model;
  }

  singularModelCheck(value:any){
    const models = this.fetchExistingModel();
    return models.length === 1 && models.includes(value);
  }

  createProfitLossSheetDisplayColumnsNavBased(){
    const yearRegex = /\b\d{4}\b/;
    const dateRegex = /^([0-2]?\d|30|31)-(0?[1-9]|1[0-2])-\d{4}$/;

    this.displayColumns = this.displayColumns.filter((value:any) => {
        return !yearRegex.test(value) || dateRegex.test(value);
    });

    this.displayColumns.splice(2);
  }
}