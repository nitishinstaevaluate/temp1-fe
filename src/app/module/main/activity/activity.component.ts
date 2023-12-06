import { Component } from '@angular/core';
import { ValuationService } from '../../../shared/service/valuation.service';
import { environment } from 'src/environments/environment';
import { ALL_MODELS, PAGINATION_VAL } from 'src/app/shared/enums/constant';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';

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
    'Date',
    'Company Name',
    'Model Name',
    'Valuation',
    'Status',
    'Report',
  ];
  getModelName:any = ALL_MODELS;

  constructor(private _valuationService: ValuationService,
    private authService:AuthService,
    private route:Router,
    private processStateManagerService:ProcessStatusManagerService) {
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
}
