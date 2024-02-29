import { Component, EventEmitter, Output,OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import groupModelControl from '../../../../shared/enums/group-model-controls.json'
import { ValuationService } from 'src/app/shared/service/valuation.service';
import { DataReferencesService } from 'src/app/shared/service/data-references.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, throttleTime } from 'rxjs';
import { DROPDOWN } from 'src/app/shared/enums/enum';
import { GET_TEMPLATE, isSelected, toggleCheckbox } from 'src/app/shared/enums/functions';
import { ALL_MODELS, MODELS, helperText } from 'src/app/shared/enums/constant';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { UtilService } from 'src/app/shared/service/util.service';


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
  allModels:any = ALL_MODELS;
  helperText = helperText

// array declaration
  inputs = [{}];
  checkedItems:any=[];
  selectedPreferenceItems:any=[];
  files: any = [];
  industries:any=[];
  subIndustries: any=[];
  preferenceCompanies:any=[];
  
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
  companyQuery:any;
  searchByCompanyName = new Subject<string>();
  options:any=[];
  companyListLoader=false;
  companyInput=false;
  

  constructor(private formBuilder: FormBuilder,
    private valuationService: ValuationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private calculationService:CalculationsService,
    private processStatusManagerService:ProcessStatusManagerService,
    private utilService:UtilService) {
    this.form=this.formBuilder.group({});

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

  ngOnInit(){
    this.loadValues();
    this.checkProcessExist(this.firstStageInput)
    this.searchByCompanyName.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      throttleTime(600),
      switchMap(async () => this.fetchCompanyNames())
    ).subscribe();
    // this.loadCiqIndustryList()
  }

  async checkProcessExist(data:any){
   if(data){
    this.betaIndustries = data?.betaIndustries;
    if(data?.company){
      this.companyQuery = data?.company;
      this.fetchCompanyNames()
      this.modelValuation.controls['company'].setValue(data?.company ?? '');
    }
   this.modelValuation.controls['currencyUnit'].setValue(data?.currencyUnit ?? 'INR');
   this.modelValuation.controls['discountRateType'].setValue(data?.discountRateType === ""  ?  'WACC' : data?.discountRateType);
   this.modelValuation.controls['discountRateValue'].setValue(data?.discountRateValue === "" ? 20 : data?.discountRateValue);

   this.preferenceCompanies = data.preferenceCompanies ?? [];
   this.modelValuation.controls['industry'].setValue(data?.industry?? '');
   this.modelValuation.controls['location'].setValue(data?.location?? 'India');
   this.modelValuation.controls['model'].setValue(data?.model?? false);
   this.modelValuation.controls['outstandingShares'].setValue(data?.outstandingShares?? '');
   this.modelValuation.controls['projectionYearSelect'].setValue(data?.projectionYearSelect?? '');
   this.modelValuation.controls['projectionYears'].setValue(data?.projectionYears?? '');
   this.modelValuation.controls['reportingUnit'].setValue(data?.reportingUnit?? '');
   this.modelValuation.controls['subIndustry'].setValue(data?.subIndustry?? '');
   this.modelValuation.controls['taxRate'].setValue(data?.taxRate?? '');
   
   if(data.taxRate === '25.17' || data.taxRate === '25.17%'){
     this.modelValuation.controls['taxRateType'].setValue('25.17');
    }else{
      this.modelValuation.controls['taxRateType'].setValue(data.taxRateType);
    }
    this.taxRateModelBox = `${data.taxRate}`.includes('%') ? data?.taxRate?.split('%')[0] : data?.taxRate;

   this.modelValuation.controls['terminalGrowthRate'].setValue(data?.terminalGrowthRate?? '');
   this.modelValuation.controls['type'].setValue(data?.type?? 'industry');
   this.modelValuation.controls['industry'].setValue(data?.industry ?? '');
   this.modelValuation.controls['userId'].setValue( !data?.userId || data?.userId === "" ? '640a4783337b1b37d6fd04c7' : data?.userId);
   this.modelValuation.controls['excelSheetId'].setValue(data?.excelSheetId?? '');
   this.selectedIndustry = data?.selectedIndustry;
   this.fileName = data?.fileName || data?.excelSheetId;
   
  const dateToSet = data?.valuationDate ? new Date(data?.valuationDate) : null;
  const formattedDate = dateToSet ? `${dateToSet.getFullYear()}-${(dateToSet.getMonth() + 1).toString().padStart(2, '0')}-${dateToSet.getDate().toString().padStart(2, '0')}` : '';
  this.modelValuation.controls['valuationDate'].patchValue(formattedDate);
   }
  }
  loadValues(){
    this.valuationService.getValuationDropdown()
      .subscribe((resp: any) => {
        this.taxRate = resp[DROPDOWN.TAX];
      });
    // forkJoin([this.valuationService.getValuationDropdown(),this._dataReferencesService.getIndianTreasuryYields(),
    //   this._dataReferencesService.getHistoricalReturns(),
    //   this._dataReferencesService.getBetaIndustries()
    // ])
    //   .subscribe((resp: any) => {
    //     this.industries = resp[0][DROPDOWN.INDUSTRIES];
    //     this.valuationM = resp[0][DROPDOWN.MODAL];
    //     this.taxRate = resp[0][DROPDOWN.TAX];
    //     this.discountR = resp[0][DROPDOWN.DISCOUNT];
    //     this.terminalgrowthRate = resp[0][DROPDOWN.GROWTH];
    //     this.equityM = resp[0][DROPDOWN.EQUITY];
    //     this.riskF = resp[0][DROPDOWN.RISK];
    //     this.marketE = resp[0][DROPDOWN.EMARKET];
    //     this.betaS = resp[0][DROPDOWN.BETA];
    //     this.rPremium = resp[0][DROPDOWN.PREMIUM];
    //     this.preShaCap = resp[0][DROPDOWN.PREFERANCE_SHARE_CAPITAL];
    //     this.debt = resp[0][DROPDOWN.DEBT];
    //     this.cStructure = resp[0][DROPDOWN.CAPTIAL_STRUCTURE];
    //     this.pppShareCaptial = resp[0][DROPDOWN.P_P_SHARE_CAPTIAL]; // Spell Error
    //     this.indianTreasuryY = resp[DROPDOWN.INDIANTREASURYYIELDS]; // Set as array element 1
    //     this.historicalReturns = resp[DROPDOWN.HISTORICALRETURNS]; // Set as array element 2
    //     this.betaIndustries = resp[DROPDOWN.BETAINDUSTRIES]; // Set as array element 3
    //     // this.industriesRatio = resp[DROPDOWN.INDUSTRIESRATIO]; //Set as array element 4
    //   });

  }
  
  isRelativeValuation(value:string){
    return this.checkedItems.includes(value);
  }

  isSelectedpreferenceRatio(value:any){
    return isSelected(value,this.selectedPreferenceItems)
  
  }

  saveAndNext(): void {
    if(!this.modelValuation.controls['model'].value || this.modelValuation.controls['model'].value?.length === 0){
      this.modelSelectStatus = false;
      return;
    }

    if(!this.isRelativeValuation(this.MODEL.RELATIVE_VALUATION)){
      this.relativeValuation.controls['preferenceRatioSelect'].setValue('');
    }
    let payload = {...this.modelValuation.value,betaIndustry:this.betaIndustriesId,preferenceCompanies:this.preferenceCompanies}
    
    //  check if tax rate is null
    if (payload['taxRate'] == null || payload['taxRateType']=='25.17') {
      this.modelValuation.controls['taxRate'].patchValue('25.17%')
      payload['taxRate'] = '25.17%';
      payload['taxRateType'] = 'Default';
    }

    // check if valuation date is empty
    const valuationDateValue = this.modelValuation.value.valuationDate;
    if (valuationDateValue) {
      const valuationDate = new Date(valuationDateValue);
      const year = valuationDate.getFullYear();
      const month = valuationDate.getMonth() + 1;
      const day = valuationDate.getDate();
      
      const myDate = {
        year: year,
        month: month,
        day: day
      };
      this.newDate = new Date(myDate.year, myDate.month - 1, myDate.day);
      payload['valuationDate'] = this.newDate.getTime();
    }
    if(this.modelValuation.controls['model'].value.includes(MODELS.NAV) && this.modelValuation.controls['model'].value.length=== 1){
      const keysToRemove = ['taxRate', 'taxRateType', 'terminalGrowthRate', 'preferenceCompanies','projectionYears','projectionYearSelect','industriesRatio','industry','discountRateType','discountRateValue'];
      payload = this.recalculateFields(payload,keysToRemove)
    }
    else if(this.modelValuation.controls['model'].value.includes(MODELS.RULE_ELEVEN_UA) && this.modelValuation.controls['model'].value.length=== 1){
      const keysToRemove = ['taxRate', 'taxRateType', 'terminalGrowthRate', 'preferenceCompanies','projectionYears','projectionYearSelect','industriesRatio','industry','discountRateType','discountRateValue'];
      payload = this.recalculateFields(payload,keysToRemove)
    }
    // check if modified excel sheet id exist or not
    if(this.isExcelReupload) {
      payload['modifiedExcelSheetId']=  '';
      payload['isExcelModified']= false;
    }
    
    payload['companyId'] = this.fetchCompanyId()?.companyId;
    payload['companyType'] = this.fetchCompanyId()?.companyTypeId;

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

    if((payload.model.includes(MODELS.RULE_ELEVEN_UA) || payload.model.includes(MODELS.NAV)) && payload.model.length === 1){
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
    delete control.industry;
    
    this.isExcelReupload = false; // reset it once payload has modified excel sheet id
    
    this.validateControls(control,payload);
  }

  fetchCompanyId(){
    const foundElement = this.options.find((element: any) => {
      return element.COMPANYNAME === this.modelValuation.controls['company'].value;
    });
    
    if (foundElement) {
        return {
            companyId: foundElement.COMPANYID,
            companyTypeId: '6598f0370b042902bcf9b7fb' // hardcoded company type as public company
        };
    }
    
    return null;
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

      const checkModel = this.isNotRuleElevenUaAndNav();
      if(!checkModel){
        localStorage.setItem('step', '2')
        processStep = 2
      }

    localStorage.setItem('stepOneStats',`${allControlsFilled}`)
    this.calculationService.checkStepStatus.next({stepStatus:allControlsFilled,step:this.step})

    const {userId , ...rest } = payload;
    const processStateModel ={
      firstStageInput:{...rest,fileName:this.fileName,formFillingStatus:allControlsFilled},
      step:processStep
    }
    
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'));

      // submit final payload
      this.groupModelControls.emit(payload);
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
    const selectedValue = event.value;
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
     const dialogRef = this.dialog.open(GenericModalBoxComponent,{data:data,width:'50%', height:'90%'});
  
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
        this.evaluateNumberOfSteps()
        this.isNotRuleElevenUaAndNav()
        
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
    this.modelValuation.controls['model'].setValue(values);
    this.isNotRuleElevenUaAndNav();
    this.evaluateNumberOfSteps()
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

  isNotRuleElevenUaAndNav(){
    if (this.modelValuation.controls['model'].value?.length === 1 &&
      (
        this.modelValuation.controls['model'].value?.includes(MODELS.RULE_ELEVEN_UA) ||
        this.modelValuation.controls['model'].value?.includes(MODELS.NAV)
      ))
      {
      return false;
      }
      else if(this.modelValuation.controls['model'].value?.length === 2 && (
        this.modelValuation.controls['model'].value?.includes(MODELS.RULE_ELEVEN_UA) &&
        this.modelValuation.controls['model'].value?.includes(MODELS.NAV)
      )){
        return false;
      }
      else if(this.modelValuation.controls['model'].value?.length  > 1 && (
        this.modelValuation.controls['model'].value?.includes(MODELS.RULE_ELEVEN_UA) ||
        this.modelValuation.controls['model'].value?.includes(MODELS.NAV)
      )){
        return true;
      }
      else{
        return true;
      }
  }

  evaluateNumberOfSteps(){
    if (this.modelValuation.controls['model'].value?.length === 1 &&
    (
      this.modelValuation.controls['model'].value?.includes(MODELS.RULE_ELEVEN_UA) ||
      this.modelValuation.controls['model'].value?.includes(MODELS.NAV)
    ))
    {
      this.calculationService.checkModel.next({status:true})
    }
    else if(this.modelValuation.controls['model'].value?.length === 2 && (
      this.modelValuation.controls['model'].value?.includes(MODELS.RULE_ELEVEN_UA) &&
      this.modelValuation.controls['model'].value?.includes(MODELS.NAV)
    )){
      this.calculationService.checkModel.next({status:true})
    }
    else if(this.modelValuation.controls['model'].value?.length  > 1 && (
      this.modelValuation.controls['model'].value?.includes(MODELS.RULE_ELEVEN_UA) ||
      this.modelValuation.controls['model'].value?.includes(MODELS.NAV)
    )){
      this.calculationService.checkModel.next({status:false})
    }
    else if(this.modelValuation.controls['model']?.value?.length){
      this.calculationService.checkModel.next({status:false})
    }
    else{
      this.calculationService.checkModel.next({status:true})
    }
  }

  filterByBusinessDescriptor(event:any){
    if(event.target.value && this.companyQuery !== event.target.value){
      this.companyQuery = event.target.value;
      this.searchByCompanyName.next(this.companyQuery);
    }
  }

  fetchCompanyNames(){
    this.companyListLoader = true
    this.utilService.fuzzySearchCompanyName(this.companyQuery).subscribe((data:any)=>{
      this.companyListLoader = false
      if(data?.companyDetails?.length){
        this.options = data.companyDetails;
      }
      else{
        this.snackBar.open('Company not found', 'Ok',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error',
        })
      }
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

  onOptionSelection(event:any){
    if(event?.option?.value){
      this.companyQuery = event.option.value;
      this.fetchCompanyNames();
    }
  }

  displayFn(value: string): string {
    return value || '';
  }

  clearInput(controlName:string){
    this.modelValuation.controls[controlName].setValue('');
  }

  companyInputFocused(){
    this.companyInput = true;
  }

  companyInputBlurred(){
    this.companyInput = false;
  }
}
