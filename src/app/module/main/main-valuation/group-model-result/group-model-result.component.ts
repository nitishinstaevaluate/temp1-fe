import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-group-model-result',
  templateUrl: './group-model-result.component.html',
  styleUrls: ['./group-model-result.component.scss']
})
export class GroupModelResultComponent {
  @Output() previousPage = new EventEmitter<any>();
  @Input() transferStepperthree:any;

  constructor(private valuationService:ValuationService){

  }
  saveAndNext(){
    console.log(this.transferStepperthree,"data from all the forms")
    this.valuationService.submitForm(this.transferStepperthree.formOneData).subscribe((response)=>{
      console.log(response,"final response")
    })
  }
  previous(){
      this.previousPage.emit(true)
    }
}
