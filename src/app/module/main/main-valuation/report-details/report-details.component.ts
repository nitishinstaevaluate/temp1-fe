import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { saveAs } from 'file-saver';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { REPORT_OBJECTIVE } from 'src/app/shared/enums/constant';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { StringModificationPipe } from 'src/app/shared/pipe/string-modification.pipe';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';


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
  @Input() fifthStageInput:any;
  @Output() previousPage=new EventEmitter<any>();
  @ViewChild('purposeInput') purposeInput!: ElementRef<any>;
   viewer:any;

   hasError = hasError;
  shouldShowReportPurpose=false;
  reportPurposeData:any=[];
  reportObjectives:any= REPORT_OBJECTIVE

  isLoading=false;
  regulationPrefSelectionStatus=true;
  reportObjective='';
  reportPurposeDataChips:any=[];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  reportGenerate = false;
  
  constructor(private fb : FormBuilder,
    private calculationService:CalculationsService,
    private dialog:MatDialog,
    private snackBar:MatSnackBar,
    private dataReferenceService:DataReferencesService,
    private truncateStringPipe: StringModificationPipe,
    private ngxLoaderService:NgxUiLoaderService,
    private processStatusManagerService:ProcessStatusManagerService){}
  ngOnInit(): void {
    this.loadForm();
    this.checkProcessExist()
    this.onValueChangeControl()
  }
  
  ngOnChanges(changes:SimpleChanges){
    this.transferStepperFour;
  }
  checkProcessExist(){
    if(!this.transferStepperFour){
      if(this.fifthStageInput?.formFiveData){
        this.reportForm.controls['clientName'].setValue(this.fifthStageInput?.formFiveData?.clientName);
        this.reportForm.controls['reportDate'].setValue(this.fifthStageInput?.formFiveData?.reportDate);
        this.reportForm.controls['useExistingValuer'].setValue(this.fifthStageInput?.formFiveData?.useExistingValuer);
        this.reportForm.controls['appointingAuthorityName'].setValue(this.fifthStageInput?.formFiveData?.appointingAuthorityName);
        this.reportForm.controls['dateOfAppointment'].setValue(this.fifthStageInput?.formFiveData?.dateOfAppointment);
        this.reportForm.controls['appointingAuthorityName'].setValue(this.fifthStageInput?.formFiveData?.appointingAuthorityName);
        this.reportForm.controls['natureOfInstrument'].setValue(this.fifthStageInput?.formFiveData?.natureOfInstrument);
        this.reportForm.controls['cinNumber'].setValue(this.fifthStageInput?.formFiveData?.cinNumber);
        this.reportForm.controls['dateOfIncorporation'].setValue(this.fifthStageInput?.formFiveData?.dateOfIncorporation);
        this.reportForm.controls['companyAddress'].setValue(this.fifthStageInput?.formFiveData?.companyAddress);
        if(this.fifthStageInput?.formFiveData?.reportPurpose){
          this.reportForm.controls['reportPurpose'].setValue(this.fifthStageInput?.formFiveData?.reportPurpose);
          this.dataReferenceService.getReportPurpose(this.fifthStageInput?.formFiveData?.reportPurpose).subscribe((reportPurposeData:any)=>{
            this.reportPurposeData = reportPurposeData?.reportPurpose;
            this.reportObjective = this.reportObjectives[`${this.fifthStageInput?.formFiveData?.reportPurpose}`];
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
        }
        if(this.fifthStageInput?.formFiveData?.reportSection){
          this.reportPurposeDataChips = this.fifthStageInput?.formFiveData?.reportSection
          this.reportForm.controls['reportSection'].setValue(this.fifthStageInput?.formFiveData?.reportSection);
        }
        this.registeredValuerDetails.controls['registeredValuerName'].setValue(this.fifthStageInput?.formFiveData?.registeredValuerName)
        this.registeredValuerDetails.controls['registeredValuerEmailId'].setValue(this.fifthStageInput?.formFiveData?.registeredValuerEmailId)
        this.registeredValuerDetails.controls['registeredValuerIbbiId'].setValue(this.fifthStageInput?.formFiveData?.registeredValuerIbbiId)
        this.registeredValuerDetails.controls['registeredValuerMobileNumber'].setValue(this.fifthStageInput?.formFiveData?.registeredValuerMobileNumber)
        this.registeredValuerDetails.controls['registeredValuerQualifications'].setValue(this.fifthStageInput?.formFiveData?.registeredValuerQualifications)
        this.registeredValuerDetails.controls['registeredValuerGeneralAddress'].setValue(this.fifthStageInput?.formFiveData?.registeredValuerGeneralAddress)
      }
      this.transferStepperFour = this.fifthStageInput;
    }
  }
  ngAfterViewInit(): void {}

  loadForm(){
    this.reportForm = this.fb.group({
      clientName:['',[Validators.required]],
      reportDate:['',[Validators.required]],
      useExistingValuer:[false,[Validators.required]],
      appointingAuthorityName:['',[Validators.required]],
      dateOfAppointment:['',[Validators.required]],
      reportPurpose:['',[Validators.required]],
      natureOfInstrument:['',[Validators.required]],
      reportSection:[[],[Validators.required]],
      cinNumber:['',[Validators.required]],
      dateOfIncorporation:['',[Validators.required]],
      companyAddress:['',[Validators.required]],
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
          this.reportPurposeDataChips=[]
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
    const controls = {...this.reportForm.controls}
    delete controls.clientName;
    delete controls.dateOfIncorporation;
    delete controls.companyAddress;
    delete controls.cinNumber;
    const validatedReportForm = this.validateControls(controls);
    if(!validatedReportForm){
        this.reportForm.markAllAsTouched();
        return;
    }
    if(this.reportPurposeDataChips.length === 0){
      this.regulationPrefSelectionStatus = false;
      return;
    }
    this.reportGenerate = true;
    const payload = {
      ...this.reportForm.value,
      ...this.registeredValuerDetails.value,
      reportId:this.transferStepperFour?.formThreeData?.appData?.reportId,
      reportDate:this.reportForm.controls['reportDate'].value,
      finalWeightedAverage:this.transferStepperFour?.formFourData || this.transferStepperFour?.totalWeightageModel 
    }
    const approach = (this.transferStepperFour?.formOneAndTwoData?.model.includes('NAV')) && this.transferStepperFour.formOneAndTwoData.model.length === 1? 'NAV' : (this.transferStepperFour?.formOneAndTwoData?.model.includes('FCFF') || this.transferStepperFour?.formOneAndTwoData?.model.includes('FCFE')) && this.transferStepperFour.formOneAndTwoData.model.length === 1 ? 'DCF' : ((this.transferStepperFour?.formOneAndTwoData?.model.includes('Relative_Valuation') || this.transferStepperFour?.formOneAndTwoData?.model.includes('CTM')) && this.transferStepperFour.formOneAndTwoData.model.length === 1) ? 'CCM' : 'MULTI_MODEL';
    
    this.calculationService.postReportData(payload).subscribe((response:any)=>{
      if(response){
        this.calculationService.generateReport(response,approach).subscribe((reportData:any)=>{
          if (reportData instanceof Blob) {
            this.reportGenerate = false;
            this.snackBar.open('Report generated successfully', 'OK', {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 2000,
              panelClass: 'app-notification-success',
            });
            saveAs(reportData, `${this.transferStepperFour?.formOneAndTwoData?.company}.pdf`);
            localStorage.setItem('stepFiveStats','true')
            this.calculationService.checkStepStatus.next({status:true})
            const {reportId,...rest} = payload;
            const processStateModel ={
              fifthStageInput:{...rest,formFillingStatus:true,valuationReportId:response,valuationResultId:reportId},
              step:4
            }
            this.processStateManager(processStateModel,localStorage.getItem('processStateId'))
        }
        },
        (error)=>{
          this.reportGenerate = false;
          this.snackBar.open('Something went wrong', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'app-notification-error',
          });
        })
      }
    },
    (error)=>{
      this.reportGenerate = false;
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
  }

  previewReport(){
    const controls = {...this.reportForm.controls}
    delete controls.clientName;
    const validatedReportForm = this.validateControls(controls);
    if(!validatedReportForm){
        this.reportForm.markAllAsTouched();
        return;
    }
    if(this.reportPurposeDataChips.length === 0){
      this.regulationPrefSelectionStatus = false;
      return;
    }
    
    this.reportGenerate = true;
    const payload = {
      ...this.reportForm.value,
      ...this.registeredValuerDetails.value,
      reportId:this.transferStepperFour?.formThreeData?.appData?.reportId,
      reportDate:this.reportForm.controls['reportDate'].value,
      finalWeightedAverage:this.transferStepperFour?.formFourData || this.transferStepperFour?.totalWeightageModel
    }
    const approach = (this.transferStepperFour?.formOneAndTwoData?.model.includes('NAV')) && this.transferStepperFour.formOneAndTwoData.model.length === 1? 'NAV' : (this.transferStepperFour?.formOneAndTwoData?.model.includes('FCFF') || this.transferStepperFour?.formOneAndTwoData?.model.includes('FCFE')) && this.transferStepperFour.formOneAndTwoData.model.length === 1 ? 'DCF' : ((this.transferStepperFour?.formOneAndTwoData?.model.includes('Relative_Valuation') || this.transferStepperFour?.formOneAndTwoData?.model.includes('CTM')) && this.transferStepperFour.formOneAndTwoData.model.length === 1) ? 'CCM' : 'MULTI_MODEL';
    this.calculationService.postReportData(payload).subscribe((response:any)=>{
      if(response){
        this.calculationService.previewReport(response,approach).subscribe((reportData:any)=>{
          if (reportData) {
            const dataSet={
              value: 'previewDoc',
              dataBlob:reportData,
              reportId: response,
              companyName:this.transferStepperFour?.formOneAndTwoData?.company
            }
            const dialogRef =  this.dialog.open(GenericModalBoxComponent, {data:dataSet,width:'80%',disableClose: true});
            this.reportGenerate = false;
            const {reportId,...rest} = payload;
            const processStateModel ={
              fifthStageInput:{...rest,formFillingStatus:false,valuationReportId:response,valuationResultId:reportId},
              step:4
            }
            this.processStateManager(processStateModel,localStorage.getItem('processStateId'))
        }
        },
        (error)=>{
          this.reportGenerate = false;
          this.snackBar.open('Something went wrong', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'app-notification-error',
          });
        })
      }
    },
    (error)=>{
      this.reportGenerate = false;
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
      });
    })
  }
  
  onSlideToggleChange(event?: any) {
    if (event) {
      if(!event.checked){
          this.registeredValuerDetails.reset();
          this.reportForm.controls['useExistingValuer'].reset();
          return;
      }
      const data = {
        data: {
          value:'registeredValuerDetails'
        }
      };
      const dialogRef = this.dialog.open(GenericModalBoxComponent, {data:data,width: '50%',height:'55%'});
  
      dialogRef.afterClosed().subscribe((result:any) => {
  
        if (result) {
          this.registeredValuerDetails.patchValue(result);
          this.reportForm.controls['useExistingValuer'].setValue(true);
          this.snackBar.open('Valuer added successfully', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success',
          });
        } else {
          this.registeredValuerDetails.reset();
          this.reportForm.controls['useExistingValuer'].reset();
          this.snackBar.open('Valuer was not added', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-error',
          });
        }
      });
    }
    else{
      const data = {
        data: {
          ...this.registeredValuerDetails.value,
          value:'registeredValuerDetails'
        },
       
      };
      const dialogRef = this.dialog.open(GenericModalBoxComponent, {data:data,width: '50%'});
  
      dialogRef.afterClosed().subscribe((result:any) => {
  
        if (result) {
          this.registeredValuerDetails.patchValue(result);
          this.reportForm.controls['useExistingValuer'].setValue(true);
          this.snackBar.open('Valuer added successfully', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-success',
          });
        } 
      });
    }
  }

  previous(){
    this.previousPage.emit(true)
  }

  add(event: any): void {
    const value = (event.value || '').trim();
    let emptySection = [];
    if (value) {
      const truncatedString = this.truncateStringPipe.transform(value,30);
      this.reportPurposeDataChips.push(truncatedString);
      this.regulationPrefSelectionStatus = true;
      const reportSectionValue:any = this.reportForm.controls['reportSection'].value;
      emptySection.push(value);
      this.reportForm.controls['reportSection'].setValue([...this.reportForm.controls['reportSection'].value,...emptySection]);
    }

    event.chipInput!.clear();
  }

  remove(sectionIndex: any): void {
    if (sectionIndex >= 0) {
      this.reportPurposeDataChips.splice(sectionIndex, 1);
      const reportSectionValue = this.reportForm.controls['reportSection'].value;
      reportSectionValue.splice(sectionIndex,1)
      this.reportForm.controls['reportSection'].setValue(reportSectionValue);
    }
  }

  selected(event:any): void {
    let emptySection = [];
    let truncatedString; 
    if(event.option.viewValue.length > 10){
       truncatedString = this.truncateStringPipe.transform(event.option.viewValue,30)
    }

    this.reportPurposeDataChips.push(truncatedString !== '' ? truncatedString : event.option.viewValue);
    this.regulationPrefSelectionStatus = true;
    this.purposeInput.nativeElement.value = '';
    emptySection.push(event.option.viewValue);
    this.reportForm.controls['reportSection'].setValue([...this.reportForm.controls['reportSection'].value,...emptySection]);
  }

  validateControls(controlArray: { [key: string]: FormControl }){
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
      return allControlsFilled
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
