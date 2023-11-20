import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MODELS } from 'src/app/shared/enums/constant';
import { isSelected } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-group-model-result',
  templateUrl: './group-model-result.component.html',
  styleUrls: ['./group-model-result.component.scss']
})
export class GroupModelResultComponent implements OnChanges {
  @Output() previousPage = new EventEmitter<any>();
  @Output() resultData = new EventEmitter<any>();
  @Input() transferStepperthree:any; //use this property as it contains data from form 1(stepper 1) and form 2 (stepper 2)
  
  fcfeSlider:any=0;
  fcffSlider:any=0;
  relativeValSlider:any=0;
  excessEarnSlider:any=0;
  comparableIndustrySlider:any=0;
  navSlider:any=0;
  finalWeightedValue:any;

  valuationResult:any;
  fcfeValuation:any;
  fcffValuation:any;
  relativeValuation:any;
  excessEarnValuation:any;
  comparableIndustryValuation:any;
  navValuation:any;
  calculateModelWeigtagePayload:any = {
    results:[]
  }
  data:any;
  isLoader=false;
  fcfeMaxValue: number=100;
  fcffMaxValue: number=100;
  excessEarnMaxValue: number=100;
  relativeValMaxValue: number=100;
  comparableIndustryMaxValue: number=100;
  navMaxValue: number=100;
  maxModelValue: any;
  
