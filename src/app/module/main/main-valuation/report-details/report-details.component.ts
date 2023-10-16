import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { saveAs } from 'file-saver';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


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
  appointeeDetails:any=FormGroup;
  @Input() transferStepperFour:any;
  @Output() previousPage=new EventEmitter<any>();

  isLoading=false;
  
  constructor(private fb : FormBuilder,private calculationService:CalculationsService,private dialog:MatDialog,private snackBar:MatSnackBar){}
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
      useExistingValuer:[false,[Validators.required]],
      appointingAuthorityName:['',[Validators.required]],
      dateOfAppointment:['',[Validators.required]]
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
    this.isLoading=true;
    const payload = {
      ...this.reportForm.value,
      ...this.registeredValuerDetails.value,
      reportId:this.transferStepperFour?.formThreeData?.appData?.reportId,
      reportDate:this.reportForm.controls['reportDate'].value
    }
    this.calculationService.postReportData(payload).subscribe((response:any)=>{
      if(response){
        this.calculationService.generateReport(response).subscribe((reportData:any)=>{
          if (reportData instanceof Blob) {
            this.isLoading=false;
            this.snackBar.open('Report generated successfully', 'OK', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 2000,
              panelClass: 'app-notification-success',
            });
            saveAs(reportData, 'Ifinworth-Report.pdf');
        }
        },
        (error)=>{
          this.isLoading=false;
          this.snackBar.open('Something went wrong', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'app-notification-success',
          });
        })
      }
    },
    (error)=>{
      this.isLoading = false;
      this.snackBar.open('Something went wrong', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'app-notification-success',
      });
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
