import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.scss']
})
export class AssessmentDetailsComponent implements OnInit,OnChanges {
  constructor(private valuationService:ValuationService,
    private calculationService:CalculationsService,
    private snackbar:MatSnackBar){}

  @Input() transferStepperTwo:any;
  @Input() thirdStageInput:any;
  @Output() assessmentSheetData=new EventEmitter<any>();

  displayColumns:any;
  assessmentDataSource:any;
  floatLabelType:any='never';
  appearance:any='fill';
  dataSource:any;
  editedValues:any=[];
  isExcelModified=false;
  modifiedExcelSheetId:string='';
  excelSheetId:any='';

  ngOnInit(): void {
    // this.checkProcessState()

  }
  ngOnChanges(): void {
    // this.fetchExcelData();
    if(this.thirdStageInput?.formThreeData?.isExcelModified){
      this.excelSheetId = this.thirdStageInput?.formThreeData.modifiedExcelSheetId;
      this.fetchExcelData(this.excelSheetId);
    }
    else {
      this.excelSheetId = this.transferStepperTwo?.excelSheetId;
      this.fetchExcelData();
    }
  }

  checkProcessState(){
    if(this.thirdStageInput){
      const excelSheetId = this.thirdStageInput?.formThreeData?.isExcelModified ?this.thirdStageInput?.formThreeData.modifiedExcelSheetId :  this.thirdStageInput.formOneData.excelSheetId;
      this.excelSheetId = excelSheetId;
      this.fetchExcelData(excelSheetId)
    }
  }
  fetchExcelData(alreadyProcessedSheetId?:any){
    const assessmentExcelId = alreadyProcessedSheetId ? alreadyProcessedSheetId : localStorage.getItem('excelStat') === 'true' ? `edited-${this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo?.excelSheetId : this.thirdStageInput.formOneData.excelSheetId}` :  (this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo?.excelSheetId : this.thirdStageInput.formOneData.excelSheetId);
    this.excelSheetId = assessmentExcelId;
    this.valuationService.getProfitLossSheet(assessmentExcelId,'Assessment of Working Capital').subscribe((response:any)=>{
     if(response.status){
      this.createAssessmentDataSource(response);
      this.assessmentSheetData.emit({status:true,result:response})
     }
    },
    (error)=>{
      this.assessmentSheetData.emit({status:false,error:error});
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

        const cellData = this.getCellAddress(originalValue,column);

          const cellStructure={
            cellData,
            oldValue:originalValue[`${column}`],
            newValue:value?.value.includes(',') ? +(value.value.replace(/,/g, '')) : +(value.value),
            particulars:originalValue.Particulars
          }
          this.editedValues.push(cellStructure);

          const excelSheetId = this.thirdStageInput?.formThreeData?.isExcelModified ?this.thirdStageInput?.formThreeData.modifiedExcelSheetId :  this.thirdStageInput?.formOneData.excelSheetId;

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
            excelSheet:'Assessment of Working Capital',
            excelSheetId: excelId,
            ...this.editedValues[0] 
          }

          this.calculationService.modifyExcel(payload).subscribe(
            (response:any)=>{
            if(response.status){
              this.isExcelModified = true;
              this.createAssessmentDataSource(response);
              this.assessmentSheetData.emit({status:true,result:response})
            }
            else{
              this.assessmentSheetData.emit({status:false,error:response.error})
               this.snackbar.open(response.error,'Ok',{
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'app-notification-error'
              })
            }
          },(error)=>{
            this.assessmentSheetData.emit({status:false,error:error.message})
            this.snackbar.open(error.message,'Ok',{
              horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'app-notification-error'
            })
          })
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

  createAssessmentDataSource(response:any){
    this.dataSource = response?.data;
    this.displayColumns = Object.keys(this.dataSource[0]);
    this.displayColumns.splice(this.displayColumns.indexOf('lineEntry'),1,'Particulars')
    this.assessmentDataSource = this.dataSource.map((result:any)=>{
      const transformedItem: any = {};
      transformedItem['Particulars'] = result.lineEntry.particulars;
      for (let i = 1; i < this.displayColumns.length; i++) {
        const yearKey = this.displayColumns[i];
        transformedItem[yearKey] = result[yearKey];
      }
      return transformedItem;
    });
    this.assessmentDataSource.splice(this.assessmentDataSource.findIndex((item:any) => item.Particulars.includes('Operating Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
    this.assessmentDataSource.splice(this.assessmentDataSource.findIndex((item:any) => item.Particulars.includes('Net Operating Assets')),0,{Particulars:"  "}) //push empty object for line break      
    if(response?.modifiedFileName){
      this.modifiedExcelSheetId=response.modifiedFileName;
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
