import { Component } from '@angular/core';
import { ValuationService } from '../../../shared/service/valuation.service';
import { environment } from 'src/environments/environment';
import { ALL_MODELS, PAGINATION_VAL } from 'src/app/shared/enums/constant';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent {
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

  constructor(private _valuationService: ValuationService,
    private authService: AuthService,
    private route: Router,
    private calculationService: CalculationsService,
    private ngxLoaderService: NgxUiLoaderService,
    private snackBar: MatSnackBar) {
    this.inItData();
  }

  inItData() {
    this.fetchData()
  }

  getReport(id: any):string {
    return environment.baseUrl + 'export/' + id;
  }

  fetchData(page:number=1,pageSize:number=10): void {
    this.authService.extractUser().subscribe((extraction:any)=>{
      if(extraction.status){
        this._valuationService.getPaginatedValuations(extraction.userId, page, pageSize)
          .subscribe((data:any) => {
            this.length = data.pagination.totalElements;
            this.activity = data.response;
        });
      }
    })
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize } = event;
    this.fetchData(pageIndex + 1, pageSize);
  }

  loadProcess(processId:string){
    if(processId){
      localStorage.setItem('processStateId',`${processId}`)
      localStorage.setItem('execProcess',`true`)
      this.route.navigate(['/dashboard']);
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

  downloadReport(valuationReportId:string,model:any){
    if(!valuationReportId)
      return this.snackBar.open('Please complete all the details', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      })
    this.ngxLoaderService.start();
    const approach = (model.includes('NAV')) && model.length === 1? 'NAV' : (model.includes('FCFF') || model.includes('FCFE')) && length === 1 ? 'DCF' : ((model.includes('Relative_Valuation') || model.includes('CTM')) && model.length === 1) ? 'CCM' : 'MULTI_MODEL';

    this.calculationService.generateReport(valuationReportId,approach).subscribe((reportData:any)=>{
      if (reportData instanceof Blob) {
        this.snackBar.open('Report generated successfully', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 2000,
          panelClass: 'app-notification-success',
        });
        saveAs(reportData, 'Ifinworth-Report.pdf');
        this.ngxLoaderService.stop();
    }
    },
    (error)=>{
      this.ngxLoaderService.stop();
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
    return;
  }
}
