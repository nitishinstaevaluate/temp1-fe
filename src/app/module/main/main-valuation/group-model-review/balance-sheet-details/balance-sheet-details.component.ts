import { Component } from '@angular/core';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-balance-sheet-details',
  templateUrl: './balance-sheet-details.component.html',
  styleUrls: ['./balance-sheet-details.component.scss']
})
export class BalanceSheetDetailsComponent {
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
  constructor(private valuationService:ValuationService){

  }
  ngOnInit(): void {
   
    this.valuationService.getProfitLossSheet('Equity Value-31.03.2023_Full Year 0.2.xlsx','BS').subscribe(
      (response)=>{
        // console.log(response)
        this.data = response
    })
  }

}
