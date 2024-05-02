import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { saveAs } from 'file-saver';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { MODELS, REPORT_OBJECTIVE } from 'src/app/shared/enums/constant';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { StringModificationPipe } from 'src/app/shared/pipe/string-modification.pipe';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { hasError } from 'src/app/shared/enums/errorMethods';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { ExcelAndReportService } from 'src/app/shared/service/excel-and-report.service';


@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
  @Input() sixthStageInput:any;
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
  selectedReportPurpose:any=[];
  isDropdownOpen = false;
  formatType = 'PDF';
  constructor(private fb : FormBuilder,
    private calculationService:CalculationsService,
    private dialog:MatDialog,
    private snackBar:MatSnackBar,
    private dataReferenceService:DataReferencesService,
    private truncateStringPipe: StringModificationPipe,
    private ngxLoaderService:NgxUiLoaderService,
    private excelAdnReportService:ExcelAndReportService,
    private processStatusManagerService:ProcessStatusManagerService){}
    ngOnInit(): void {
    this.loadForm();
    this.checkProcessExist();
  }
  
  ngOnChanges(changes:SimpleChanges){
    this.transferStepperFour;
  }
  checkProcessExist(){
    if(!this.transferStepperFour){
      if(this.sixthStageInput?.formSixData){
        this.reportForm.controls['clientName'].setValue(this.sixthStageInput?.formSixData?.clientName);
        this.reportForm.controls['reportDate'].setValue(this.sixthStageInput?.formSixData?.reportDate);
        this.reportForm.controls['useExistingValuer'].setValue(this.sixthStageInput?.formSixData?.useExistingValuer);
        this.reportForm.controls['appointingAuthorityName'].setValue(this.sixthStageInput?.formSixData?.appointingAuthorityName);
        this.reportForm.controls['dateOfAppointment'].setValue(this.sixthStageInput?.formSixData?.dateOfAppointment);
        this.reportForm.controls['appointingAuthorityName'].setValue(this.sixthStageInput?.formSixData?.appointingAuthorityName);
        this.reportForm.controls['natureOfInstrument'].setValue(this.sixthStageInput?.formSixData?.natureOfInstrument);
        this.reportForm.controls['cinNumber'].setValue(this.sixthStageInput?.formSixData?.cinNumber);
        this.reportForm.controls['dateOfIncorporation'].setValue(this.sixthStageInput?.formSixData?.dateOfIncorporation);
        this.reportForm.controls['companyAddress'].setValue(this.sixthStageInput?.formSixData?.companyAddress);
        this.reportForm.controls['companyInfo'].setValue(this.sixthStageInput?.formSixData?.companyInfo);
        this.handleReportPurposeData()
        this.registeredValuerDetails.controls['registeredValuerName'].setValue(this.sixthStageInput?.formSixData?.registeredValuerName)
        this.registeredValuerDetails.controls['registeredValuerEmailId'].setValue(this.sixthStageInput?.formSixData?.registeredValuerEmailId)
        this.registeredValuerDetails.controls['registeredValuerIbbiId'].setValue(this.sixthStageInput?.formSixData?.registeredValuerIbbiId)
        this.registeredValuerDetails.controls['registeredValuerMobileNumber'].setValue(this.sixthStageInput?.formSixData?.registeredValuerMobileNumber)
        this.registeredValuerDetails.controls['registeredValuerQualifications'].setValue(this.sixthStageInput?.formSixData?.registeredValuerQualifications)
        this.registeredValuerDetails.controls['registeredValuerGeneralAddress'].setValue(this.sixthStageInput?.formSixData?.registeredValuerGeneralAddress)
      }
      this.transferStepperFour = this.sixthStageInput;
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
      companyInfo:['',[Validators.required]],
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

  onReportPurposeChange(event: any) {
    const selectedValue = event.value;
    if(!selectedValue.length) {
      return;
    };
    const onlyPurpose = selectedValue.map((element:any)=>{
      return element.value
    })
    this.fetchReportPurposeData(onlyPurpose);
  }

  generatePdfReport(formatType:any){
    this.formatType = formatType;
    const controls = this.getFilteredControls();
    const validatedReportForm = this.validateControls(controls);

    if (!validatedReportForm) {
      this.reportForm.markAllAsTouched();
      return;
    }

    if (this.reportPurposeDataChips.length === 0) {
      this.regulationPrefSelectionStatus = false;
      return;
    }

    this.reportGenerate = true;

    const approach = this.determineApproach();

    this.postReportData(approach);
  }

  previewReport(){
    const controls = this.getFilteredControls();
    const validatedReportForm = this.validateControls(controls);

    if (!validatedReportForm) {
      this.reportForm.markAllAsTouched();
      return;
    }

    if (this.reportPurposeDataChips.length === 0) {
      this.regulationPrefSelectionStatus = false;
      return;
    }

    this.reportGenerate = true;

    const approach = this.determineApproach();

    this.postReportPreviewData(approach);
  }

  getFilteredControls() {
    const controls = { ...this.reportForm.controls };
    const propertiesToRemove = ['clientName', 'dateOfIncorporation', 'companyAddress', 'cinNumber'];
    propertiesToRemove.forEach(property => delete controls[property]);
    return controls;
  }

  constructPayload() {
    this.reportForm.controls['reportSection'].setValue(this.reportPurposeDataChips);
    return {
      ...this.reportForm.value,
      ...this.registeredValuerDetails.value,
      reportPurpose:this.reportForm.controls['reportPurpose'].value.map((element:any)=>{return element.value}),
      reportId: this.transferStepperFour?.formFourData?.appData?.reportId || this.transferStepperFour?.formFourData?.appData?._id,
      reportDate: this.reportForm.controls['reportDate'].value,
      finalWeightedAverage: this.transferStepperFour?.formFiveData || this.transferStepperFour?.totalWeightageModel,
      processStateId: localStorage.getItem('processStateId')
    };
  }

  determineApproach() {
    const model = this.transferStepperFour?.formOneAndThreeData?.model;

    // if (model.includes('NAV') && model.length === 1) {
    //   return 'NAV';
    // }
    
    if ((model.includes('FCFF') || model.includes('FCFE')) && model.length === 1) {
      return 'DCF';
    }

    if ((model.includes('Relative_Valuation') || model.includes('CTM')) && model.length === 1) {
      return 'CCM';
    }

    return 'MULTI_MODEL';
  }

  postReportData(approach: string) {
    const reportService = this.constructConditionalReportFunctioning();
    const payload = this.constructPayload();
    this.excelAdnReportService.postReportData(payload).subscribe(
      (response: any) => {
        if (response) {
          reportService(response, approach);
        }
      },
      (error) => {
        this.reportGenerate = false;
        this.displayErrorSnackbar();
      }
    );
  }

  displayErrorSnackbar() {
    this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-error',
    });
  }

  constructConditionalReportFunctioning(){
    let reportService:any;
    switch (true) {
        case this.transferStepperFour?.formOneAndThreeData?.model.includes(MODELS.RULE_ELEVEN_UA):
          reportService = this.generateElevenUaReport.bind(this);
            break;
        case this.reportForm.controls['reportPurpose'].value.some((item:any)=> item?.value.includes('sebiRegulations')):
          reportService = this.generateSebiReport.bind(this);
            break;
        case this.transferStepperFour?.formOneAndThreeData?.model.includes(MODELS.NAV) && this.transferStepperFour?.formOneAndThreeData?.model.length === 1:
          reportService = this.generateNavReport.bind(this);
            break;
        default:
          reportService = this.generateBasicReport.bind(this);
    }
    return reportService;
  }

  constructConditionalPreviewReportFunctioning(){
    let reportService:any;
    switch (true) {
        case this.transferStepperFour?.formOneAndThreeData?.model.includes(MODELS.RULE_ELEVEN_UA):
            reportService = this.elevenUaPreviewReport.bind(this);
            break;
        case this.transferStepperFour?.formOneAndThreeData?.model.includes(MODELS.NAV) && this.transferStepperFour?.formOneAndThreeData?.model.length === 1:
            reportService = this.previewNavReport.bind(this);
            break;
        case this.reportForm.controls['reportPurpose'].value.some((item:any)=> item?.value.includes('sebiRegulations')):
            reportService = this.previewSebiReport.bind(this);
            break;
        default:
            reportService = this.basicReportPreview.bind(this);
    }
    return reportService;
  }
  

  postReportPreviewData(approach: string) {
    const reportService = this.constructConditionalPreviewReportFunctioning()
    const payload = this.constructPayload();
    this.excelAdnReportService.postReportData(payload).subscribe(
        (response: any) => {
          if (response) {
            reportService(response, approach);
          }
        },
        (error) => {
          this.reportGenerate = false;
          this.displayErrorSnackbar();
        }
    );
}
  
  onSlideToggleChange(event?: any) {
    if (event) {
      if(!event.checked){
          this.registeredValuerDetails.reset();
          this.reportForm.controls['useExistingValuer'].setValue(false);
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
          this.reportForm.controls['useExistingValuer'].setValue(false);
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
    if (value) {
      this.reportPurposeDataChips.push(value);
      this.regulationPrefSelectionStatus = true;
    }

    event.chipInput!.clear();
  }

  remove(sectionIndex: any): void {
    if (sectionIndex >= 0) {
      this.reportPurposeDataChips.splice(sectionIndex, 1);
    }
  }

  selected(event:any): void {
    const checkIfExist = this.reportPurposeDataChips.indexOf(`${event.option.viewValue}`);
    if(checkIfExist === -1){
      this.reportPurposeDataChips.push(event.option.viewValue);
      this.regulationPrefSelectionStatus = true;
      this.purposeInput.nativeElement.value = '';
    }
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

    elevenUaPreviewReport(response:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.previewElevenUaReport(response).subscribe((reportData:any)=>{
        this.reportGenerate = false;
        if (reportData) {
          const dataSet={
            value: 'previewDoc',
            dataBlob:reportData,
            reportId: response,
            companyName:this.transferStepperFour?.formOneAndThreeData?.company
          }
          const dialogRef =  this.dialog.open(GenericModalBoxComponent, {data:dataSet,width:'80%',disableClose: true});
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:false,valuationReportId:response,valuationResultId:reportId},
            step:5
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
    
    previewNavReport(response:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.previewNavReport(response).subscribe((reportData:any)=>{
        this.reportGenerate = false;
        if (reportData) {
          const dataSet={
            value: 'previewDoc',
            dataBlob:reportData,
            reportId: response,
            companyName:this.transferStepperFour?.formOneAndThreeData?.company
          }
          const dialogRef =  this.dialog.open(GenericModalBoxComponent, {data:dataSet,width:'80%',disableClose: true});
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:false,valuationReportId:response,valuationResultId:reportId},
            step:5
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

    basicReportPreview(response:any, approach:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.previewReport(response,approach).subscribe((reportData:any)=>{
        this.reportGenerate = false;
        if (reportData) {
          const dataSet={
            value: 'previewDoc',
            dataBlob:reportData,
            reportId: response,
            companyName:this.transferStepperFour?.formOneAndThreeData?.company
          }
          const dialogRef =  this.dialog.open(GenericModalBoxComponent, {data:dataSet,width:'80%',disableClose: true});
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:false,valuationReportId:response,valuationResultId:reportId},
            step:5
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

    generateElevenUaReport(response:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.generateElevenUaReport(response, this.formatType).subscribe((reportData:any)=>{
        if (reportData instanceof Blob) {
          this.reportGenerate = false;
          this.snackBar.open('Report generated successfully', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'app-notification-success',
          });
          if(this.formatType === 'PDF'){
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.pdf`);
          }else{
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.docx`);
          }
          localStorage.setItem('stepSixStats','true')
          this.calculationService.checkStepStatus.next({status:true})
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:true,valuationReportId:response,valuationResultId:reportId},
            step:5
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

    generateBasicReport(response:any, approach:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.generateReport(response, approach, this.formatType).subscribe((reportData:any)=>{
        if (reportData instanceof Blob) {
          this.reportGenerate = false;
          this.snackBar.open('Report generated successfully', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'app-notification-success',
          });
          if(this.formatType === 'PDF'){
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.pdf`);
          }
          else{
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.docx`);
          }
          localStorage.setItem('stepSixStats','true')
          this.calculationService.checkStepStatus.next({status:true})
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:true,valuationReportId:response,valuationResultId:reportId},
            step:5
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

    generateNavReport(response:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.generateNavReport(response, this.formatType).subscribe((reportData:any)=>{
        if (reportData instanceof Blob) {
          this.reportGenerate = false;
          this.snackBar.open('Nav report generated successfully', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'app-notification-success',
          });
          if(this.formatType === 'PDF'){
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.pdf`);
          }else{
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.docx`);
          }
          localStorage.setItem('stepSixStats','true')
          this.calculationService.checkStepStatus.next({status:true})
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:true,valuationReportId:response,valuationResultId:reportId},
            step:5
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

    generateSebiReport(response:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.generateSebiReport(response, this.formatType).subscribe((reportData:any)=>{
        this.reportGenerate = false;
        if (reportData instanceof Blob) {
          this.snackBar.open('Report generated successfully', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'app-notification-success',
          });
          if(this.formatType === 'PDF'){
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.pdf`);
          }
          else{
            saveAs(reportData, `${this.transferStepperFour?.formOneAndThreeData?.company}.docx`);
          }
          localStorage.setItem('stepSixStats','true')
          this.calculationService.checkStepStatus.next({status:true})
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:true,valuationReportId:response,valuationResultId:reportId},
            step:5
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


    previewSebiReport(response:any){
      const payload = this.constructPayload();
      this.excelAdnReportService.previewSebiReport(response).subscribe((reportData:any)=>{
        this.reportGenerate = false;
        if (reportData) {
          const dataSet={
            value: 'previewDoc',
            dataBlob:reportData,
            reportId: response,
            companyName:this.transferStepperFour?.formOneAndThreeData?.company
          }
          const dialogRef =  this.dialog.open(GenericModalBoxComponent, {data:dataSet,width:'80%',disableClose: true});
          const {reportId,...rest} = payload;
          const processStateModel ={
            sixthStageInput:{...rest,formFillingStatus:false,valuationReportId:response,valuationResultId:reportId},
            step:5
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

    clearInput(controlName:string){
      this.reportForm.controls[controlName].setValue('');
    }

    handleReportPurposeData() {
      if (this.sixthStageInput?.formSixData?.reportSection) {
        this.reportForm.controls['reportSection'].setValue(this.sixthStageInput?.formSixData?.reportSection);
        this.reportPurposeDataChips = this.sixthStageInput?.formSixData?.reportSection;
      }

      if (this.sixthStageInput?.formSixData?.reportPurpose) {
        const actualReportPurpose = this.sixthStageInput?.formSixData?.reportPurpose || [];
        this.selectedReportPurpose = this.modelControl.reportDetails.options.reportPurpose.filter((allReportPurpose: any) => {
          return actualReportPurpose.includes(allReportPurpose.value);
        });
        this.fetchReportPurposeData(actualReportPurpose);
      }
    }
    
    fetchReportPurposeData(reportPurpose: string[]) {
      this.dataReferenceService.getMultiplePurpose(reportPurpose.join(',')).subscribe(
        (reportPurposeData: any) => {
          this.reportPurposeData = reportPurposeData?.reportPurposes;
          this.reComputeSectionPreference();
        },
        (error) => {
          this.handleReportPurposeError(error);
        }
      );
    }

    reComputeSectionPreference(){
      if (this.reportPurposeData.length) {
        const newReportSections = [...this.reportPurposeDataChips];
        const updatedReportPurposeDataChips = [];
        
        for (const indReportSections of newReportSections) {
            const checkIfSelectedPurposeExist = this.reportPurposeData.findIndex((element: any) => indReportSections.includes(element.Description));
            
            if (checkIfSelectedPurposeExist !== -1) {
                updatedReportPurposeDataChips.push(indReportSections);
            }
        }
        
        this.reportPurposeDataChips = updatedReportPurposeDataChips;
    }
    }
    
    handleReportPurposeError(error: any) {
      this.snackBar.open(`Backend error - Purpose for ${this.sixthStageInput?.formSixData?.reportPurpose} not found`, 'Ok', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      });
    }
  
    comparerReportPurpose(o1: any, o2: any): boolean {
      return o1 && o2 ? o1?.name  === o2?.name  : o2 === o2;
    }
}
