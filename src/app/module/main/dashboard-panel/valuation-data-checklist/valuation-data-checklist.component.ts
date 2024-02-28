import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GET_TEMPLATE } from 'src/app/shared/enums/functions';
import { ValuationService } from 'src/app/shared/service/valuation.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { REPORT_OBJECTIVE } from 'src/app/shared/enums/constant';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { UtilService } from 'src/app/shared/service/util.service';
import { Router } from '@angular/router';

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
  constructor(private valuationService:ValuationService,
  private snackBar:MatSnackBar,
  private fb: FormBuilder,
  private dataReferenceService: DataReferencesService,
  private snackbar: MatSnackBar,
  private utilService: UtilService,
  private router: Router){this.loadFormControl()}

  ngOnInit(){
    this.onValueChangeControl()
  }

  loadFormControl(){
    this.dataCheckListForm = this.fb.group({
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
    this.loader = true; 
    const lastUrlSegment = this.router.url.split('/').pop();

    this.utilService.postDataChecklistDetails(lastUrlSegment, this.dataCheckListForm.value).subscribe((response:any)=>{
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

}
