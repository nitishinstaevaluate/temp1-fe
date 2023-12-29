import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-model-rule-eleven-ua-result-table',
  templateUrl: './model-rule-eleven-ua-result-table.component.html',
  styleUrls: ['./model-rule-eleven-ua-result-table.component.scss']
})
export class ModelRuleElevenUaResultTableComponent {
  @Input() formData:any
  constructor(){}
}
