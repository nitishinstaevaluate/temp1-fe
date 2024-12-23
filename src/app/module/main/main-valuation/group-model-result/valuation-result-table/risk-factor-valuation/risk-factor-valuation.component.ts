import { Component, OnInit } from '@angular/core';
import { COMPONENT_ENUM } from 'src/app/shared/enums/constant';
import { formatNumber } from 'src/app/shared/enums/functions';
import { ComponentInteractionService } from 'src/app/shared/service/component-interaction.service';

@Component({
  selector: 'app-risk-factor-valuation',
  templateUrl: './risk-factor-valuation.component.html',
  styleUrls: ['./risk-factor-valuation.component.scss']
})
export class RiskFactorValuationComponent implements OnInit {

  riskFactorValuation:any;
  formatNumber = formatNumber
  
  ngOnInit() {
    this.loadData();
  }
  constructor(private componentInteractionService: ComponentInteractionService){}

  loadData(){
    this.componentInteractionService.registerComponent(COMPONENT_ENUM.STARTUP_VALUATION.key).subscribe((response)=>{
      if(response?.riskFactorValuation) this.riskFactorValuation = response.riskFactorValuation;
    })
  }
}
