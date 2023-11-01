import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { saveAs } from 'file-saver';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { REPORT_OBJECTIVE } from 'src/app/shared/enums/constant';


@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit,AfterViewInit {
  floatLabelType:any='never';
  modelControl:any = groupModelControl;
  reportForm:any=FormGroup;
  registeredValuerDetails:any=FormGroup;
  appointeeDetails:any=FormGroup;

  @Input() transferStepperFour:any;
  @Output() previousPage=new EventEmitter<any>();
   viewer:any 

  shouldShowReportPurpose=false;
  reportPurposeData:any=[];
  reportObjectives:any= REPORT_OBJECTIVE

  isLoading=false;
  reportObjective='';
  
  constructor(private fb : FormBuilder,
    private calculationService:CalculationsService,
    private dialog:MatDialog,
    private snackBar:MatSnackBar,
    private dataReferenceService:DataReferencesService){}
  ngOnInit(): void {
    this.loadForm();
    this.onValueChangeControl()
  }
  

  ngOnChanges(changes:SimpleChanges){
    this.transferStepperFour
  }
  ngAfterViewInit(): void {

    
  }

  loadForm(){
    this.reportForm = this.fb.group({
      clientName:['',[Validators.required]],
      reportDate:['',[Validators.required]],
      useExistingValuer:[false,[Validators.required]],
      appointingAuthorityName:['',[Validators.required]],
      dateOfAppointment:['',[Validators.required]],
      reportPurpose:['',[Validators.required]],
      natureOfInstrument:['',[Validators.required]],
      reportSection:['',[Validators.required]],
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

  onValueChangeControl(){
    this.reportForm.controls['reportPurpose'].valueChanges.subscribe((value:any)=>{
      if(!value) return;
      this.dataReferenceService.getReportPurpose(value).subscribe((reportPurposeData:any)=>{
        this.reportPurposeData = reportPurposeData?.reportPurpose;
        this.reportObjective = this.reportObjectives[`${value}`];
        if(this.reportPurposeData.length>0){
          this.shouldShowReportPurpose=true;
        }
        else{
          this.shouldShowReportPurpose=false;
        }
      },
      (error)=>{
        this.shouldShowReportPurpose=false;
      })
    })
  }


  generateReport(){
  const dataSet={
    data: 'previewDoc',
    width:'55%',
    height:'80%'
  }
   const dialogRef =  this.dialog.open(GenericModalBoxComponent, dataSet);
    dialogRef.afterClosed().subscribe((result)=>{
      // if (result) {
      //   this.fcfeForm.controls['expMarketReturn'].patchValue(parseInt(result?.analystConsensusEstimates))
      //   this.snackBar.open('Analyst Estimation Added','OK',{
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'app-notification-success'
      //   })
      // } else {
      //   this.fcfeForm.controls['expMarketReturnType'].reset();
      //   this.snackBar.open('Expected Market Return Not Saved','OK',{
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'app-notification-error'
      //   })
      // }
    })
  }
  
  onSlideToggleChange(event: any) {
    if (event) {
      const data = {
        data: 'registeredValuerDetails',
        width: '50%',
      };
      const dialogRef = this.dialog.open(GenericModalBoxComponent, data);
  
      dialogRef.afterClosed().subscribe((result:any) => {
  
        if (result) {
          this.registeredValuerDetails.patchValue(result);
          this.reportForm.controls['useExistingValuer'].setValue(true);
          this.snackBar.open('Valuer added successfully', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success',
          });
        } else {
          this.registeredValuerDetails.reset();
          this.reportForm.controls['useExistingValuer'].reset();
          this.snackBar.open('Valuer was not added', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-error',
          });
        }
      });
    }
  }

  previous(){
    this.previousPage.emit(true)
  }
}
