import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import groupModelControl from '../../../../../shared/enums/group-model-controls.json';
import { MODELS } from 'src/app/shared/enums/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-comparable-industries-details',
  templateUrl: './comparable-industries-details.component.html',
  styleUrls: ['./comparable-industries-details.component.scss']
})
export class ComparableIndustriesDetailsComponent implements OnChanges,OnInit {

  modelControl = groupModelControl;
  @Input() formOneData:any;
  @Output() comparableIndustriesDetailsPrev = new EventEmitter<any>();
  @Output() comparableIndustriesDetails = new EventEmitter<any>();
  
  MODEL=MODELS;
  floatLabelType:any='never';

  comparableIndustries:any;

  constructor(private formBuilder:FormBuilder){}

  loadFormControl(){
    this.comparableIndustries=this.formBuilder.group({
      preferenceRatioSelect:['Industry Based',[Validators.required]],
      companies:this.formBuilder.array([]),
      industries:this.formBuilder.array([])
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
  }

  previous(){
    this.comparableIndustriesDetailsPrev.emit({status:'CTM'})
  }

  saveAndNext(){
    let industries;
      industries = this.formOneData?.industriesRatio;
      console.log(this.formOneData?.industriesRatio,"indutries ratio ")
    console.log(industries,"industries")
    this.comparableIndustriesDetails.emit({...this.comparableIndustries.value,status:'CTM',industries})
  }
}