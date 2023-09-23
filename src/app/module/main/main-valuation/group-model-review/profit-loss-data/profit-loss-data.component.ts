import { Component,EventEmitter,Input,OnChanges,OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isSelected } from 'src/app/shared/enums/functions';
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

  data:any=[];
  displayedColumns:any=[]
  // displayedColumns:any = [
  //   'Particulars',
  //   'Provisionals as on ,2022-23',
  //   '2023-24',
  //   '2024-25',
  //   '2025-26',
  //   '2026-27',
  //   '2027-28',
  // ];
  // displayedRelativeColumns:any = [
  //   'Particulars',
  //   'Provisionals as on ,2022-23'
  // ];
  displayedRelativeColumns:any=[];
  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar){

  }
  ngOnChanges(){
    if(this.transferStepperTwo?.excelSheetId){
      this.valuationService.getProfitLossSheet(this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo.excelSheetId : 'Equity Value-31.03.2023_Full Year 0.2.xlsx','P&L').subscribe(
        (response:any)=>{
          this.displayedColumns= response[0];
         this.displayedColumns.map((val:any,index:any)=>{
          if(index <=1){
            this.displayedRelativeColumns.push(val);
          }
         })
          response.splice(0,1)
          if(this.isRelativeValuation('Relative_Valuation')){
            
            const firstKey = this.displayedColumns[0]
            const secondKey = this.displayedColumns[1]
          response = response.map((value:any)=>{
            return {
              [firstKey]:value[firstKey],
              [secondKey]:value[secondKey]
            }
          })
        }
          this.data = response
          this.profitLossData.emit({status:true,result:response});
        },
        (err)=>{
          this.profitLossData.emit({status:false,error:err})
        })
      }
      else{
      this.profitLossData.emit({status:false})
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
}