  constructor(private calculationsService:CalculationsService,private snackbar:MatSnackBar){
    
  }
  ngOnChanges(changes:SimpleChanges){
    this.transferStepperthree;
    this.transferStepperthree?.formThreeData?.appData?.valuationResult.map(
      (response: any) => {
        if(response.model === 'FCFE'){
          this.fcfeValuation =  response.valuation;
          const fcfeIndex = this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "FCFE")
          if(fcfeIndex === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.fcfeValuation,weightage:0});
          }
          else{
            this.calculateModelWeigtagePayload.results.splice(fcfeIndex,1,{model:response.model,value:this.fcfeValuation,weightage:0})
          }
        }
        else if(response.model === 'FCFF'){
          this.fcffValuation = response.valuation;
          const fcffIndex = this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "FCFF");
          if(fcffIndex === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.fcffValuation,weightage:0});
          }
          else{
            this.calculateModelWeigtagePayload.results.splice(fcffIndex,1,{model:response.model,value:this.fcffValuation,weightage:0});
          }
        }
        else if(response.model === 'Relative_Valuation'){
          this.relativeValuation = response.valuation?.finalPriceMed;
          const relativeValuationIndex = this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "Relative_Valuation");
          if(relativeValuationIndex === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.relativeValuation,weightage:0});
          }
          else{
            this.calculateModelWeigtagePayload.results.splice(relativeValuationIndex,1,{model:response.model,value:this.relativeValuation,weightage:0});
          }
        }
        else if(response.model === 'CTM'){
          this.comparableIndustryValuation = response.valuation?.finalPriceMed;
          const comparableIndustriesIndex = this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "CTM");
          if(comparableIndustriesIndex === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.comparableIndustryValuation,weightage:0});
          }
          else{
            this.calculateModelWeigtagePayload.results.splice(comparableIndustriesIndex,1,{model:response.model,value:this.comparableIndustryValuation,weightage:0});
          }
        }
        else if(response.model === 'Excess_Earnings'){
          this.excessEarnValuation = response.valuation;
          const excessEarningIndex = this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "Excess_Earnings");
          if(excessEarningIndex === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.excessEarnValuation,weightage:0});
          }
          else{
            this.calculateModelWeigtagePayload.results.splice(excessEarningIndex,1,{model:response.model,value:this.excessEarnValuation,weightage:0});
          }
        }
        else if(response.model === 'NAV'){
          this.navValuation = response.valuation;
          const navIndex = this.calculateModelWeigtagePayload.results.findIndex((item:any) => item.model === "NAV");
          if(navIndex === -1)
          {
            this.calculateModelWeigtagePayload.results.push({model:response.model,value:this.navValuation,weightage:0});
          }
          else{
            this.calculateModelWeigtagePayload.results.splice(navIndex,1,{model:response.model,value:this.navValuation,weightage:0});
          }
        }
      }
    );

    if(changes['transferStepperthree'].currentValue && changes['transferStepperthree'].previousValue ){
        const currentModel:any=[];
        const previousModel:any=[];
        this.data=null;
        this.fcfeSlider=0;
        this.fcffSlider=0;
        this.navSlider=0;
        this.comparableIndustrySlider=0;
        this.relativeValSlider=0;
        this.excessEarnSlider=0;
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
    // this.isLoader=true;
    // const payload={
    //   reportId:this.transferStepperthree?.formThreeData?.appData?.reportId,
    // }
    // this.calculationsService.generatePdf(payload)
    // .subscribe((appData:any)=>{
    //   console.log(appData)
    //   this.isLoader = false
    //   if(appData.status){
    //     this.snackbar.open('Pdf is downloaded successfully','Ok',{
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //       panelClass: 'app-notification-success'
    //     })
        
    //   }
    //   else{
    //     this.snackbar.open('Please try again','Ok',{
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //       panelClass: 'app-notification-error'
    //     })
    //   }
    // },
    // (err)=>{
    //   this.isLoader = false;
    //   this.snackbar.open(err.message,'Ok',{
    //     horizontalPosition: 'right',
    //     verticalPosition: 'top',
    //     duration: 4000,
    //     panelClass: 'app-notification-error'
    //   })
    // })

    localStorage.setItem('stepFourStats','true');
    this.resultData.emit({...this.transferStepperthree});
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

    modelWeightageSlider(event:any,modelName:any,maxValue:number,sliderValue:number){
      let sortedModelArray = [];
      const slider = event.target as HTMLInputElement;
      
      const availPercentage = this.setModelSliderValue(modelName,parseFloat(slider.value));
      const modelIndexToRemove = this.transferStepperthree?.formOneAndTwoData.model.sort().indexOf(modelName);
       sortedModelArray = this.transferStepperthree?.formOneAndTwoData.model
       .sort()
       .slice(0, modelIndexToRemove)
       .concat(this.transferStepperthree?.formOneAndTwoData.model.slice(modelIndexToRemove + 1));
      const remainingEle = modelIndexToRemove !== -1 ? modelIndexToRemove - sortedModelArray.length : sortedModelArray.length; 
      console.log(sortedModelArray,"sorted array","modelIndexToRemove",modelIndexToRemove,"remaining elements",remainingEle)
      if(sortedModelArray.length == 1){
        for (let i = 0 ; i <= sortedModelArray.length;i++){
          this.setModelSliderValue(sortedModelArray[i],Math.abs(sliderValue-maxValue),Math.abs(sliderValue-maxValue));
        }
        
      }
      if(sortedModelArray.length > 1 && Math.abs(remainingEle) > 1){
        for (let i = modelIndexToRemove ; i < sortedModelArray.length;i++){
          this.setModelSliderValue(sortedModelArray[i], Math.abs((sliderValue-maxValue)/Math.abs(remainingEle)), Math.abs(sliderValue-maxValue));
          this.setMaxModelValue(sortedModelArray[i],  Math.abs(sliderValue-maxValue));
        }
      }
      if(sortedModelArray.length > 1 && Math.abs(remainingEle) === 1){
        for (let i = modelIndexToRemove ; i < sortedModelArray.length;i++){
          this.setModelSliderValue(sortedModelArray[i], Math.abs(sliderValue-maxValue), Math.abs(sliderValue-maxValue));
          this.setMaxModelValue(sortedModelArray[i],  Math.abs(sliderValue-maxValue));
        }
      }

      this.calculationsService.getWeightedValuation(this.calculateModelWeigtagePayload).subscribe((response:any)=>{
        if(response.status){
          this.data = response?.result?.modelValue;
          this.finalWeightedValue = response?.result?.weightedVal ?? 0;
        }
      })
    }

    setModelSliderValue(modelName:string,value:number,availPercent?:number){
      let availablePercentage=availPercent || 100;
      switch(modelName){
        case MODELS.FCFE:
          this.fcfeSlider = value.toFixed(2);
          this.calculateModelWeigtagePayload.results.map((response:any)=>{
            if(response.model=== MODELS.FCFE){
              response.weightage = this.fcfeSlider
            }
          })
          return availablePercentage - value;
          break;
         
        case MODELS.FCFF:
          this.fcffSlider = value.toFixed(2);
          this.calculateModelWeigtagePayload.results.map((response:any)=>{
            if(response.model=== MODELS.FCFF){
              response.weightage = this.fcffSlider
            }
          })
          return availablePercentage - value;
          break;
          
        case MODELS.EXCESS_EARNINGS:
          this.excessEarnSlider = value.toFixed(2);
          this.calculateModelWeigtagePayload.results.map((response:any)=>{
            if(response.model=== MODELS.EXCESS_EARNINGS){
              response.weightage = this.excessEarnSlider
            }
          })
          return availablePercentage - value;
          break;

        case MODELS.RELATIVE_VALUATION:
          this.relativeValSlider = value.toFixed(2);
          this.calculateModelWeigtagePayload.results.map((response:any)=>{
            if(response.model=== MODELS.RELATIVE_VALUATION){
              response.weightage = this.relativeValSlider;
            }
          })
          return availablePercentage - value;
          break;

        case MODELS.COMPARABLE_INDUSTRIES:
          this.comparableIndustrySlider = value.toFixed(2);
          this.calculateModelWeigtagePayload.results.map((response:any)=>{
            if(response.model=== MODELS.COMPARABLE_INDUSTRIES){
              response.weightage = this.comparableIndustrySlider
            }
          })
          return availablePercentage - value;
          break;

        case MODELS.NAV:
          this.navSlider = value.toFixed(2);
          this.calculateModelWeigtagePayload.results.map((response:any)=>{
            if(response.model=== MODELS.NAV){
              response.weightage = this.navSlider
            }
          })
          return availablePercentage - value;
          break;
          
         default:
          return availablePercentage;
      }
    }

    setMaxModelValue(modelName:string,maxValue:number){
      let availablePercentage = 0
      switch(modelName){
        case MODELS.FCFE:
          this.fcfeMaxValue = maxValue;
          return maxValue;
          break;
         
        case MODELS.FCFF:
          this.fcffMaxValue = maxValue;
          return maxValue;
          break;
          
        case MODELS.EXCESS_EARNINGS:
          this.excessEarnMaxValue = maxValue;
          return maxValue;
          break;

        case MODELS.RELATIVE_VALUATION:
          this.relativeValMaxValue = maxValue;
          return maxValue
          break;

        case MODELS.COMPARABLE_INDUSTRIES:
          this.comparableIndustryMaxValue = maxValue;
          console.log(maxValue,"available maxValue CTM");
          return maxValue;
          break;

        case MODELS.NAV:
          this.navMaxValue = maxValue;
          console.log(maxValue,"available maxValue NAV");
          return maxValue;
          break;
          
         default:
          return availablePercentage;
      }
    }

    isRelativeValuation(modelName:string,array:any){
      return isSelected( modelName,array)
    }
}
