import { Component } from '@angular/core';
import { ValuationService } from '../../../shared/service/valuation.service';
import { environment } from 'src/enviroments/enviroments';
import { PAGINATION_VAL } from 'src/app/shared/enums/constant';

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
    'Get Report',
  ];

  constructor(private _valuationService: ValuationService) {
    this.inItData();
  }

  inItData() {
    this.fetchData()
  }

  getReport(id: any):string {
    return environment.HOST + 'export/' + id;
  }

  fetchData(page:number=1,pageSize:number=10): void {
    this._valuationService.getPaginatedValuations('', page, pageSize)
      .subscribe((data:any) => {
        this.length = data.pagination.totalElements;
        this.activity = data.response;
    });
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize } = event;
    this.fetchData(pageIndex + 1, pageSize);
  }
}
