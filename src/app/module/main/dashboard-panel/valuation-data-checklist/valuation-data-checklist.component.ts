import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GET_TEMPLATE } from 'src/app/shared/enums/functions';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { REPORT_OBJECTIVE, helperText } from 'src/app/shared/enums/constant';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { UtilService } from 'src/app/shared/service/util.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, throttleTime } from 'rxjs';
import { hasError } from 'src/app/shared/enums/errorMethods';

@Component({
  selector: 'app-valuation-data-checklist',
  templateUrl: './valuation-data-checklist.component.html',
  styleUrls: ['./valuation-data-checklist.component.scss']
})
export class ValuationDataChecklistComponent implements OnInit{
  modelControl = groupModelControl;
  files:any=[];
  excelSheetId:any;
  fileName:any;
  dataCheckListForm:any;
  reportPurposeData:any=[];
  reportPurposeDataChips:any=[];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  reportObjectives:any= REPORT_OBJECTIVE;
  reportObjective:any='';
  loader = false;
  helperText = helperText;
  companyInput=false;
  companyQuery:any;
  searchByCompanyName = new Subject<string>();
  options:any=[];
  companyListLoader=false;
  hasError = hasError;
  showSectionError = false;
  constructor(private valuationService:ValuationService,
  private snackBar:MatSnackBar,
  private fb: FormBuilder,
  private dataReferenceService: DataReferencesService,
  private snackbar: MatSnackBar,
  private utilService: UtilService,
  private router: Router){this.loadFormControl()}

