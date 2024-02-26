import { Component, ViewChild } from '@angular/core';
import { ValuationService } from '../../../shared/service/valuation.service';
import { environment } from 'src/environments/environment';
import { ALL_MODELS, MODELS, PAGINATION_VAL } from 'src/app/shared/enums/constant';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';
import { formatNumber } from 'src/app/shared/enums/functions';

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
    'Valuation',
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
    private snackBar: MatSnackBar) {
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

      if(modelArray.length === 1 && (modelArray.includes(MODELS.FCFE) || modelArray.includes(MODELS.FCFF) || modelArray.includes(MODELS.EXCESS_EARNINGS) || modelArray.includes(MODELS.NAV))){
        return `${processData.firstStageInput.currencyUnit} ${formatNumber(processData?.fourthStageInput?.appData?.valuationResult[0].valuation ? processData?.fourthStageInput?.appData?.valuationResult[0].valuation : '-')}`;
      }
      else if(modelArray.length === 1 && (modelArray.includes(MODELS.COMPARABLE_INDUSTRIES) || modelArray.includes(MODELS.RELATIVE_VALUATION))){
        return `${processData.firstStageInput.currencyUnit} ${formatNumber(processData.fourthStageInput.appData.valuationResult[0].valuation?.finalPriceAvg ? processData.fourthStageInput.appData.valuationResult[0].valuation?.finalPriceAvg : '-')}`;
      }
      else if(processData.fifthStageInput?.totalWeightageModel){
        return `${processData.firstStageInput.currencyUnit} ${formatNumber(processData.fifthStageInput.totalWeightageModel?.weightedVal ? processData.fifthStageInput.totalWeightageModel?.weightedVal : '-')}`;
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
    this.excelAndReportService.generateElevenUaReport(response).subscribe((reportData:any)=>{
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
    this.excelAndReportService.generateReport(response,approach).subscribe((reportData:any)=>{
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
    this.excelAndReportService.generateSebiReport(response).subscribe((reportData:any)=>{
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
        case reportPurpose === 'sebiRegulations':
            reportService = this.generateSebiReport.bind(this);
            break;
        default:
            reportService = this.generateBasicReport.bind(this);
    }
    return reportService;
  }

  determineApproach(modelArray:any) {
    const model = modelArray;

    if (model.includes('NAV') && model.length === 1) {
      return 'NAV';
    }
    
    if ((model.includes('FCFF') || model.includes('FCFE')) && model.length === 1) {
      return 'DCF';
    }

    if ((model.includes('Relative_Valuation') || model.includes('CTM')) && model.length === 1) {
      return 'CCM';
    }

    return 'MULTI_MODEL';
  }

  downloadMrlReport(processStateId:any){
    this.processLoader = true;
    this.excelAndReportService.generateMrlReport(processStateId).subscribe((response)=>{
      this.processLoader = false;
      if(response){
        saveAs(response, `MRL.pdf`);
      }
    },(error)=>{
      this.processLoader = false;
      this.snackBar.open('backend error - Mrl generation failed', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
  }
}
