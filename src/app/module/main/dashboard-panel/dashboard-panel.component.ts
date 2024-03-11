import { Component, isDevMode } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CHECKLIST_TYPES, INCOME_APPROACH, MARKET_APPROACH, NET_ASSET_APPROACH, PAGINATION_VAL } from 'src/app/shared/enums/constant';
import { convertToNumberOrZero, formatNumber } from 'src/app/shared/enums/functions';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { EmailService } from 'src/app/shared/service/email.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { UtilService } from 'src/app/shared/service/util.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent {
  totalRecords:any=[];
  activeLink: string = 'opt-1';
  loader = false;
  emailData:any=[];
  pageSize: number = 10;
  length: number =0;
  pageSizeOptions = PAGINATION_VAL;
  constructor(private valuationService:ValuationService,
    private route:Router,
    private utilService:UtilService,
    private snackBar:MatSnackBar,
    private dialog: MatDialog,
    private emailService: EmailService,
    private processStatusManagerService: ProcessStatusManagerService){
      this.fetchData();
      this.fetchAllDatachecklistEmails();
    }

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

  loadDataCheckListForm() {
    const data = { value: 'dataCheckList' };
    const dialogRef = this.dialog.open(GenericModalBoxComponent, { data: { data }, width: '30%' });

    dialogRef.afterClosed().subscribe(result => {
        if (!result) return;
        result.sendEmail ? this.sendDataCheckListEmail(result.emailId) : this.generateAndNavigateUniqueLink();
    });
  }

  sendDataCheckListEmail(emailId: string) {
      this.loader = true;
      this.utilService.generateUniqueLinkId(this.constructChecklistPayload(emailId)).subscribe(
          (response: any) => {
            this.loader = false;
            response.status
              ? this.sendEmailWithUniqueLink(response.uniqueLink, emailId)
              : this.handleError('data check list email send failed, try again')
          },
          (error:any) => {
            this.loader = false;
            this.handleError('Backend error - data checklist email not send');
          }
      );
  }

  generateAndNavigateUniqueLink() {
      this.loader = true;

      this.utilService.generateUniqueLinkId(this.constructChecklistPayload()).subscribe(
          (response: any) => {
            this.loader = false;
            response.status
              ? this.route.navigate(['dashboard/panel/data-checklist', response.uniqueLink])
              : this.handleError('Unique link generation failed');
          },
          (error:any) => {
            this.loader = false;
            this.handleError('Backend error - Unique link generation failed');
          }
      );
  }

  constructChecklistPayload(emailId?:any){
    return {
        checkList: CHECKLIST_TYPES.dataCheckList,
        emailTo: emailId
    }
  }

  sendEmailWithUniqueLink(uniqueLink: string, emailId: string) {
    this.loader = true;
    const baseUrl = isDevMode() ? 'https://localhost:4200' : 'https://app.ifinworth.com';
    const checkListUrl = `${baseUrl}/dashboard/panel/data-checklist/${uniqueLink}`;
    this.emailService.dataCheckListEmail({ checkListUrl, emailId }).subscribe(
      (response:any) => {
            this.loader = false;
            this.snackBar.open('Email sent successfully', 'OK', { 
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 3000,
              panelClass: 'app-notification-success' 
            });
          },
          (error) => {
            this.loader = false;
            this.handleError('Backend error - Email sent failed');
          }
      );
  }

  handleError(message: string) {
      this.snackBar.open(message, 'OK', { 
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error'
      });
  }

  loadMandateForm(){
    const payload = {
      checkList: CHECKLIST_TYPES.mandateChecklist
    }
    this.utilService.generateUniqueLinkId(payload).subscribe((response:any)=>{
      if(response.status){
        this.route.navigate(['dashboard/panel/mandate', response.uniqueLink]);
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

  performAction(item: any) {
    console.log('Action performed on:', item);
  }

  fetchAllDatachecklistEmails(page:number=1,pageSize:number=10){
    this.utilService.fetchAllDataChecklistEmails(page, pageSize).subscribe((emailData:any)=>{
      if(emailData.response.length){
        this.emailData = emailData.response;
        this.length = emailData.pagination.totalElements;
      }
      else{
        this.snackBar.open('Email list not found', 'Ok',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
      })
      }
    },(error)=>{
      this.snackBar.open('Backend error - email list fetch failed', 'Ok',{
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
    })
    })
  }

  resendEmail(id:any,emailFrom:any){
    this.loader = true;
    this.utilService.resendDataChecklist(id).subscribe((response:any)=>{
      this.loader = false;
      if(response.status) {
        this.sendEmailWithUniqueLink(response.uniqueLinkId, emailFrom);
        this.fetchAllDatachecklistEmails()
      }
      else{
        this.handleError(`${response.error}`);
      }
    },(error)=>{
      this.loader = false;
      this.handleError(`backend error - resend datachecklist failed`);
    })
  }

  initiateValuation(linkId:any){
    this.utilService.fetchDataChecklistById(linkId).subscribe((datachecklistResponse:any)=>{
      if(datachecklistResponse.status){
        const data = datachecklistResponse.data;
        const payload = {
          firstStageInput:{
            taxRateType:data.taxRate === '25.17' ? '25.17' : 'Normal_Tax_Rate',
            taxRate:data.taxRate,
            valuationDate:data.valuationDate,
            excelSheetId:data.excelSheetId,
            outstandingShares:data.outstandingShares,
            isExcelModified:false,
            company:data.company,
            reportingUnit:data.reportingUnit
          },
          sixthStageInput:{
            cinNumber:data.cinNumber,
            companyAddress:data.companyAddress,
            companyInfo:data.companyInfo,
            dateOfAppointment:data.dateOfAppointment,
            dateOfIncorporation:data.dateOfIncorporation,
            reportDate:data.dateOfReport,
            natureOfInstrument:data.natureOfInstrument,
            reportPurpose:data.purposeOfReport,
            reportSection:data.section
          },
          step:0,
          uniqueLinkId:data.uniqueLinkId
        }

        this.processStateManager(payload, null)
      }
    })
  }

  processStateManager(process:any, processId:any){
    this.processStatusManagerService.instantiateProcess(process, processId).subscribe(
      (processStatusDetails: any) => {
        if (processStatusDetails.status) {
          localStorage.setItem('execProcess',`true`);
          localStorage.setItem('processStateId', processStatusDetails.processId);
          this.route.navigate(['/dashboard/valuation']);
        }
      },
      (error) => {
        this.snackBar.open(`${error.message}`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        });
      }
    );
  }

  refreshData(){
    this.fetchAllDatachecklistEmails();
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize } = event;
    this.fetchAllDatachecklistEmails(pageIndex + 1, pageSize);
  }
}

