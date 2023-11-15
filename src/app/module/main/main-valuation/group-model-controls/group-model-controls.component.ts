import { Component, EventEmitter, Output,OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { forkJoin } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { GET_TEMPLATE, isSelected, toggleCheckbox } from 'src/app/shared/enums/functions';
import { ALL_MODELS, MODELS } from 'src/app/shared/enums/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalculationsService } from 'src/app/shared/service/calculations.service';


@Component({
  selector: 'app-group-model-controls',
  templateUrl: './group-model-controls.component.html',
  styleUrls: ['./group-model-controls.component.scss']
})
export class GroupModelControlsComponent implements OnInit {
  // decorators declaration
  @Output() saveAndNextEvent = new EventEmitter<void>();
  @Output() groupModelControls = new EventEmitter<any>();
  @Output() previousPage = new EventEmitter<any>();
  @Input() step: any;

  // form declaration
  modelControl:any = groupModelControl;
  modelValuation: FormGroup;
  form: FormGroup;
  modelSpecificCalculation:FormGroup;
  waccCalculation:FormGroup;
  relativeValuation:FormGroup;
  hasError= hasError;
  MODEL=MODELS;
  allModels:any = ALL_MODELS

// array declaration
  inputs = [{}];
  checkedItems:any=[];
  selectedPreferenceItems:any=[];
  files: any = [];
  industries:any=[];
  subIndustries: any[] = [];
  preferenceCompanies:any=[];
  prefrerenceIndustries:any=[
    {
      industry:"steel",
      _id:0
    },
    {
      industry:"auto",
      _id:1
    },
    {
      industry:"car",
      _id:2
    }
  ];
  
  // property declaration
  industriesRatio: any = '';
  betaIndustriesId: any = '';
  taxRateModelBox:any='25.17'
  floatLabelType:any = 'never';
  isDragged=false;
  valuationM: any;
  taxRate: any;
  discountR: any;
  terminalgrowthRate: any;
  equityM: any;
  riskF: any;
  marketE: any;
  betaS: any;
  rPremium: any;
  preShaCap: any;
  debt: any;
  cStructure: any;
  pppShareCaptial: any;
  indianTreasuryY: any;
  historicalReturns: any;
  debtRatio: any;
  totalCapital: any;
  debtProp: any;
  equityProp:any;
  newDate: any;
  discountRateSelection: any;
  betaIndustries: any;
  isExcelReupload=false;
  fileName:any='';

  constructor(private formBuilder: FormBuilder,
    private valuationService: ValuationService,
    private _dataReferencesService: DataReferencesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private calculationService:CalculationsService) {
    this.form=this.formBuilder.group({});
    this.inputs.forEach((_, i) => {
      this.form.addControl('select' + i, new FormControl(''));
    });

    this.modelValuation=this.formBuilder.group({
      company:['',[Validators.required]],
      valuationDate:['',[Validators.required]],
      projectionYears:['',[Validators.required]],
      location:['India',[Validators.required]],
      projectionYearSelect:['',[Validators.required]],
      industry:['',[Validators.required]],
      subIndustry:['',[Validators.required]],
      model:[false,[Validators.required]],
      userId: ['641d654fa83ed4a5f0293a52', Validators.required],
      excelSheetId:['',[Validators.required]],
      type: ['industry', Validators.required],
      outstandingShares:['',[Validators.required]],
      taxRateType:['25.17',[Validators.required]],
      taxRate:['',[Validators.required]],
      terminalGrowthRate:['',[Validators.required]],
      discountRateType: ['WACC'],                                  // removed as required field
      discountRateValue: [20],
      reportingUnit:['',[Validators.required]],
      currencyUnit:['INR',[Validators.required]],
    })
    this.modelSpecificCalculation=this.formBuilder.group({
      discountRate:[null,[Validators.required]],
      discountingPeriod:['',[Validators.required]],
      betaType:['',[Validators.required]],
      coeMethod:['',[Validators.required]],
      riskFreeRate:['',[Validators.required]],
      expMarketReturnType:['',[Validators.required]],
      expMarketReturn:['',[Validators.required]],
      otherAdj:['',[Validators.required]],
      beta:['',[Validators.required]]
    })
    this.waccCalculation=this.formBuilder.group({
      riskPremium:['',[Validators.required]],
      capitalStructureType:['',[Validators.required]],
      copShareCapital:['',[Validators.required]],
      costOfDebt:['',[Validators.required]]
    })
    this.relativeValuation=this.formBuilder.group({
      preferenceRatioSelect:['',[Validators.required]],
      companies:this.formBuilder.array([]),
      industries:this.formBuilder.array([]),

    })
  }
  // Initiate form data 
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

  ngOnInit(){
    console.log(this.step,"first stepper")
    this.formLoad();
    this.loadValues();
    this.addInput();
    this.addInputIndustry();
  }
  loadValues(){
    forkJoin([this.valuationService.getValuationDropdown(),this._dataReferencesService.getIndianTreasuryYields(),
      this._dataReferencesService.getHistoricalReturns(),
      this._dataReferencesService.getBetaIndustries()
    ])
      .subscribe((resp: any) => {
        this.industries = resp[0][DROPDOWN.INDUSTRIES];
        this.valuationM = resp[0][DROPDOWN.MODAL];
        this.taxRate = resp[0][DROPDOWN.TAX];
        this.discountR = resp[0][DROPDOWN.DISCOUNT];
        this.terminalgrowthRate = resp[0][DROPDOWN.GROWTH];
        this.equityM = resp[0][DROPDOWN.EQUITY];
        this.riskF = resp[0][DROPDOWN.RISK];
        this.marketE = resp[0][DROPDOWN.EMARKET];
        this.betaS = resp[0][DROPDOWN.BETA];
        this.rPremium = resp[0][DROPDOWN.PREMIUM];
        this.preShaCap = resp[0][DROPDOWN.PREFERANCE_SHARE_CAPITAL];
        this.debt = resp[0][DROPDOWN.DEBT];
        this.cStructure = resp[0][DROPDOWN.CAPTIAL_STRUCTURE];
        this.pppShareCaptial = resp[0][DROPDOWN.P_P_SHARE_CAPTIAL]; // Spell Error
        this.indianTreasuryY = resp[DROPDOWN.INDIANTREASURYYIELDS]; // Set as array element 1
        this.historicalReturns = resp[DROPDOWN.HISTORICALRETURNS]; // Set as array element 2
        this.betaIndustries = resp[DROPDOWN.BETAINDUSTRIES]; // Set as array element 3
        // this.industriesRatio = resp[DROPDOWN.INDUSTRIESRATIO]; //Set as array element 4
      });

  }
  formLoad(){
// Initiate form change detectors
    this.modelValuation.controls['industry'].valueChanges.subscribe((val) => {
      if (!val) {
        this.subIndustries = [];
        return;
      }
      const indst = this.industries.find((e:any) => e.industry == val);
      this.valuationService.getIndustries(indst._id).subscribe((resp: any) => {
        if(resp.length !== 0){
          this.subIndustries = resp;
        }
        else{
          this.subIndustries = [];
          this.modelValuation.controls['subIndustry'].reset();
        }
      });
      this._dataReferencesService.getIndustriesRatio(indst._id).subscribe((resp: any) => {
        this.industriesRatio = resp[0];
      });
      this._dataReferencesService.getBetaIndustriesById(indst._id).subscribe((resp: any) => {
        this.betaIndustriesId = resp;
      });
  
    });

    this.waccCalculation.controls['capitalStructureType'].valueChanges.subscribe(
      (val) => {
        if(!val) return
        if (val == 'Industry_Based') {
          this.debtRatio = parseFloat(this.betaIndustriesId?.deRatio)/100;
          this.totalCapital = 1 + this.debtRatio;
          this.debtProp = this.debtRatio/this.totalCapital;
          this.equityProp = 1 - this.debtProp;
          // });
        } else {
          // this.anaConEst = null;
        }
      }
    );

    this.modelSpecificCalculation.controls['betaType'].valueChanges.subscribe((val) => {
      if(!val) return;
      const beta = parseFloat(this.betaIndustriesId?.beta);
      if (val == 'levered'){
        this.modelSpecificCalculation.controls['beta'].setValue(
          beta
          );
        }
        else if (val == 'unlevered') {
        const deRatio = parseFloat(this.betaIndustriesId?.deRatio)/100
        const effectiveTaxRate = parseFloat(this.betaIndustriesId?.effectiveTaxRate)/100;        
        const unleveredBeta = beta / (1 + (1-effectiveTaxRate) * deRatio);
        this.modelSpecificCalculation.controls['beta'].setValue(
          unleveredBeta
        );
      }
      else if (val == 'market_beta') {
        this.modelSpecificCalculation.controls['beta'].setValue(1);
      }
      else {
        // Do nothing for now
      }
      
    });
    this.modelValuation.controls['model'].valueChanges.subscribe((val) => {
      if(!val) return;
      if (val == 'Relative_Valuation' || val == 'CTM'){
        this.modelValuation.controls['projectionYearSelect'].reset();
        this.modelValuation.controls['terminalGrowthRate'].reset();
        this.modelValuation.controls['projectionYears'].reset();
      }
    });
    
    // this.modelSpecificCalculation.controls['expMarketReturnType'].valueChanges.subscribe(
    //   (val) => {
    //     if(val.value === "Analyst_Consensus_Estimates"){
    //       const data={
    //         data: 'ACE',
    //         width:'30%',
    //       }
    //       const dialogRef = this.dialog.open(GenericModalBoxComponent,data);
    //       dialogRef.afterClosed().subscribe((result)=>{
    //         if (result) {
    //           this.modelSpecificCalculation.controls['expMarketReturn'].patchValue(result)
    //           this.snackBar.open('Analyst Estimation Added','OK',{
    //             horizontalPosition: 'center',
    //             verticalPosition: 'top',
    //             duration: 3000,
    //             panelClass: 'app-notification-success'
    //           })
    //         } else {
    //           this.modelSpecificCalculation.controls['expMarketReturnType'].reset();
    //           this.snackBar.open('Tax Rate Not Saved','OK',{
    //             horizontalPosition: 'center',
    //             verticalPosition: 'top',
    //             duration: 3000,
    //             panelClass: 'app-notification-error'
    //           })
    //         }
    //       })
    //     }
        
    //   }
    // );

    // this.modelValuation.controls['projectionYearSelect'].valueChanges.subscribe((val) => {
    //   if(!val) return;
    //   if(val=== "Going_Concern"){
    //     const data={
    //       data: 'Going_Concern',
    //       width:'30%',
    //     }
    //     const dialogRef = this.dialog.open(GenericModalBoxComponent,data);
    //     dialogRef.afterClosed().subscribe((result)=>{
    //       if (result) {
    //         this.modelValuation.controls['projectionYears'].patchValue(result?.projectionYear)
    //         this.modelValuation.controls['terminalGrowthRate'].patchValue(result?.terminalGrowthYear)
    //         this.snackBar.open('Going Concern Added','OK',{
    //           horizontalPosition: 'center',
    //           verticalPosition: 'top',
    //           duration: 3000,
    //           panelClass: 'app-notification-success'
    //         })
    //       } else {
    //         this.modelValuation.controls['projectionYearSelect'].reset();
    //         this.snackBar.open('Going Concern not added','OK',{
    //           horizontalPosition: 'center',
    //           verticalPosition: 'top',
    //           duration: 3000,
    //           panelClass: 'app-notification-error'
    //         })
    //       }
    //     })
    //   }
    // })

  }
  
  isRelativeValuation(value:string){
    return !!this.checkedItems.includes(value);
  }

  isSelected(value: any): boolean {
    var value:any= isSelected(value,this.checkedItems);
    this.modelValuation.controls['model'].setValue(value);
    return value;
  }

  toggleCheckbox(option:any) {
   this.checkedItems=toggleCheckbox(option['value'],this.checkedItems);
}
isSelectedpreferenceRatio(value:any){
  return isSelected(value,this.selectedPreferenceItems)
 
}

  saveAndNext(): void {
    // this.modelValuation.controls['model'].setValue(this.checkedItems);
    if(!this.isRelativeValuation(this.MODEL.RELATIVE_VALUATION)){
      this.relativeValuation.controls['preferenceRatioSelect'].setValue('');
    }
    let payload = {...this.modelValuation.value,betaIndustry:this.betaIndustriesId,preferenceCompanies:this.preferenceCompanies,industriesRatio:[this.industriesRatio]}
    
    //  check if tax rate is null
    if (payload['taxRate'] == null || payload['taxRateType']=='25.17') {
      this.modelValuation.controls['taxRate'].patchValue('25.17%')
      payload['taxRate'] = '25.17%';
      payload['taxRateType'] = 'Default';
    }

    // check if valuation date is empty
    const valuationDate = this.modelValuation.get('valuationDate')?.value;
    if (valuationDate) {
      const myDate = {
        year: valuationDate.split("-")[0],
        month: valuationDate.split("-")[1], // Note that months are zero-based
        day: valuationDate.split("-")[2],
      };

      this.newDate = new Date(myDate.year, myDate.month - 1, myDate.day);
      // this.modelValuation.controls['valuationDate'].setValue(this.newDate.getTime());
      payload['valuationDate'] = this.newDate.getTime();
    }
    if(this.isRelativeValuation('NAV') &&  this.modelValuation.controls['model'].value.length=== 1){
      const keysToRemove = ['taxRate', 'taxRateType', 'terminalGrowthRate', 'preferenceCompanies','projectionYears','projectionYearSelect','location'];

    payload = Object.keys(payload).reduce((result:any, key) => {
        if (!keysToRemove.includes(key)) {
            result[key] = payload[key];
        }
        return result;
    }, {});
  }
    // check if modified excel sheet id exist or not
    if(localStorage.getItem('excelStat') === 'true' && !this.isExcelReupload){
      payload['modifiedExcelSheetId']=  `edited-${this.modelValuation.controls['excelSheetId'].value}`;
      payload['isExcelModified']= true;
    }
    else{
      payload['modifiedExcelSheetId']=  this.modelValuation.controls['excelSheetId'].value;
      payload['isExcelModified']= false;
      localStorage.setItem('excelStat','false')
    }


    
    
    // validate form controls
    let control:any;
    control = { ...this.modelValuation.controls };
    if(this.subIndustries.length <= 0){
      delete control.subIndustry;
    }
    const modelsNotRequireProjection = isSelected('NAV', this.modelValuation.controls['model'].value) || isSelected('CTM', this.modelValuation.controls['model'].value) || isSelected('CCM', this.modelValuation.controls['model'].value)
    const mmodelsRequireProjection = isSelected('FCFE', this.modelValuation.controls['model'].value) || isSelected('FCFF', this.modelValuation.controls['model'].value) || isSelected('Excess_Earnings', this.modelValuation.controls['model'].value)
    if (modelsNotRequireProjection && this.modelValuation.controls['model'].value.length === 1) {
      delete control.projectionYearSelect
      delete control.terminalGrowthRate
      delete control.projectionYears
    }
    else if(modelsNotRequireProjection && !mmodelsRequireProjection){
      delete control.projectionYearSelect
      delete control.terminalGrowthRate
      delete control.projectionYears
    }
  
    this.validateControls(control,this.modelValuation.controls['model'].value);

    this.isExcelReupload = false; // reset it once payload has modified excel sheet id

        // submit final payload
        this.groupModelControls.emit(payload);
  }

  validateControls(controlArray: { [key: string]: FormControl },models:any){
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

    localStorage.setItem('stepOneStats',`${allControlsFilled}`)
    this.calculationService.checkStepStatus.next({stepStatus:allControlsFilled,step:this.step})
  }
  
  get isDownload() {
    return this.modelValuation.controls['projectionYears'].value ? true : false;
  }

  get downloadTemplate() {
  return GET_TEMPLATE(this.modelValuation.controls['projectionYears'].value);
  }

  onFileSelected(event: any) {
    if (event && event.target.files && event.target.files.length > 0) {
      this.files = event.target.files;
    }
  
    if (this.files.length === 0) {
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.files[0]);
    this.valuationService.fileUpload(formData).subscribe((res: any) => {
      this.modelValuation.get('excelSheetId')?.setValue(res.excelSheetId);
      if(res.excelSheetId){
        this.isExcelReupload = true;
        this.snackBar.open('File has been uploaded successfully','Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      }
      
      // Clear the input element value to allow selecting the same file again
      event.target.value = '';
    });
  }
 
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  subIndustryChange(val:any){
    if(val){
      this.valuationService.getCompanies(val).subscribe((resp: any) => {
        if(resp.length>0){
          this.preferenceCompanies = resp;
        }
        else{
          this.preferenceCompanies=[{company:'No company Found',_id:0}];
        }
      });
    }
    else{
      this.preferenceCompanies=[];
    }
  }
  checkPreferenceCompany(){
    return this.Companies.controls.length === this.preferenceCompanies.length  ? false :true
  }

 
  previous(){
    this.previousPage.emit(true)
  }
  openDialog(bool?:boolean){
    if(bool){
      const data={
        data: this.modelValuation.controls['taxRateType'].value,
        width:'30%',
      }
     const dialogRef = this.dialog.open(GenericModalBoxComponent,data);
  
     dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taxRateModelBox=result?.taxRate;
        this.modelValuation.controls['taxRate'].patchValue(result?.taxRate);
        this.snackBar.open('Tax Rate Saved Successfully','OK',{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      } else {
        this.modelValuation.controls['taxRateType'].setValue('25.17');
        this.taxRateModelBox='25.17'
        this.snackBar.open('Tax Rate Not Saved','OK',{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    });
    }
    else {
      this.taxRateModelBox=this.modelValuation.controls['taxRateType'].value;
    }
  }

  onTaxRateChange(event: any) {
    // Handle the change event here
    const selectedValue = event.target.value;
    if (selectedValue === '25.17') {
      this.openDialog();
    } else {
      this.openDialog(true);
    }
  }

  selectValuation(){
    const data={
        model: this.modelValuation.controls['model'].value,
        projectionYearSelect:this.modelValuation.controls['projectionYearSelect'].value,
        terminalGrowthRate:this.modelValuation.controls['terminalGrowthRate'].value,
        projectionYears:this.modelValuation.controls['projectionYears'].value,
        excelSheetId:this.modelValuation.controls['excelSheetId'].value,
        fileName:this.fileName,
        value:'valuationMethod'
      }
     const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'50%'});
  
     dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(result?.excelSheetId !== this.modelValuation.controls['excelSheetId']){
          this.isExcelReupload=true
        }
        this.modelValuation.controls['model'].setValue(result?.model);
        this.modelValuation.controls['projectionYearSelect'].setValue(result?.projectionYearSelect);
        this.modelValuation.controls['projectionYears'].setValue(result?.projectionYears);
        this.modelValuation.controls['terminalGrowthRate'].setValue(result?.terminalGrowthRate);
        this.modelValuation.controls['excelSheetId'].setValue(result?.excelSheetId); 
        this.fileName = result?.fileName; 
        
        this.snackBar.open('Valuaion models are added successfully','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      } else {
        this.snackBar.open('Something went wrong','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    });
   
  }

  removeTag(modelName:string){
    const values = this.modelValuation.controls['model'].value;
    values.splice(values.indexOf(modelName),1);
    this.modelValuation.controls['model'].setValue(values)
  }
}
