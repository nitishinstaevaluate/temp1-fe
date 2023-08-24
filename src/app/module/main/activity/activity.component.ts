import { Component } from '@angular/core';
import { ValuationService } from '../../../shared/service/valuation.service';
import { environment } from 'src/enviroments/enviroments';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent {
  activity: any[] = [];
  currentPage: number = 1;
  totalPage:number = 0;
  pageSize: number = 10;
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchData();
  }

  fetchData(): void {
    this._valuationService.getPaginatedValuations('8989', this.currentPage, this.pageSize)
      .subscribe((data:any) => {
        this.activity = data.response;
        this.totalPage = data.totalPage;
      });
  }
}
