import { Component,EventEmitter,Input,OnChanges,OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  displayedColumns:any = [
    'Particulars',
    'Provisionals as on ,2022-23',
    '2023-24',
    '2024-25',
    '2025-26',
    '2026-27',
    '2027-28',
  ];
  constructor(private valuationService:ValuationService,
    private snackBar: MatSnackBar){

  }
  ngOnChanges(){
    if(this.transferStepperTwo?.excelSheetId){
      this.valuationService.getProfitLossSheet(this.transferStepperTwo?.excelSheetId ? this.transferStepperTwo.excelSheetId : 'Equity Value-31.03.2023_Full Year 0.2.xlsx','P&L').subscribe(
        (response)=>{
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
}