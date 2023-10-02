import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isSelected } from 'src/app/shared/enums/functions';
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

  constructor(private valuationService:ValuationService,private snackBar:MatSnackBar){}

  ngOnChanges(){
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
  ngOnInit(): void {
  }
  isRelativeValuation(modelName:string){
    return (isSelected(modelName,this.transferStepperTwo?.model) && this.transferStepperTwo.model.length <= 1)
  }

  checkType(ele:any){
    if(typeof ele === 'string' && isNaN(parseFloat(ele)))
     return true;
    return false
  }

  isNumberOrEmpty(value: any): boolean {
    return (typeof value === 'number' || value === '' || typeof value === 'string' || value === null || value === undefined) && !isNaN(value) ? true : false;
  }
}
