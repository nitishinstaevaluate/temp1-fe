import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-group-model-result',
  templateUrl: './group-model-result.component.html',
  styleUrls: ['./group-model-result.component.scss']
})
export class GroupModelResultComponent implements OnChanges {
  @Output() previousPage = new EventEmitter<any>();
  @Input() transferStepperthree:any; //use this property as it contains data from form 1(stepper 1) and form 2 (stepper 2)
  
  valuationResult:any;
  
  constructor(private valuationService:ValuationService){
    
  }
  ngOnChanges(changes:SimpleChanges){
    this.transferStepperthree;
  }
  saveAndNext(){
    console.log(this.transferStepperthree,"data from all the forms")
  }
  previous(){
      this.previousPage.emit(true)
    }
    checkModel(modelName: string) {
      return this.transferStepperthree?.formThreeData?.appData?.valuationResult.some(
        (response: any) => {
          return response.model === modelName;
        }
      );
    }
}
