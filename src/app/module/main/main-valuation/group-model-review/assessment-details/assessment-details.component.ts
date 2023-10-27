import { Component, Input, OnInit } from '@angular/core';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.scss']
})
export class AssessmentDetailsComponent implements OnInit {
  constructor(private valuationService:ValuationService){}

  @Input() transferStepperTwo:any;
  displayColumns:any;
  assessmentDataSource:any;
  floatLabelType:any='never';
  appearance:any='fill';
  dataSource:any;

  ngOnInit(): void {
    this.fetchExcelData();
  }

  fetchExcelData(){
    this.valuationService.getProfitLossSheet(this.transferStepperTwo?.excelSheetId,'assessmentSheet').subscribe((response:any)=>{
      this.displayColumns = Object.keys(response[0]);
      this.dataSource = response;
      this.displayColumns.splice(this.displayColumns.indexOf('lineEntry'),1,'Particulars')
      this.assessmentDataSource = response.map((result:any)=>{
        const transformedItem: any = {};
        transformedItem['Particulars'] = result.lineEntry.particulars;
        for (let i = 1; i < this.displayColumns.length; i++) {
          const yearKey = this.displayColumns[i];
          transformedItem[yearKey] = result[yearKey];
        }
        return transformedItem;
      });
      this.assessmentDataSource.splice(this.assessmentDataSource.findIndex((item:any) => item.Particulars.includes('Operating Liabilities')),0,{Particulars:"  "}) //push empty object for line break      
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
    return (Object.values(value).some(value => typeof value === 'number' && !isNaN(value)) && value.Particulars !== 'Other Operating Assets' && value.Particulars !== 'Other Operating Liabilities');
  }

  convertIntoNumber(value:any){
    return parseFloat(value)?.toFixed(2);
  }
  onInputChange(value: any, column: string,originalValue:any) {
    // const spanContent = (value as HTMLInputElement).closest('mat-row').querySelector('span').textContent;
  
    // const inputElement = value;
    // const closestRow = inputElement.closest('mat-row');
    
    // if (closestRow) {
    //   const spanElement = closestRow.querySelector('span');
    //   const spanContent = spanElement ? spanElement.textContent : null;
    //   if(value?.value !== originalValue || (originalValue === null && value.value === '')){
    //     if(this.editedValues.some((item:any)=>item.subHeader == spanContent && item.columnName === column)){
    //       this.editedValues.map((val:any)=>{
    //         if(val.subHeader == spanContent && val.columnName === column){
    //           val.newValue = value.value;
    //         }
    //       })
    //     }
    //     else{
    //       let payload={
    //         subHeader:spanContent,
    //         originalValue,
    //         newValue:value.value,
    //         columnName:column
    //       }
    //       this.editedValues.push(payload)
    //     }
    //   }
    // }
    // this.excelData.emit({ excelSheet:'P&L',editedValues: this.editedValues });
  }
}
