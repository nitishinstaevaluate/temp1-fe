import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculationsService } from 'src/app/shared/service/calculations.service';


@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  floatLabelType:any='never';
  modelControl:any = groupModelControl;
  reportForm:any=FormGroup;
  registeredValuerDetails:any=FormGroup;
  @Input() transferStepperFour:any;
  
  constructor(private fb : FormBuilder,private calculationService:CalculationsService){}
  ngOnInit(): void {
    this.loadForm();
  }

  ngOnChanges(changes:SimpleChanges){
    this.transferStepperFour
  }

  loadForm(){
    this.reportForm = this.fb.group({
      clientName:['',[Validators.required]],
      reportDate:['',[Validators.required]],
      useExistingValuer:[true,[Validators.required]]
    })
    this.registeredValuerDetails=this.fb.group({
      registeredValuerName:['',[Validators.required]],
      registeredValuerEmailId:['',[Validators.required]],
      registeredValuerIbbiId:['',[Validators.required]],
      registeredValuerMobileNumber:['',[Validators.required]],
      registeredValuerGeneralAddress:['',[Validators.required]],
      registeredValuerCorporateAddress:['',[Validators.required]],
      registeredvaluerDOIorConflict:['',[Validators.required]],
      registeredValuerQualifications:['',[Validators.required]],
    })
  }


  generateReport(){
    const payload = {
      ...this.reportForm.value,
      ...this.registeredValuerDetails.value,
      reportId:this.transferStepperFour?.formThreeData?.appData?.reportId,
      
    }
    
    console.log(payload,"final response")
    this.calculationService.postReportData(payload).subscribe((response:any)=>{
      if(response.status){
        this.calculationService.generateReport(response.id).subscribe((reportData:any)=>{
          if(reportData.status){
            // console.log("generated successfully")
          }
        })
      }
    })
  }
}
