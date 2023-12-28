import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { INDUSTRY_BASED_COMPANY } from 'src/app/shared/enums/constant';

@Component({
  selector: 'app-screen-input-details',
  templateUrl: './screen-input-details.component.html',
  styleUrls: ['./screen-input-details.component.scss']
})
export class ScreenInputDetailsComponent implements OnInit {
  @Input() step:any
  inputScreenForm:any;
  hasError=hasError;
  modelControl=groupModelControl;
  ciqIndustryData:any;
  ciqIndustryHead=['Company Id', 'Company Name', 'Industry id', 'Industry Description'];
  mapIndustryBasedCompany:any = INDUSTRY_BASED_COMPANY;

  constructor(
    private fb:FormBuilder,
    private ciqSpService:CiqSPService){}

  ngOnInit(){
    this.loadForm()
    this.loadCiqIndustry()
  }

  loadForm(){
    this.inputScreenForm = this.fb.group({
      industryL1:['', [Validators.required]],
      industryL2:['', [Validators.required]],
      industryL3:['', [Validators.required]],
      industryL4:['', [Validators.required]],
    })
  }

  saveAndNext(){

  }
  previous(){
  }

  loadCiqIndustry(){
    this.ciqSpService.getSPIndustryBasedCompany().subscribe((ciqIndustry:any)=>{
      if(ciqIndustry.status){
        this.ciqIndustryData = ciqIndustry?.data;
        console.log(this.ciqIndustryData,"industry data")
      }
    })
  }

  getKey(data:any){
    if(data){
      
    }
  }
}
