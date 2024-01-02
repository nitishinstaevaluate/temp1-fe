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
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { AuthService } from 'src/app/shared/service/auth.service';


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
  @Input() firstStageInput: any;

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
  subIndustries: any=[];
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
  modelSelectStatus:boolean= true;
  selectedIndustry:any;

  constructor(private formBuilder: FormBuilder,
    private valuationService: ValuationService,
    private _dataReferencesService: DataReferencesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private calculationService:CalculationsService,
    private processStatusManagerService:ProcessStatusManagerService,
    private authService:AuthService) {
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
    this.loadValues();
    this.checkProcessExist(this.firstStageInput)
    this.formLoad();
    this.addInput();
    this.addInputIndustry();
  }

  async checkProcessExist(data:any){
   if(data){
    this.betaIndustries = data?.betaIndustries;
   this.modelValuation.controls['company'].setValue(data?.company ?? '');
   this.modelValuation.controls['currencyUnit'].setValue(data?.currencyUnit ?? 'INR');
   this.modelValuation.controls['discountRateType'].setValue(data?.discountRateType === ""  ?  'WACC' : data?.discountRateType);
   this.modelValuation.controls['discountRateValue'].setValue(data?.discountRateValue === "" ? 20 : data?.discountRateValue);
   this.industriesRatio = data.industriesRatio ?? '';
   this.preferenceCompanies = data.preferenceCompanies ?? [];
  //  localStorage.setItem('excelStat',`${data.isExcelModified ?? ''}`);
   this.modelValuation.controls['industry'].setValue(data?.industry?? '');
   this.modelValuation.controls['location'].setValue(data?.location?? 'India');
   this.modelValuation.controls['model'].setValue(data?.model?? false);
   this.modelValuation.controls['outstandingShares'].setValue(data?.outstandingShares?? '');
   this.modelValuation.controls['projectionYearSelect'].setValue(data?.projectionYearSelect?? '');
   this.modelValuation.controls['projectionYears'].setValue(data?.projectionYears?? '');
   this.modelValuation.controls['reportingUnit'].setValue(data?.reportingUnit?? '');
   this.modelValuation.controls['subIndustry'].setValue(data?.subIndustry?? '');
   this.modelValuation.controls['taxRateType'].setValue(data?.taxRate?.split('%')[0]?? '25.17');
   this.modelValuation.controls['taxRate'].setValue(data?.taxRate?? '');
   this.modelValuation.controls['terminalGrowthRate'].setValue(data?.terminalGrowthRate?? '');
   this.modelValuation.controls['type'].setValue(data?.type?? 'industry');
   this.modelValuation.controls['userId'].setValue( !data?.userId || data?.userId === "" ? '640a4783337b1b37d6fd04c7' : data?.userId);
   this.modelValuation.controls['excelSheetId'].setValue(data?.excelSheetId?? '');
   this.selectedIndustry = data?.selectedIndustry;
   this.fileName = data?.fileName;
   
  const dateToSet = data?.valuationDate ? new Date(data?.valuationDate) : null;
  const formattedDate = dateToSet ? `${dateToSet.getFullYear()}-${(dateToSet.getMonth() + 1).toString().padStart(2, '0')}-${dateToSet.getDate().toString().padStart(2, '0')}` : '';
  this.modelValuation.controls['valuationDate'].patchValue(formattedDate);
  if(this.modelValuation.controls['industry'].value && this.selectedIndustry){
    const indst = this.selectedIndustry;
    this.valuationService.getIndustries(indst?._id).subscribe((resp: any) => {
      if(resp.length !== 0){
        this.subIndustries = resp;
      }
      else{
        console.log("emptying sub-industry")
        this.subIndustries = [];
        this.modelValuation.controls['subIndustry'].setValue('');
      }
    });
    this._dataReferencesService.getIndustriesRatio(indst?._id).subscribe((resp: any) => {
      this.industriesRatio = resp[0];
    });
    this._dataReferencesService.getBetaIndustriesById(indst?._id).subscribe((resp: any) => {
      this.betaIndustriesId = resp;
    });
  }
   }
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
      this.valuationService.getIndustries(indst?._id).subscribe((resp: any) => {
        if(resp.length !== 0){
          this.subIndustries = resp;
          this.selectedIndustry = indst;
        }
        else{
          this.subIndustries = [];
          this.modelValuation.controls['subIndustry'].setValue('');
        }
      });
      this._dataReferencesService.getIndustriesRatio(indst?._id).subscribe((resp: any) => {
        this.industriesRatio = resp[0];
      });
      this._dataReferencesService.getBetaIndustriesById(indst?._id).subscribe((resp: any) => {
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

  }
  
  isRelativeValuation(value:string){
    return this.checkedItems.includes(value);
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
    if(!this.modelValuation.controls['model'].value || this.modelValuation.controls['model'].value?.length === 0){
      this.modelSelectStatus = false;
      return;
    }

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
      payload['valuationDate'] = this.newDate.getTime();
    }
    if(this.modelValuation.controls['model'].value.includes(MODELS.NAV) && this.modelValuation.controls['model'].value.length=== 1){
      const keysToRemove = ['taxRate', 'taxRateType', 'terminalGrowthRate', 'preferenceCompanies','projectionYears','projectionYearSelect','industriesRatio'];
      payload = this.recalculateFields(payload,keysToRemove)
    }
    else if(this.modelValuation.controls['model'].value.includes(MODELS.RULE_ELEVEN_UA) && this.modelValuation.controls['model'].value.length=== 1){
      const keysToRemove = ['taxRate', 'taxRateType', 'terminalGrowthRate', 'preferenceCompanies','projectionYears','projectionYearSelect','industriesRatio','industry','discountRateType','discountRateValue'];
      payload = this.recalculateFields(payload,keysToRemove)
    }
    // check if modified excel sheet id exist or not
    if(localStorage.getItem('excelStat') === 'true' && !this.isExcelReupload){
      payload['modifiedExcelSheetId']=  `edited-${this.modelValuation.controls['excelSheetId'].value}`;
      payload['isExcelModified']= true;
    }
    else{
      payload['modifiedExcelSheetId']=  '';
      payload['isExcelModified']= false;
      localStorage.setItem('excelStat','false')
    }
    
    // validate form controls
    let control:any;
    control = { ...this.modelValuation.controls };
    if(this.subIndustries?.length <= 0){
      delete control.subIndustry;
    }
    else if(this.selectedIndustry){
      payload['selectedIndustry'] = this.selectedIndustry;
    }
    const modelsNotRequireProjection = isSelected('NAV', this.modelValuation.controls['model'].value) || isSelected('CTM', this.modelValuation.controls['model'].value) || isSelected('Relative_Valuation', this.modelValuation.controls['model'].value) || isSelected('ruleElevenUa', this.modelValuation.controls['model'].value)
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

    if(payload.model.includes(MODELS.RULE_ELEVEN_UA)){
      delete control.taxRate;
      delete control.taxRateType;
      delete control.terminalGrowthRate;
      delete control.preferenceCompanies;
      delete control.projectionYears;
      delete control.projectionYearSelect;
      delete control.industry;
      delete control.discountRateType;
      delete control.discountRateValue;
    }
    
    this.isExcelReupload = false; // reset it once payload has modified excel sheet id
    
    this.validateControls(control,payload);
   
  }

  validateControls(controlArray: { [key: string]: FormControl },payload:any){
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

      let processStep=1;
      if(!allControlsFilled){
        this.modelValuation.markAllAsTouched();
        processStep = 0
      }

    localStorage.setItem('stepOneStats',`${allControlsFilled}`)
    this.calculationService.checkStepStatus.next({stepStatus:allControlsFilled,step:this.step})

    const {userId , ...rest } = payload;
    const processStateModel ={
      firstStageInput:{...rest,fileName:this.fileName,formFillingStatus:allControlsFilled},
      step:processStep
    }
    
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'))
      // submit final payload
      this.groupModelControls.emit(payload);
  }
  
  get isDownload() {
    return this.modelValuation.controls['projectionYears'].value ? true : false;
  }

  // get downloadTemplate() {
  // return GET_TEMPLATE(this.modelValuation.controls['projectionYears'].value);
  // }

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
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
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
      const parts = val.split(': ');
      const id = parts[1]; 
      this.valuationService.getCompanies(id).subscribe((resp: any) => {
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
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      } else {
        this.modelValuation.controls['taxRateType'].setValue('25.17');
        this.taxRateModelBox='25.17'
        this.snackBar.open('Tax Rate Not Saved','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          // duration: 3000,
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
     const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'50%',height:'95%'});
  
     dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(result?.excelSheetId !== this.modelValuation.controls['excelSheetId']){
          this.isExcelReupload = true;
        }
        else{
          this.isExcelReupload = false;
        }
        if(result.model.length > 0){
          this.modelSelectStatus = true
        }
        this.modelValuation.controls['model'].setValue(result?.model);
        this.modelValuation.controls['projectionYearSelect'].setValue(result?.projectionYearSelect);
        this.modelValuation.controls['projectionYears'].setValue(result?.projectionYears);
        this.modelValuation.controls['terminalGrowthRate'].setValue(result?.terminalGrowthRate);
        this.modelValuation.controls['excelSheetId'].setValue(result?.excelSheetId); 
        this.fileName = result?.fileName; 
        
        this.snackBar.open('Valuation models are added successfully','OK',{
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-success'
        })
      } else {
        // this.snackBar.open('Valuation models not added','OK',{
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   panelClass: 'app-notification-error'
        // })
      }
    });
   
  }

  removeTag(modelName:string){
    const values = this.modelValuation.controls['model'].value;
    values.splice(values.indexOf(modelName),1);
    this.modelValuation.controls['model'].setValue(values)
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

  recalculateFields(payload:any,keysToRemove:any){
    const result: any = {};
      for (const key in payload) {
        if (!keysToRemove.includes(key)) {
          result[key] = payload[key];
        }
      }
      return result;
  }

  isNotRuleElevenUa(){
    if(this.modelValuation.controls['model'].value?.length && !this.modelValuation.controls['model'].value?.includes(MODELS.RULE_ELEVEN_UA))
      return true;
    return false
  }
}
