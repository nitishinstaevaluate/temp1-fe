import { Component, OnInit } from '@angular/core';
import { BERKUS_METHOD, COMPONENT_ENUM } from 'src/app/shared/enums/constant';
import { formatNumber } from 'src/app/shared/enums/functions';
import { ComponentInteractionService } from 'src/app/shared/service/component-interaction.service';

@Component({
  selector: 'app-berkus-valuation',
  templateUrl: './berkus-valuation.component.html',
  styleUrls: ['./berkus-valuation.component.scss']
})
export class BerkusValuationComponent implements OnInit{

  componentConfig = BERKUS_METHOD.componentConfig;
  bstep:any = 1;
  berkusValuation:any;
  formatNumber = formatNumber
  constructor(private componentInteractionService: ComponentInteractionService){}

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.componentInteractionService.registerComponent(COMPONENT_ENUM.BERKUS.key).subscribe((response)=>{
      if(response?.berkusValuation) this.berkusValuation = response.berkusValuation;
    })
  }

  loadCurrentTab(tabNum:any){
    this.bstep = tabNum
  }

  berkusStateArray(dbKey:any){
    return this.berkusValuation?.[dbKey];
  }
}
