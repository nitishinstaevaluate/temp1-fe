import { Component, ViewChild } from '@angular/core';
import { ValuationService } from '../../../shared/service/valuation.service';
import { environment } from 'src/environments/environment';
import { ALL_MODELS, GET_MULTIPLIER_UNITS, MODELS, PAGINATION_VAL } from 'src/app/shared/enums/constant';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { convertToNumberOrZero, formatNumber, formatPositiveAndNegativeValues } from 'src/app/shared/enums/functions';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  activity: any[] = [];
  pageSize: number = 10;
  length: number =0;
  pageSizeOptions = PAGINATION_VAL;
  columnName: String[] = [
    'Reference Id',
    'Date',
    'Company Name',
    'Model',
    'Valuation (per share)',
    'Status',
    'Action',
  ];
  getModelName:any = ALL_MODELS;
  query = '';
  searchTerms = new Subject<string>();
  processLoader = false;

  constructor(private _valuationService: ValuationService,
    private authService: AuthService,
    private route: Router,
    private excelAndReportService: ExcelAndReportService,
    private ngxLoaderService: NgxUiLoaderService,
    private snackBar: MatSnackBar,
    private dialogBox: MatDialog) {
      this.dialogBox.closeAll();
    this.inItData();
    this.searchTerms
      .pipe(
        debounceTime(700),
        tap(() => {
          if(this.query){
            this.processLoader = true;
          }
        }),
        distinctUntilChanged(),
        switchMap((query: string) => 
        this._valuationService.getPaginatedValuations(1, 10,query))
      )
      .subscribe(
        (filteredData: any) => {
          this.processLoader = false;
          if(filteredData.response.length === 0){
            this.snackBar.open('No records found','Ok',{
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'app-notification-error'
            })
            return 
          }
          this.length = filteredData.pagination.totalElements;
          this.activity = filteredData.response;
          this.resetPaginator();
        },
        error => {
          this.processLoader = false;
          this.snackBar.open('Search Failed','Ok',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-error'
          })
        }
      );
  }

  inItData() {
    this.fetchData()
  }

  getReport(id: any):string {
    return environment.baseUrl + 'export/' + id;
  }

  fetchData(page:number=1,pageSize:number=10,query?:string): void {
    this.processLoader = true;
    this._valuationService.getPaginatedValuations(page, pageSize,query)
      .subscribe((data:any) => {
        this.processLoader = false;
        this.length = data.pagination.totalElements;
        this.activity = data.response;
    },
    (error)=>{
      this.processLoader = false;
      this.snackBar.open('Record not available','Ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    });
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize } = event;
    this.fetchData(pageIndex + 1, pageSize, this.query);
  }

  loadProcess(processId:string){
    if(processId){
      localStorage.setItem('processStateId',`${processId}`)
      localStorage.setItem('execProcess',`true`)
      this.route.navigate(['/dashboard/valuation']);
    }
  }

  getModel(model:any){
    let str='';
    if(!model?.length)
      return '';
    if(model.length === 1)
      return `${this.getModelName[`${model[0]}`]}`;

    model.forEach((modelName:string,index:number)=>{
      if(index >= 1){
        str += `, ${this.getModelName[`${modelName}`]}`;
      }
      else{
        str +=`${this.getModelName[`${modelName}`]}`;
      }
    })
    return str;
  }

  downloadReport(reportFormDetails:any,model:any,company:string){
    if(!reportFormDetails?.valuationReportId)
      return this.snackBar.open('Please complete all the details', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      })

    const approach = this.determineApproach(model);

    const reportService = this.constructConditionalReportFunctioning(model,reportFormDetails.reportPurpose);

    reportService(reportFormDetails?.valuationReportId,approach,company);

    return;
  }

  getValuation(modelArray:string,processData:any){
    if(processData.fourthStageInput || processData.fifthStageInput){
      if(modelArray.length === 1 && (modelArray.includes(MODELS.FCFE) || modelArray.includes(MODELS.FCFF) || modelArray.includes(MODELS.EXCESS_EARNINGS))){
        let dcfApproachValuation:any = [];
        const valuation = processData?.fourthStageInput?.appData?.valuationResult;
        if(valuation?.length){
         valuation.map((indValuation:any)=>{
          if(indValuation.model === MODELS.FCFE || indValuation.model === MODELS.FCFF || indValuation.model === MODELS.EXCESS_EARNINGS){
            dcfApproachValuation = indValuation.valuationData;
          }
        })
        }
        // Here for DCF valuation, we have value value per share in the second last element of the second array
        if(dcfApproachValuation?.length){
          return `${processData.firstStageInput.currencyUnit} ${formatNumber(dcfApproachValuation[1][dcfApproachValuation[1].length - 1] ? dcfApproachValuation[1][dcfApproachValuation[1].length - 1] : '-')}`;
        }
        else{
          return `${processData.firstStageInput.currencyUnit} -`;
        }
      }
      else if(modelArray.length === 1 && (modelArray.includes(MODELS.COMPARABLE_INDUSTRIES) || modelArray.includes(MODELS.RELATIVE_VALUATION))){
        let ccmValuation:any = [];
        let marketApproachValuePerShare;
        const valuation = processData?.fourthStageInput?.appData?.valuationResult;
        if(valuation?.length){
        valuation.map((indValuation:any)=>{
          if(indValuation.model === MODELS.COMPARABLE_INDUSTRIES || indValuation.model === MODELS.RELATIVE_VALUATION){
            ccmValuation = indValuation?.valuationData?.valuation;
          }
        })
        }
        if(ccmValuation?.length){
          ccmValuation.map((indElements:any)=>{
            if(indElements.particular === 'result'){
              marketApproachValuePerShare = indElements.fairValuePerShareAvg;
            }
          })
          return `${processData.firstStageInput.currencyUnit} ${formatNumber(marketApproachValuePerShare ? marketApproachValuePerShare : '-')}`;
        }
        else{
          return `${processData.firstStageInput.currencyUnit} -`;
        }
      }
      else if(modelArray.length === 1 && modelArray.includes(MODELS.NAV)){
        let navValuation: any = [];
        const valuation = processData?.fourthStageInput?.appData?.valuationResult;
        if(valuation?.length){
        valuation.map((indValuation:any)=>{
          if(indValuation.model === MODELS.NAV){
            navValuation = indValuation?.valuationData;
          }
        })
        }
        if(navValuation){
          return `${processData.firstStageInput.currencyUnit} ${formatNumber(navValuation?.valuePerShare?.bookValue ? navValuation?.valuePerShare?.bookValue : '-')}`;
        }
        else{
          return `${processData.firstStageInput.currencyUnit} -`;
        }
      }
      else if(modelArray.length === 1 && modelArray.includes(MODELS.RULE_ELEVEN_UA)){
        const ruleElevenUaAprroachValuation = processData?.fourthStageInput?.appData?.computations?.valuePerShare;
        return `${processData.firstStageInput.currencyUnit} ${formatNumber(ruleElevenUaAprroachValuation ? formatPositiveAndNegativeValues(ruleElevenUaAprroachValuation) : '0')}`;
      }
      else if(processData.fifthStageInput?.totalWeightageModel){
        const outstandingShares = convertToNumberOrZero(processData.firstStageInput.outstandingShares);
        const reportingUnit = processData.firstStageInput?.reportingUnit;
        const multiplier = GET_MULTIPLIER_UNITS[`${reportingUnit}`] || 100000; //In default case, setting multiplier to 1 lakh
        return `${processData.firstStageInput.currencyUnit} ${formatNumber(processData.fifthStageInput.totalWeightageModel?.weightedVal ? processData.fifthStageInput.totalWeightageModel?.weightedVal * multiplier/outstandingShares : '-')}`;
      }
      else{
        return '-';
      }
    }
    else{
      return '-';
    }
  }

  filterByCompany(event:any){
    if(this.query !== event.target.value){
      this.query = event.target.value;
      this.searchTerms.next(this.query);
    }
  }
  resetPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  generateElevenUaReport(response:any,companyName:any){
    this.excelAndReportService.generateElevenUaReport(response, 'PDF').subscribe((reportData:any)=>{
      if (reportData instanceof Blob) {
        this.snackBar.open('Report generated successfully', 'OK', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'app-notification-success',
        });
        saveAs(reportData, `${companyName}.pdf`);
    }
    },
    (error)=>{
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
  }

  generateBasicReport(response:any, approach:any, companyName:any){
    this.excelAndReportService.generateReport(response,approach, 'PDF').subscribe((reportData:any)=>{
      if (reportData instanceof Blob) {
        this.snackBar.open('Report generated successfully', 'OK', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'app-notification-success',
        });
        saveAs(reportData, `${companyName}.pdf`);   
    }
    },
    (error)=>{
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
  }

  generateSebiReport(response:any, companyName:any){
    this.excelAndReportService.generateSebiReport(response, 'PDF').subscribe((reportData:any)=>{
      if (reportData instanceof Blob) {
        this.snackBar.open('Report generated successfully', 'OK', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'app-notification-success',
        });
        saveAs(reportData, `${companyName}.pdf`);
    }
    },
    (error)=>{
      // this.reportGenerate = false;
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
  }

  generateNavReport(response:any, companyName:any){
    this.excelAndReportService.generateNavReport(response, 'PDF').subscribe((reportData:any)=>{
      if (reportData instanceof Blob) {
        this.snackBar.open('Report generated successfully', 'OK', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'app-notification-success',
        });
        saveAs(reportData, `${companyName}.pdf`);
    }
    },
    (error)=>{
      // this.reportGenerate = false;
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
  }

  constructConditionalReportFunctioning(modelArray:any, reportPurpose:any){
    let reportService:any;
    switch (true) {
        case modelArray.includes(MODELS.RULE_ELEVEN_UA):
            reportService = this.generateElevenUaReport.bind(this);
            break;
        case reportPurpose.includes('sebiRegulations'):
            reportService = this.generateSebiReport.bind(this);
            break;
        case modelArray.includes(MODELS.NAV) && modelArray.length === 1:
            reportService = this.generateNavReport.bind(this);
            break;
        default:
            reportService = this.generateBasicReport.bind(this);
    }
    return reportService;
  }

  determineApproach(modelArray:any) {
    const model = modelArray;

    // if (model.includes('NAV') && model.length === 1) {
    //   return 'NAV';
    // }
    
    if ((model.includes('FCFF') || model.includes('FCFE')) && model.length === 1) {
      return 'DCF';
    }

    if ((model.includes('Relative_Valuation') || model.includes('CTM')) && model.length === 1) {
      return 'CCM';
    }

    return 'MULTI_MODEL';
  }

  downloadMrlReport(processStateId:any, companyName:any, format:string, model:any){
    this.processLoader = true;

    if(format === 'docx'){
      const saveAsFileName = `${companyName} - Mrl.docx`;
      this.downloadMrlVariations(model, processStateId, 'DOCX', saveAsFileName);
    }
    else{
      const saveAsFileName = `${companyName} - Mrl.pdf`;
      this.downloadMrlVariations(model, processStateId, 'PDF', saveAsFileName);
    }
  }

  downloadMrlVariations(model:string, processStateId:any,  format:string, saveAsFileName:string){
    switch(true){
      case model.includes(MODELS.RULE_ELEVEN_UA):
        this.excelAndReportService.generateElevenUaMrlReport(processStateId, format).subscribe((response)=>{
          this.processLoader = false;
          if(response){
            saveAs(response, saveAsFileName);
          }
        }, (error)=>{
          this.processLoader = false;
          this.snackBar.open('backend error - Mrl generation for Eleven Ua failed', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: 'app-notification-error',
          });
        })
      break;

      default:
        this.excelAndReportService.generateMrlReport(processStateId, format).subscribe((response)=>{
          this.processLoader = false;
          if(response){
            saveAs(response, saveAsFileName);
          }
        },(error)=>{
          this.processLoader = false;
          this.snackBar.open('backend error - Mrl generation failed', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: 'app-notification-error',
          });
        })
    }
  }
}
