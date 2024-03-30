import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { isNotRuleElevenUaAndNav, isSelected } from 'src/app/shared/enums/functions';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MODELS } from 'src/app/shared/enums/constant';

@Component({
  selector: 'app-net-asset-value-details',
  templateUrl: './net-asset-value-details.component.html',
  styleUrls: ['./net-asset-value-details.component.scss']
})
export class NetAssetValueDetailsComponent implements OnInit, OnChanges{
@Input() formOneData:any;
@Output() navDetailsPrev=new EventEmitter<any>();
@Output() navDetails=new EventEmitter<any>();
@Input() thirdStageInput:any;

controls=groupModelControl;
navForm:any;
floatLabelType:any='never';
appearance:any='fill';
editedValues:any=[];
modelValue:any = []

constructor(private fb:FormBuilder,
  private processStatusManagerService:ProcessStatusManagerService,
  private snackBar:MatSnackBar){}
ngOnInit(): void {
  this.loadForm();
  this.checkProcessExist();
}
ngOnChanges(changes: SimpleChanges) {
  this.checkPreviousAndCurrentValue(changes);
}

checkProcessExist(){
  if(this.thirdStageInput){
    this.thirdStageInput.map((stateThreeDetails:any)=>{
      if(stateThreeDetails.model === MODELS.NAV && this.formOneData.model.includes(MODELS.NAV)){
        const navStateDetails = stateThreeDetails.navInputs;
        navStateDetails.map((navDetails:any)=>{
          for(let control in this.navForm.controls){
            if(control === navDetails.fieldName){
              if(navDetails?.type === 'market_value'){
                this.navForm.controls[control].setValue(navDetails?.value ? navDetails?.value : '');
              }
              else{
                this.navForm.controls[control].setValue(navDetails?.type);
              }
            }
          }
        })
      }
    })
  }
  }

loadForm(){
  this.navForm=this.fb.group({
    fixedAsset:['book_value',[Validators.required]],
    longTermLoansAdvances:['book_value',[Validators.required]],
    nonCurrentInvestment:['book_value',[Validators.required]],
    deferredTaxAsset:['book_value',[Validators.required]],
    otherNonCurrentAsset:['book_value',[Validators.required]],
    inventories:['book_value',[Validators.required]],
    shortTermLoanAdvances:['book_value',[Validators.required]],
    tradeReceivables:['book_value',[Validators.required]],
    cash:['book_value',[Validators.required]],
    shortTermInvestment:['book_value',[Validators.required]],
    otherCurrentAssets:['book_value',[Validators.required]],
    shortTermProvisions:['book_value',[Validators.required]],
    shortTermBorrowings:['book_value',[Validators.required]],
    tradePayables:['book_value',[Validators.required]],
    otherCurrentLiabilities:['book_value',[Validators.required]],
    lessLongTermBorrowings:['book_value',[Validators.required]],//check in backend,names not same
    lessLongTermProvisions:['book_value',[Validators.required]],//check in backend,name not same
    shareApplicationMoney:['book_value',[Validators.required]],
    contingentLiability:['book_value',[Validators.required]],
    // deferredTaxLiability:['book_value',[Validators.required]],
  })
}

isRelativeValuation(modelName:string){
  if(this.formOneData?.model.length>0)
    return isSelected(modelName,this.formOneData?.model);
  return false;
}

onSelectorChange(value:any,controlValue:any){
  switch(controlValue){
    case 'fixedAsset':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'longTermLoansAdvances':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'nonCurrentInvestment':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'deferredTaxAsset':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'otherNonCurrentAsset':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'inventories':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'shortTermLoanAdvances':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'tradeReceivables':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'cash':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'shortTermInvestment':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'otherCurrentAssets':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    // case 'deferredTaxLiability':
    //   if(value==='market_value'){
    //     this.navForm.controls[controlValue].setValue('');
    //   }
    // break;
    case 'shortTermProvisions':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'shortTermBorrowings':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'tradePayables':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'otherCurrentLiabilities':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'lessLongTermBorrowings':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'lessLongTermProvisions':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'shareApplicationMoney':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
    case 'contingentLiability':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
  }
}

resetBookValue(value:any,controlName:any){
  switch(controlName){
    case 'fixedAsset':
      if(value === 'book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'longTermLoansAdvances':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'nonCurrentInvestment':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'deferredTaxAsset':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'otherNonCurrentAsset':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'inventories':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'shortTermLoanAdvances':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'tradeReceivables':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'cash':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'shortTermInvestment':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'otherCurrentAssets':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    // case 'deferredTaxLiability':
    //   if(value==='book_value'){
    //     this.navForm.controls[controlName].setValue(value);
    //   }
    // break;
    case 'shortTermProvisions':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'shortTermBorrowings':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'tradePayables':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'otherCurrentLiabilities':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'lessLongTermBorrowings':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'lessLongTermProvisions':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
    case 'shareApplicationMoney':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;  
    case 'contingentLiability':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;  
  }
}
previous(){
  const checkModel = isNotRuleElevenUaAndNav(this.modelValue);
  if(!checkModel){
    localStorage.setItem('step', '2')
  }
  this.navDetailsPrev.emit({status:MODELS.NAV})
}
saveAndNext(){
  let navArray:any=[]
  
  for (const fieldName in this.navForm.value) {
    if (this.navForm.value.hasOwnProperty(fieldName)) {
      const navObj = {
        fieldName: fieldName,
        type:this.navForm.value[fieldName] === 'book_value' ? this.navForm.value[fieldName] : 'market_value', // You can set the type accordingly if you have this information
        value: !isNaN(+this.navForm?.value[fieldName]) ? +this.navForm?.value[fieldName] : null
      };
      navArray.push(navObj);
    }
  }
  const payload = {navInputs:navArray,status:MODELS.NAV}

  this.validateControls(this.navForm.controls,payload);


}

validateControls(controlArray: { [key: string]: FormControl },payload:any){
  let allControlsFilled = true;
    for (const controlName in controlArray) {
      if (controlArray.hasOwnProperty(controlName)) {
        const control = controlArray[controlName];
        if (control.value === null || control.value === '' ) {
          allControlsFilled = false;
          break;
        }
       
      }
    }
    if(!allControlsFilled){
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && !formStat.includes('6')){
        localStorage.setItem('pendingStat',`${[...formStat,'6']}`)
      }
      else{
        localStorage.setItem('pendingStat',`6`)
      }
      localStorage.setItem('stepThreeStats',`false`);
    }
    else{
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && formStat.includes('6')){
        const splitFormStatus = formStat.split(',');
        splitFormStatus.splice(splitFormStatus.indexOf('6'),1);
        localStorage.setItem('pendingStat',`${splitFormStatus}`);
        if(splitFormStatus.length>1){
          localStorage.setItem('stepThreeStats',`false`);
          
        }else{
        localStorage.setItem('stepThreeStats',`true`);
        localStorage.removeItem('pendingStat')
        }
      }
      else if ((formStat !== null) && !formStat.includes('6')){
          localStorage.setItem('stepThreeStats',`false`);
        }
        else{
          localStorage.setItem('stepThreeStats',`true`);
          
      }
    }

    let processStateStep;
    if(allControlsFilled){
      processStateStep = 3
    }
    else{
      processStateStep = 2
    }

    const processStateModel ={
      thirdStageInput:[{model:MODELS.NAV,...payload,formFillingStatus:allControlsFilled}],
      step:processStateStep
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'));

    this.navDetails.emit(payload)
}

checkPreviousAndCurrentValue(changes:any){
  if (this.formOneData && changes['formOneData'] ) {
    this.modelValue = changes['formOneData'].currentValue.model;
  }
}

processStateManager(process:any, processId:any){
  this.processStatusManagerService.instantiateProcess(process, processId).subscribe(
    (processStatusDetails: any) => {
      if (processStatusDetails.status) {
        localStorage.setItem('processStateId', processStatusDetails.processId);
      }
    },
    (error) => {
      this.snackBar.open(`${error.message}`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
      });
    }
  );
}
}