  ngOnInit(){
    this.onValueChangeControl();
    this.searchByCompanyName.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      throttleTime(600),
      switchMap(async () => this.fetchCompanyNames())
    ).subscribe();
  }

  loadFormControl(){
    this.dataCheckListForm = this.fb.group({
      company:['',Validators.required],
      reportingUnit:['',Validators.required],
      valuationDate:['',Validators.required],
      taxRate:['',Validators.required],
      outstandingShares:['',Validators.required],
      dateOfReport:['',Validators.required],
      appointingAuthority:['',Validators.required],
      cinNumber:['',Validators.required],
      dateOfIncorporation:['',Validators.required],
      companyName:['',Validators.required],
      companyAddress:['',Validators.required],
      dateOfAppointment:['',Validators.required],
      natureOfInstrument:['',Validators.required],
      purposeOfReport:['',Validators.required],
      companyInfo:['',Validators.required],
      section:['',Validators.required],
    })
  }

  get downloadTemplate() {
    return GET_TEMPLATE('1', 'default');
  }

  onFileSelected(event: any) {
    if (event && event.target.files && event.target.files.length > 0) {
      this.files = event.target.files;
      this.fileName = this.files[0].name;
    }
  
    if (this.files.length === 0) {
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.files[0]);
    this.valuationService.fileUpload(formData).subscribe((res: any) => {
      this.excelSheetId = res.excelSheetId;
      if(res.excelSheetId){
        this.snackBar.open('File has been uploaded successfully','Ok',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      }
      
      event.target.value = '';
    });
  }

  remove(sectionIndex: any): void {
    if (sectionIndex >= 0) {
      this.reportPurposeDataChips.splice(sectionIndex, 1);
      const reportSectionValue = this.dataCheckListForm.controls['section'].value;
      reportSectionValue.splice(sectionIndex,1)
      this.dataCheckListForm.controls['section'].setValue(reportSectionValue);
    }
  }

  selected(event:any): void {
    let emptySection = [];

    this.reportPurposeDataChips.push(event.option.viewValue);
    emptySection.push(event.option.viewValue);
    this.dataCheckListForm.controls['section'].setValue([...this.dataCheckListForm.controls['section'].value,...emptySection]);
  }

  add(event: any): void {
    const value = (event.value || '').trim();
    let emptySection = [];
    if (value) {
      this.reportPurposeDataChips.push(value);
      const reportSectionValue:any = this.dataCheckListForm.controls['section'].value;
      emptySection.push(value);
      this.dataCheckListForm.controls['section'].setValue([...this.dataCheckListForm.controls['section'].value,...emptySection]);
    }

    event.chipInput!.clear();
  }

  onValueChangeControl(){
    this.dataCheckListForm.controls['purposeOfReport'].valueChanges.subscribe((value:any)=>{
      if(!value.length) {
        this.dataCheckListForm.controls['section'].setValue([]);
        this.reportPurposeData = [];
        return;
      };
      this.dataReferenceService.getMultiplePurpose(value).subscribe((reportPurposeData:any)=>{
        this.reportPurposeData = reportPurposeData?.reportPurposes;
        if(this.reportPurposeData?.length){
          this.reportPurposeDataChips=[];
          this.dataCheckListForm.controls['section'].setValue([]);
        }
        // else{
        //   this.snackbar.open(`purpose for ${value} not found`, 'Ok',{
        //     horizontalPosition: 'right',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'app-notification-error'
        //   })
        // }
      },
      (error)=>{
        this.snackbar.open(`backend error - purpose for ${value} not found`, 'Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      })
    })
  }

  clearInput(controlName:string){
    this.dataCheckListForm.controls[controlName].setValue('');
  }

  submiDataCheckListForm(){
    const controls = this.getFilteredControls()
    const validatedReportForm = this.validateControls(controls);

    if (!validatedReportForm) {
      this.dataCheckListForm.markAllAsTouched();
    }
    if(!this.reportPurposeData?.length){
      this.showSectionError = true;
    }

    this.loader = true; 
    const lastUrlSegment = this.router.url.split('/').pop();

    const companyDetails = {
      companyId: this.fetchCompanyId()?.companyId,
      companyType: this.fetchCompanyId()?.companyTypeId
    }
    this.utilService.postDataChecklistDetails(lastUrlSegment, {...this.dataCheckListForm.value,excelSheetId:this.excelSheetId, ...companyDetails}).subscribe((response:any)=>{
      this.loader = false;
      if(response.status){
        this.snackbar.open('Data Checklist updated successfully', 'Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
        
      }
      else{
        this.snackbar.open('Data checklist not updated', 'Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },(error)=>{
      this.loader = false;
      this.snackbar.open('Backend error - data checklist updation failed', 'Ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }

  companyInputFocused(){
    this.companyInput = true;
  }

  companyInputBlurred(){
    this.companyInput = false;
  }

  filterByBusinessDescriptor(event:any){
    if(event.target.value && this.companyQuery !== event.target.value){
      this.companyQuery = event.target.value;
      this.searchByCompanyName.next(this.companyQuery);
    }
  }
  
  onOptionSelection(event:any){
    if(event?.option?.value){
      this.companyQuery = event.option.value;
      this.fetchCompanyNames();
    }
  }

  displayFn(value: string): string {
    return value || '';
  }

  fetchCompanyNames(){
    this.companyListLoader = true
    this.utilService.fuzzySearchCompanyName(this.companyQuery).subscribe((data:any)=>{
      this.companyListLoader = false
      if(data?.companyDetails?.length){
        this.options = data.companyDetails;
      }
      // else{
      //   this.snackBar.open('Company not found', 'Ok',{
      //     horizontalPosition: 'right',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'app-notification-error',
      //   })
      // }
    },(error)=>{
      this.companyListLoader = false
      this.snackBar.open('Backend error - company details not found', 'Ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error',
      })
    })
  }

  fetchCompanyId(){
    const foundElement = this.options.find((element: any) => {
      return element.COMPANYNAME === this.dataCheckListForm.controls['company'].value;
    });
    
    if (foundElement) {
        return {
            companyId: foundElement.COMPANYID,
            companyTypeId: '6598f0370b042902bcf9b7fb' // hardcoded company type as public company
        };
    }
    
    return null;
  }

  validateControls(controlArray: { [key: string]: FormControl }){
    let allControlsFilled = true;
      for (const controlName in controlArray) {
        if (controlArray.hasOwnProperty(controlName)) {
          const control = controlArray[controlName];
          if (control.value === null || control.value === '' || !control.value?.length) {
            allControlsFilled = false;
            break;
          }
         
        }
      }
      return allControlsFilled
    }

    getFilteredControls() {
      const controls = { ...this.dataCheckListForm.controls };
      const propertiesToRemove = ['section'];
      propertiesToRemove.forEach(property => delete controls[property]);
      return controls;
    }
}
