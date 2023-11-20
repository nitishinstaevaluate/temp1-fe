import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { isSelected } from 'src/app/shared/enums/functions';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-net-asset-value-details',
  templateUrl: './net-asset-value-details.component.html',
  styleUrls: ['./net-asset-value-details.component.scss']
})
export class NetAssetValueDetailsComponent implements OnInit{
@Input() formOneData:any;
@Output() navDetailsPrev=new EventEmitter<any>();
@Output() navDetails=new EventEmitter<any>();

controls=groupModelControl;
navForm:any;
floatLabelType:any='never';
appearance:any='fill';
editedValues:any=[];

constructor(private fb:FormBuilder){}
ngOnInit(): void {
  this.loadForm();
}
loadForm(){
  this.navForm=this.fb.group({
    fixedAsset:['book_value',[Validators.required]],
    longTermLoansAdvances:['book_value',[Validators.required]],
    nonCurrentInvestment:['book_value',[Validators.required]],
    deferredTaxAsset:['book_value',[Validators.required]],
    inventories:['book_value',[Validators.required]],
    shortTermLoanAdvances:['book_value',[Validators.required]],
    tradeReceivables:['book_value',[Validators.required]],
    cash:['book_value',[Validators.required]],
    otherCurrentAssets:['book_value',[Validators.required]],
    shortTermProvisions:['book_value',[Validators.required]],
    shortTermBorrowings:['book_value',[Validators.required]],
    tradePayables:['book_value',[Validators.required]],
    otherCurrentLiabilities:['book_value',[Validators.required]],
    lessLongTermBorrowings:['book_value',[Validators.required]],//check in backend,names not same
    lessLongTermProvisions:['book_value',[Validators.required]],//check in backend,name not same
    shareApplicationMoney:['book_value',[Validators.required]],
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
    case 'otherCurrentAssets':
      if(value==='market_value'){
        this.navForm.controls[controlValue].setValue('');
      }
    break;
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
    case 'otherCurrentAssets':
      if(value==='book_value'){
        this.navForm.controls[controlName].setValue(value);
      }
    break;
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
  }
}
previous(){
  this.navDetailsPrev.emit({status:'NAV'})
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
  const payload = {navInputs:navArray,status:'NAV'}
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
      localStorage.setItem('stepTwoStats',`false`);
    }
    else{
      const formStat = localStorage.getItem('pendingStat');
      if(formStat !== null && formStat.includes('6')){
        const splitFormStatus = formStat.split(',');
        splitFormStatus.splice(splitFormStatus.indexOf('6'),1);
        localStorage.setItem('pendingStat',`${splitFormStatus}`);
        if(splitFormStatus.length>1){
          localStorage.setItem('stepTwoStats',`false`);
          
        }else{
        localStorage.setItem('stepTwoStats',`true`);
        localStorage.removeItem('pendingStat')
        }
      }
      else if ((formStat !== null) && !formStat.includes('6')){
          localStorage.setItem('stepTwoStats',`false`);
        }
        else{
          localStorage.setItem('stepTwoStats',`true`);
          
      }
    }

  this.navDetails.emit(payload)
}
}
