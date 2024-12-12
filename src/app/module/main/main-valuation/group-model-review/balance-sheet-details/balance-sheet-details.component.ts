import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ADD_SPACE_BEFORE_LINE_ITEM_BS, MODELS } from 'src/app/shared/enums/constant';
import { formatPositiveAndNegativeValues, isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-balance-sheet-details',
  templateUrl: './balance-sheet-details.component.html',
  styleUrls: ['./balance-sheet-details.component.scss']
})
export class BalanceSheetDetailsComponent implements OnChanges {
  @Input() transferStepperTwo :any; 
  @Input() fourthStageInput :any; 
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
  excelErrorMsg = false;
  loadExcelTable = false;
  bsLoader = false;
  isUpdating: boolean = false;
  constructor(private valuationService:ValuationService,
    private snackBar:MatSnackBar,
    private excelAndReportService:ExcelAndReportService,
    private processStateManagerService:ProcessStatusManagerService ){}

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
    // this.bsLoader = true;
    this.valuationService.getProfitLossSheet(this.excelSheetId,'BS', localStorage.getItem('processStateId')).subscribe((response:any)=>{
      this.loadExcelTable = false; 
      if(response.status){
        this.excelErrorMsg = false;
       this.createbalanceSheetDataSource(response);
      //  this.balanceSheetData.emit({status:true, result:response,isExcelModified:this.isExcelModified})
      
      //  Calling assessment api so that when new excel is generated in backend it also has assessment sheet
      // this.valuationService.getProfitLossSheet(this.excelSheetId, 'Assessment of Working Capital', localStorage.getItem('processStateId')).subscribe((assessmentResponse)=>{
      //   //Do nothing for now
      //  })
      }
      else{
        this.excelErrorMsg = true;
      }
      // this.bsLoader = false;
    },
    (error)=>{
      // this.bsLoader = false;
      this.loadExcelTable = false;
       this.excelErrorMsg = true;
      //  this.balanceSheetData.emit({status:false, error:error})
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

  checkIfEditable(value:any, columnIndex:any){
    if(value?.Particulars){
      // For Sys code - 8027
      if(value.Particulars === '(iii) cash and cash equivalents' && (columnIndex === 1 || columnIndex === 2)){
        return true;
      }

      // For Sys code - 8042
      if(value.Particulars === '(iv) Retained Earnings' && (columnIndex === 1 || columnIndex === 2)){
        return true;
      }

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
 async  onInputChange(value: any, column: string,originalValue:any) {
    this.bsLoader = true;
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
        model:this.fetchExistingModel(),
        processStateId:localStorage.getItem('processStateId')
      }
      this.editedValues.push(cellStructure);

      const payload = {
        excelSheet:'BS',
        excelSheetId:this.excelSheetId,
        ...this.editedValues[0] 
      }

      if(payload.newValue !== null && payload.newValue !== undefined){
        await this.queueModifyExcelRequest(payload);
        // this.excelAndReportService.modifyExcel(payload).subscribe(
        //   async (response:any)=>{
        //     this.bsLoader = false;
        //   if(response.status){
        //     this.isExcelModified = true;
        //     this.createbalanceSheetDataSource(response);
        //     const excelResponse: any = await this.processStateManagerService.updateEditedExcelStatus(localStorage.getItem('processStateId')).toPromise();
        //     if(excelResponse?.modifiedExcelSheetId){
        //       this.excelSheetId = excelResponse.modifiedExcelSheetId;
        //     }
        //     // this.balanceSheetData.emit({status:true,result:response});
        //   }
        //   else{
        //     // this.balanceSheetData.emit({status:false,error:response.error});
        //       this.snackBar.open(response.error,'Ok',{
        //       horizontalPosition: 'right',
        //       verticalPosition: 'top',
        //       duration: 3000,
        //       panelClass: 'app-notification-error'
        //     })
        //   }
        // },(error)=>{
        //   // this.balanceSheetData.emit({status:false,error:error.message});
        //   this.bsLoader = false;
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
  
    try {
      const response: any = await this.excelAndReportService.modifyExcel(payload).toPromise();
      this.bsLoader = false;
  
      if (response.status) {
        this.isExcelModified = true;
        this.createbalanceSheetDataSource(response);
        const excelResponse: any = await this.processStateManagerService.updateEditedExcelStatus(localStorage.getItem('processStateId')).toPromise();
        if (excelResponse?.modifiedExcelSheetId) {
          this.excelSheetId = excelResponse.modifiedExcelSheetId;
        }
      } else {
        this.snackBar.open(response.error, 'Ok', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        });
      }
    } catch (error:any) {
      this.snackBar.open(error.message, 'Ok', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      });
    } finally {
      this.isUpdating = false;
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
      
    }
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
      this.displayColumns = this.displayColumns.splice(0,3)
    }
    if(this.singularModelCheck(MODELS.NAV)){
      this.createBalanceSheetDisplayColumnsNavBased()
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

    ADD_SPACE_BEFORE_LINE_ITEM_BS.forEach((particular) => {
      const index = this.balanceSheetDataSource.findIndex((item: any) => item.Particulars === particular);
      if (index !== -1) {
        this.balanceSheetDataSource.splice(index, 0, { Particulars: "  " });
      }
    });

    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes(`Shareholders' Funds`)),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Share Warrants')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Non Current Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Current Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('ASSETS')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Non-Current Assets')),0,{Particulars:"  "}) //push empty object for line break      
    // this.balanceSheetDataSource.splice(this.balanceSheetDataSource.findIndex((item:any) => item.Particulars.includes('Current Assets, Loans & Advances')),0,{Particulars:"  "}) //push empty object for line break      
         
    // if(response?.modifiedFileName){
    //   this.balanceSheetData.emit({status:true,isExcelModified:this.isExcelModified});
    // }
  }

  formatNegativeAndPositiveValues(value:any){
    if(value && `${value}`.includes('-')){
      let formattedNumber = formatPositiveAndNegativeValues(value);
      return formattedNumber;
    }
    else if(value){
      return formatPositiveAndNegativeValues(value);
    }
    return  null
  }

  contentIsBig(data:any){
    if(data && Object.keys(data[0]).length > 6){
      return true;
    }
    return false;
  }

  isNavAndCcm(){
    const models = this.fetchExistingModel();
    return (models.length === 2 && models.includes(MODELS.NAV) && models.includes(MODELS.RELATIVE_VALUATION)) || (models.length === 1 && (models.includes(MODELS.NAV) || models.includes(MODELS.RELATIVE_VALUATION)));
  }

  fetchExistingModel(){
    return this.transferStepperTwo?.model || this.fourthStageInput?.formOneData?.model;
  }

  singularModelCheck(value:any){
    const models = this.fetchExistingModel();
    return models.length === 1 && models.includes(value);
  }
  isNav(value:any){
    const models = this.fetchExistingModel();
    return models.length === 1 && models.includes(value);
  }

  createBalanceSheetDisplayColumnsNavBased(){
    const yearRegex = /\b\d{4}\b/;
    const dateRegex = /^([0-2]?\d|30|31)-(0?[1-9]|1[0-2])-\d{4}$/;

    this.displayColumns = this.displayColumns.filter((value:any) => {
        return !yearRegex.test(value) || dateRegex.test(value);
    });

    this.displayColumns.splice(2);
  }
}
