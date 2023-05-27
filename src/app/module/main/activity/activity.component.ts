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
    this._valuationService.getActivity().subscribe((resp: any) => {
      this.activity = resp;
    });
  }

  getReport(id: any):string {
    return environment.HOST + 'export/' + id;
  }
}
