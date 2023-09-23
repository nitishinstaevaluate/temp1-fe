import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-group-model-result',
  templateUrl: './group-model-result.component.html',
  styleUrls: ['./group-model-result.component.scss']
})
export class GroupModelResultComponent implements OnChanges {
  @Output() previousPage = new EventEmitter<any>();
  @Input() transferStepperthree:any; //use this property as it contains data from form 1(stepper 1) and form 2 (stepper 2)
  
  fcfeSlider:any;
  fcffSlider:any;
  relativeValSlider:any;
  excessEarnSlider:any;
  finalWeightedValue:any;

  valuationResult:any;
  fcfeValuation:any;
  fcffValuation:any;
  relativeValuation:any;
  excessEarnValuation:any;
  calculateModelWeigtagePayload:any = {
    results:[]
  }
  data:any;
  
  constructor(private valuationService:ValuationService,private calculationsService:CalculationsService){
    
  }
  ngOnChanges(changes:SimpleChanges){
    this.transferStepperthree;
    this.transferStepperthree?.formThreeData?.appData?.valuationResult.map(
      (response: any) => {
        if(response.model === 'FCFE'){
          this.fcfeValuation =  response.valuation;
          if(this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "FCFE") === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.fcfeValuation,weightage:0});
          }
        }
        else if(response.model === 'FCFF'){
          this.fcffValuation = response.valuation;
          if(this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "FCFF") === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.fcffValuation,weightage:0});
          }
        }
        else if(response.model === 'Relative_Valuation'){
          this.relativeValuation = response.valuation?.finalPriceMed;
          if(this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "Relative_Valuation") === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.relativeValuation,weightage:0});
          }
        }
        else if(response.model === 'Excess_Earnings'){
          this.excessEarnValuation = response.valuation;
          if(this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "Excess_Earnings") === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.excessEarnValuation,weightage:0});
          }
        }
      }
    );

    if(changes['transferStepperthree'].currentValue && changes['transferStepperthree'].previousValue ){
        const currentModel:any=[];
        const previousModel:any=[];
        this.data=null;
        // console.log(changes['transferStepperthree']?.currentValue?.formThreeData?.appData,"current final")
        // console.log(changes['transferStepperthree']?.previousValue?.formThreeData?.appData,"previous final")
        changes['transferStepperthree']?.currentValue?.formThreeData?.appData?.valuationResult.map((val:any)=>{
          currentModel.push(val.model); 
        })
        changes['transferStepperthree']?.previousValue?.formThreeData?.appData?.valuationResult.map((val:any)=>{
          previousModel.push(val.model);
        })
        // console.log(currentModel,"current array",previousModel,"previous array")
        const elementsNotInArray = previousModel.filter((item:any) => !currentModel.includes(item));
        if(elementsNotInArray){
          for (let ele of elementsNotInArray){
            // console.log(ele,"for loop ele along with the payload:", this.calculateModelWeigtagePayload.results)
            const findIndex=this.calculateModelWeigtagePayload.results.findIndex((res:any)=>res.model === ele);
            // console.log(findIndex,"index to remove")
            // console.log(this.calculateModelWeigtagePayload.results,"before payload")
            this.calculateModelWeigtagePayload.results.splice(findIndex,1);
            // console.log(this.calculateModelWeigtagePayload.results,"after payload");
          }
        }
    }
  
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

    onFcfeSliderChange(event: any): void {
      // Handle slider value change here
      const slider = event.target as HTMLInputElement;
      this.fcfeSlider = parseFloat(slider.value);
      this.calculateModelWeigtagePayload.results.map((response:any)=>{
        if(response.model==='FCFE'){
          response.weightage = this.fcfeSlider
        }
      })
      this.calculationsService.getWeightedValuation(this.calculateModelWeigtagePayload).subscribe((response:any)=>{
        if(response.status){
          this.data = response?.result?.modelValue;
          this.finalWeightedValue = response?.result?.weightedVal ?? 0;
        }
      })
    }

    onFcffSliderChange(event: any): void {
      // Handle slider value change here
      const slider = event.target as HTMLInputElement;
      this.fcffSlider = parseFloat(slider.value);
      this.calculateModelWeigtagePayload.results.map((response:any)=>{
        if(response.model==='FCFF'){
          response.weightage = this.fcffSlider
        }
      })
      this.calculationsService.getWeightedValuation(this.calculateModelWeigtagePayload).subscribe((response:any)=>{
        if(response.status){
          this.data = response?.result?.modelValue;
          this.finalWeightedValue = response?.result?.weightedVal ?? 0;
        }
      })
    }
    onRelativeValSliderChange(event: any): void {
      // Handle slider value change here
      const slider = event.target as HTMLInputElement;
      this.relativeValSlider = parseFloat(slider.value);
      this.calculateModelWeigtagePayload.results.map((response:any)=>{
        if(response.model==='Relative_Valuation'){
          response.weightage = this.relativeValSlider
        }
      })
      this.calculationsService.getWeightedValuation(this.calculateModelWeigtagePayload).subscribe((response:any)=>{
        if(response.status){
          this.data = response?.result?.modelValue;
          this.finalWeightedValue = response?.result?.weightedVal ?? 0;
        }
      })
    }
    onExcessEarnSliderChange(event: any): void {
      // Handle slider value change here
      const slider = event.target as HTMLInputElement;
      this.excessEarnSlider = parseFloat(slider.value);
      this.calculateModelWeigtagePayload.results.map((response:any)=>{
        if(response.model==='Excess_Earnings'){
          response.weightage = this.excessEarnSlider
        }
      })
      this.calculationsService.getWeightedValuation(this.calculateModelWeigtagePayload).subscribe((response:any)=>{
        if(response.status){
          this.data = response?.result?.modelValue;
          this.finalWeightedValue = response?.result?.weightedVal ?? 0;
        }
      })
    }
}
