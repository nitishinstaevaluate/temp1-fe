import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { INCOME_APPROACH, MARKET_APPROACH, NET_ASSET_APPROACH } from 'src/app/shared/enums/constant';
import { convertToNumberOrZero, formatNumber } from 'src/app/shared/enums/functions';
import { UtilService } from 'src/app/shared/service/util.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent {
  totalRecords:any=[];
  activeLink: string | null = null;
  constructor(private valuationService:ValuationService,
    private route:Router,
    private utilService:UtilService,
    private snackBar:MatSnackBar){this.fetchData()}

  fetchData(page:number=1,pageSize:number=10,query?:string): void { //inorder to increase the total count, increase the pageSize number 
    this.valuationService.getPaginatedValuations(page, pageSize,query)
      .subscribe((data:any) => {
        this.totalRecords = data.response;
    },
    (error)=>{
    });
  }

  getCompanyName(records:any){
    const companyName = records?.firstStageInput?.company
    if(companyName)
      return companyName;
    return '-'
  }

  getCompanyId(records:any){
    const companyId = records?.processIdentifierId;
    if(companyId)
      return companyId;
    return '-'
  }

  getCompanyStatus(records:any){
    if(records?.sixthStageInput){
      return 'Completed'
    }
    else if(records?.fifthStageInput){
      return 'Report Pending'
    }
    else if(records?.thirdStageInput.length === 0 && records.step === 1){
      return 'Draft'
    }
    else if(records?.fourthStageInput || records?.thirdStageInput){
      return 'Pending'
    }
    return 'Draft'
  }

  getStatus(records:any){
    if(records?.sixthStageInput){
      return 'stat-result'
    }
    else if(records?.fifthStageInput){
      return 'stat-report-pending'
    }
    else if(records?.thirdStageInput.length === 0 && records.step === 1){
      return 'stat-draft'
    }
    else if(records?.fourthStageInput || records?.thirdStageInput){
      return 'stat-pending'
    }
    return 'stat-draft'
  }

  valuationFinalValue(records:any){
    if(!records?.fourthStageInput)
      return '';
    const valuationResult = records.fourthStageInput?.appData?.valuationResult;
    const fifthStageDetails = records.fifthStageInput;
    if(valuationResult?.length === 1){
      const resultValue = this.computeSingleValuationResult(valuationResult);
      return formatNumber(convertToNumberOrZero(resultValue));
    }
    if(valuationResult?.length > 1){
      const resultValue = this.computeMultipleValuationResult(fifthStageDetails);
      return formatNumber(convertToNumberOrZero(resultValue));
    }
    return ''
  }

  computeSingleValuationResult(valuationResult:any){ 
    if(!valuationResult)
      return '-'
    if(INCOME_APPROACH.includes(valuationResult[0]?.model)){
      return valuationResult[0]?.valuation;
    }
    if(NET_ASSET_APPROACH.includes(valuationResult[0]?.model)){
      return valuationResult[0]?.valuation;
    }
    if(MARKET_APPROACH.includes(valuationResult[0]?.model)){
      return valuationResult[0]?.valuation?.finalPriceAvg;
    }
  }

  computeMultipleValuationResult(result:any){
    if(!result)
      return '-';
    const data = result?.totalWeightageModel?.weightedVal;
    return data;
  }

  valuationCurrencyUnit(records:any){
    const currencyUnit = records?.firstStageInput?.currencyUnit;
    if(currencyUnit)
      return currencyUnit;
    return '-';
  }

  valuationModels(records:any){
    return records?.firstStageInput?.model
  }

  loadDataCheckListForm(){
    this.utilService.generateUniqueLinkId().subscribe((response:any)=>{
      if(response.status){
        this.route.navigate(['dashboard/panel/data-checklist', response.uniqueLink]);
      }
      else{
        this.snackBar.open('Unique link generation failed', 'Ok',{
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 3000,
            panelClass: 'app-notification-error',
        })
      }
    },(error)=>{
      this.snackBar.open('Backend error - Unique link generation failed', 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
    })
    })
  }

  setActiveLink(linkId: string) {
    this.activeLink = linkId;
  }
}

