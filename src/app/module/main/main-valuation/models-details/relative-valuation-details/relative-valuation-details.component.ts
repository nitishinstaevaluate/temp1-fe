import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { FormArray, FormBuilder,FormControl,Validators } from '@angular/forms';
import { MODELS } from 'src/app/shared/enums/constant';


@Component({
  selector: 'app-relative-valuation-details',
  templateUrl: './relative-valuation-details.component.html',
  styleUrls: ['./relative-valuation-details.component.scss']
})
export class RelativeValuationDetailsComponent implements OnInit,OnChanges {

  modelControl = groupModelControl;
  @Input() formOneData:any;
  @Output() relativeValDetailsPrev = new EventEmitter<any>();
  @Output() relativeValDetails = new EventEmitter<any>();

  relativeValuation:any;
  MODEL=MODELS

  floatLabelType:any='never';
  constructor(private formBuilder:FormBuilder){}

  loadFormControl(){
    this.relativeValuation=this.formBuilder.group({
      preferenceRatioSelect:['',[Validators.required]],
      companies:this.formBuilder.array([]),
      industries:this.formBuilder.array([]),

    })


    
  }
  ngOnChanges(){
    this.formOneData;
  }

  isRelativeValuation(value:string){
    return this.formOneData?.model.includes(value) ? true :false;
  }
  ngOnInit(): void {
    this.loadFormControl();
    this.addInput();
    this.addInput();
    this.addInput();
  }

  get Companies() {
    return this.relativeValuation.controls['companies'] as FormArray;
  }
  get Industries() {
    return this.relativeValuation.controls['industries'] as FormArray;
  }
  removeField(i: any) {
    this.Companies.controls.splice(i, 1);
    this.relativeValuation.controls['companies'].value.splice(i,1)
  }
  addInput() {
    this.Companies.push(new FormControl(null));
  }
  removeFieldIndustry(i: any) {
   this.Industries.controls.splice(i,1)
  }
  addInputIndustry() {
    this.Industries.push(new FormControl(null));
  }

  previous(){
    this.relativeValDetailsPrev.emit({status:'Relative_Valuation'})
  }


  saveAndNext(){
    let industries;
    if (this.isRelativeValuation(this.MODEL.RELATIVE_VALUATION)) {
      industries = this.formOneData?.industriesRatio;
    }
    if(this.relativeValuation.controls['preferenceRatioSelect'].value === 'Industry Based'){
      this.relativeValuation.controls['companies'].reset();
    }  
    this.relativeValDetails.emit({...this.relativeValuation.value,status:'Relative_Valuation',industries})
  }
}
