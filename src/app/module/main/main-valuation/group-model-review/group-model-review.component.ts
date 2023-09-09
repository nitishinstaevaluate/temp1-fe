import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValuationService } from 'src/app/shared/service/valuation.service';
@Component({
  selector: 'app-group-model-review',
  templateUrl: './group-model-review.component.html',
  styleUrls: ['./group-model-review.component.scss']
})
export class GroupModelReviewComponent implements OnChanges {
  @Output() saveAndNextEvent = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<any>();
  @Output() groupReviewControls = new EventEmitter<any>();

  @Input() transferStepperTwo :any;
  @Input() currentStepIndex :any;

  profitLoss:any;
  balanceSheet:any;
  isLoadingBalanceSheet=true;
  isLoadingProfitLoss=true;
  betaValue:any ;
  taxRateValue:any;
  debtValue:any
  constructor(private valuationService:ValuationService){

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.transferStepperTwo){
      this.betaValue=this.transferStepperTwo?.beta ? parseFloat(this.transferStepperTwo?.beta).toFixed(2) : 0;
      this.debtValue=this.transferStepperTwo?.costOfDebt ? parseFloat(this.transferStepperTwo?.costOfDebt).toFixed(2): 0;
      this.taxRateValue= this.transferStepperTwo?.taxRate ? parseFloat(this.transferStepperTwo?.taxRate).toFixed(2) : 0;
    }
  }
  saveAndNext(): void {
    this.groupReviewControls.emit({PL:this.profitLoss,BL:this.balanceSheet})
    console.log(this.transferStepperTwo,"input payload")
    this.valuationService.submitForm(this.transferStepperTwo).subscribe((response)=>{
      console.log(response,"output payload")
    })
  }
  previous(){
    this.previousPage.emit(true)
  }
  profitLossData(data:any){
    if(data){
      this.profitLoss = data.result;
      this.isLoadingProfitLoss=false;
    }
  }
  balanceSheetData(data:any){
    if(data){
      this.isLoadingBalanceSheet=false;
      this.balanceSheet = data.result;
    }
  }
}
