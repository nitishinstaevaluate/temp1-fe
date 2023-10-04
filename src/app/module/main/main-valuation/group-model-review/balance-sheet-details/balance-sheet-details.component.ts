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
  @Output() balanceSheetData: any= new EventEmitter(); 
  data:any=[];
  displayedColumns:any =[];
  displayedRelativeColumns:any = [];
  floatLabelType:any='never';
  appearance:any='fill';
  editedValues:any=[];
  isExcelModified=false;

  constructor(private valuationService:ValuationService,
    private snackBar:MatSnackBar,
    private calculationService:CalculationsService ){}

  ngOnChanges(){
   this.fetchExcelData();
  }
  ngOnInit(): void {
  }
  isRelativeValuation(modelName:string){
    return (isSelected(modelName,this.transferStepperTwo?.model) && this.transferStepperTwo.model.length <= 1)
  }

  fetchExcelData(){
    if(this.transferStepperTwo?.excelSheetId){
      this.valuationService.getProfitLossSheet(this.transferStepperTwo.excelSheetId,'BS').subscribe(
        (response:any)=>{
          this.displayedColumns= response[0];
          this.displayedColumns.map((val:any,index:any)=>{
          if(index <=1){
            this.displayedRelativeColumns.push(val);
          }
         })
          response.splice(0,1);

          if(this.isRelativeValuation('Relative_Valuation')){
            const firstKey = this.displayedColumns[0];
            const secondKey = this.displayedColumns[1];
          response = response.map((value:any)=>{
            return {
              [firstKey]:value[firstKey],
              [secondKey]:value[secondKey]
            }
          })
        }
          this.data = response;
          this.balanceSheetData.emit({status:true,result:response});

      },
        (err)=>{
          this.balanceSheetData.emit({status:false,error:err})
        })
    }
    else{
      this.balanceSheetData.emit({status:false})
      this.snackBar.open('Data Retrieval Failed','Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 4000,
        panelClass: 'app-notification-error'
      })
    }
  }
  checkType(ele:any){
    if(typeof ele === 'string' && isNaN(parseFloat(ele)))
     return true;
    return false
  }

  isNumberOrEmpty(value: any): boolean {
    return (typeof value === 'number' || value === '' || typeof value === 'string' || value === null || value === undefined) && !isNaN(value) ? true : false;
  }

  onInputChange(value: any, column: string,originalValue:any) {
    // const spanContent = (value as HTMLInputElement).closest('mat-row').querySelector('span').textContent;
  
    const inputElement = value;
    const closestRow = inputElement.closest('mat-row');
    
    if (closestRow) {
      const spanElement = closestRow.querySelector('span');
      const spanContent = spanElement ? spanElement.textContent : null;
      if(value?.value !== originalValue || (originalValue === null && value.value === '')){
        if(this.editedValues.some((item:any)=>item.subHeader == spanContent && item.columnName === column)){
          this.editedValues.map((val:any)=>{
            if(val.subHeader == spanContent && val.columnName === column){
              val.newValue = value.value;
            }
          })
        }
        else{
          let payload={
            subHeader:spanContent,
            originalValue,
            newValue:value.value,
            columnName:column
          }
          this.editedValues.push(payload)
        }
      }
    }
    // this.excelData.emit({ excelSheet:'P&L',editedValues: this.editedValues });
  }

  updateExcel(){
    const payload = {
      excelSheet:'BS',
      excelSheetId:`${this.transferStepperTwo.excelSheetId}`,
      editedValues: this.editedValues 
    }
    this.calculationService.modifyExcel(payload).subscribe((response:any)=>{
      console.log(response)
      if(response.status){
        this.isExcelModified = true;
      }
    })
  }
}
