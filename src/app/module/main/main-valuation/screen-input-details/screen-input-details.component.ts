import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { hasError } from 'src/app/shared/enums/errorMethods';
import groupModelControl from '../../../../shared/enums/group-model-controls.json';
import { CiqSPService } from 'src/app/shared/service/ciq-sp.service';
import { BETA_SUB_TYPE, INDUSTRY_BASED_COMPANY, MODELS, PAGINATION_VAL, helperText } from 'src/app/shared/enums/constant';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ProcessStatusManagerService } from 'src/app/shared/service/process-status-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, startWith, switchMap, throttleTime } from 'rxjs';
import { UtilService } from 'src/app/shared/service/util.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalBoxComponent } from 'src/app/shared/modal box/generic-modal-box/generic-modal-box.component';
import { excludeDecimalFormatting } from 'src/app/shared/enums/functions';

@Component({
  selector: 'app-screen-input-details',
  templateUrl: './screen-input-details.component.html',
  styleUrls: ['./screen-input-details.component.scss']
})
export class ScreenInputDetailsComponent implements OnInit,OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @Input() step:any;
  @Output() screenInputDetails:any = new EventEmitter<any>();
  @Output() previousPage:any = new EventEmitter<any>();
  @Input() formOneData:any;
  @Input() secondStageInput:any;
  inputScreenForm:any;
  hasError=hasError;
  modelControl=groupModelControl;
  ciqIndustryData:any;
  ciqIndustryHead=['Company Id', 'Company Name', 'EBITDA Margin %', 'Sales', 'Market Cap', 'Outstanding Shares', 'City', 'Industry Description'];
  mapIndustryBasedCompany:any = INDUSTRY_BASED_COMPANY;
  loader=false;
  levelThreeIndustry:any=[];
  levelFourIndustry:any=[];
  industryFourDropdownValue:boolean = false;
  companyStatusDropdownValue:boolean = false;
  companyTypeDropdownValue:boolean = false;
  industryFourDropdownFocused:boolean = false;
  companyStatusDropdownFocused:boolean = false;
  companyTypeDropdownFocused:boolean = false;
  companyStatusType:any= [];
  companyType:any= [];
  levelFourIndustryDescription:any = [];
  companyStatusTypeDescription:any = [];
  companyTypeDescription:any = ['Public Company'];
  levelThreeIndustryDescription:any='';
  selectedObjects: any = [];
  selectedLevelFourIndustry: any = [];
  selectedCompanyType: any = [];
  selectedCompanyStatusType: any = [];
  descriptorQuery: any = '';
  searchByDescriptor = new Subject<string>(); 
  mainIndustries:any = [];
  total=0;
  selectedIndustries:any= [];
  options: any = [];
  filteredOptions: Observable<string[]> | undefined;
  meanMedianList:any= [];
  previousIndustryL3Value:any='';
  length:number = 0;
  pageSize: number = 10;
  pageSizeOptions = PAGINATION_VAL;
  pageStart: number = 0;
  previousPageIndex: number = 0
  prevPageSize: any;
  selectAll: boolean = false;
  valuationDateNote = '';
  formatNumber=excludeDecimalFormatting;
  collapsed = true;
  companyInput = false;
  companyQuery: any;
  searchByCompanyName = new Subject<string>();
  companyList: any = [];
  helperText = helperText;

  constructor(
    private fb:FormBuilder,
    private ciqSpService:CiqSPService,
    private calculationService:CalculationsService,
    private processStatusManagerService: ProcessStatusManagerService,
    private snackBar: MatSnackBar,
    private utilService: UtilService,
    private dialog:MatDialog){}

  ngOnInit(){
    this.loadForm();
    this.loadEnums();
    this.checkProcessExist(this.secondStageInput);
    this.onValueChange();
    this.searchByDescriptor.pipe(
      debounceTime(1300),
      throttleTime(1000),
      switchMap(async () => this.loadCiqIndustryBasedLevelFour(this.createPayload()))
    ).subscribe();
    this.searchByCompanyName.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      throttleTime(600),
      switchMap(async () => this.fetchCompanyNames())
    ).subscribe();
  }
   ngOnChanges(changes:SimpleChanges) {
    this.loadForm();
    // this.checkProcessExist(this.formOneData);
    this.onValueChange();
    this.loadTableAsPerValuationDate(changes);

    // #region Default set company type as public company
      this.selectedCompanyType = [{
        _id: "6598f0370b042902bcf9b7fb",
        companytypeid: 4,
        companytypename: "Public Company",
        isactive: true
      }]
      this.companyTypeDropdownValue = true;
    // #end-region
  }

  loadForm(){
    this.inputScreenForm = this.fb.group({
      companyStatus:[[], [Validators.required]],
      companyType:[[], [Validators.required]],
      descriptor:['', [Validators.required]],
      industryL3:['', [Validators.required]],
      industryL4:[[], [Validators.required]],
      companyName:['', [Validators.required]],
    });
  }

  loadEnums(){
    this.loadCiqIndustryList();
    this.loadCiqCompanyStatusType();
    this.loadCiqCompanyType();
  }

  checkProcessExist(data:any){
    // const formOneData = data?.industry ? data?.industry :  data?.formOneData?.industry;

    // if(formOneData){ 
    //  this.inputScreenForm.controls['industryL3'].setValue(formOneData);
    //   if(this.inputScreenForm.controls['industryL3'].value){
    //     this.levelThreeIndustryDescription = this.inputScreenForm.controls['industryL3'].value;
    //     this.loadCiqDescriptorBasedIndustry(this.inputScreenForm.controls['industryL3'].value);
    //   }
    //  }

     const formTwoData = data?.formTwoData;
     if(formTwoData){
      if(formTwoData?.industryL3){
        this.levelThreeIndustryDescription = formTwoData?.industryL3;
        this.loadCiqDescriptorBasedIndustry(formTwoData?.industryL3);
      }

      if(formTwoData?.industryL4){
        this.selectedLevelFourIndustry = formTwoData.industryL4.map((elements:any)=>{
          this.levelFourIndustryDescription.push(elements.GICSDescriptor);
          return elements
        })
      }

      // On load, patch selected company type values
      // if(formTwoData?.companyType){
      //   this.selectedCompanyType = formTwoData.companyType.map((elements:any)=>{
      //     this.companyTypeDescription.push(elements.companytypename);
      //     return elements
      //   })
      //   if(formTwoData?.companyType.length){
      //     this.companyTypeDropdownValue = true;
      //   }
      // }

      if(formTwoData?.companyStatus){
        this.selectedCompanyStatusType = formTwoData.companyStatus.map((elements:any)=>{
          this.companyStatusTypeDescription.push(elements.companystatustypename)
          return elements;
        })
        if(formTwoData?.companyStatus.length){
          this.companyStatusDropdownValue = true;
        }
      }

      if(formTwoData?.descriptor && this.inputScreenForm){
        this.descriptorQuery = formTwoData.descriptor;
        this.inputScreenForm.get('descriptor').setValue(this.descriptorQuery);
      }

      if(formTwoData?.selectedIndustries?.length){
        this.selectedIndustries = formTwoData.selectedIndustries;
        this.mainIndustries = formTwoData.selectedIndustries;
        
      }
     }
     if(data?.formOneData?.valuationDate){
       this.loadCiqIndustryBasedLevelFour(this.createPayload());
     }
  }

  comparer(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.GICSDescriptor === o2.GICSDescriptor : o2 === o2;
  }

  comparerCompany(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.companytypeid  === o2.companytypeid  : o2 === o2;
  }

  comparerStatusCompany(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.companystatustypeid  === o2.companystatustypeid  : o2 === o2;
  }

  onValueChange(){
    if(this.step !== 2) 
      return;

    this.inputScreenForm.controls['industryL3'].valueChanges.subscribe((val:any) => {
      if (val !== this.previousIndustryL3Value) {
        if (!val) {
          return;
        }
        this.previousIndustryL3Value = val;    
      this.loadCiqDescriptorBasedIndustry(val);

      this.levelThreeIndustryDescription = val;
      this.resetPaginator();
      this.loadCiqIndustryBasedLevelFour(this.createPayload());
      }
    });
    if(this.descriptorQuery){
      this.inputScreenForm.get('descriptor').setValue(this.descriptorQuery);
    }
    if(this.levelThreeIndustryDescription){
      this.inputScreenForm.controls['industryL3'].setValue(this.levelThreeIndustryDescription);
    }
    if(this.selectedLevelFourIndustry.length){
      this.industryFourDropdownValue = true;
    }
    if(this.formOneData?.location != this.secondStageInput?.formOneData?.location){
      this.loadCiqIndustryBasedLevelFour(this.createPayload());
    }
    this.filteredOptions = this.inputScreenForm.controls['descriptor'].valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );
  }

  loadTableAsPerValuationDate(changes:any){
    this.valuationDateNote = this.formOneData?.valuationDate;
    const formOneDataCurrentChanges = changes['formOneData']?.currentValue;
    const formOneDataPreviousChanges = changes['formOneData']?.previousValue;

    if(formOneDataCurrentChanges && formOneDataPreviousChanges && (formOneDataCurrentChanges?.valuationDate !== formOneDataPreviousChanges?.valuationDate || !formOneDataCurrentChanges?.valuationDate)){
      this.loadCiqIndustryBasedLevelFour(this.createPayload());
    }
  }

  async saveAndNext(){
    let totalBeta = 0 ;
    localStorage.setItem('stepTwoStats',`true`)
    this.calculationService.checkStepStatus.next({stepStatus:true,step:this.step});
    if(this.secondStageInput?.formTwoData){
      this.getCurrentStageData();
    }
    
    const processStateModel ={
      secondStageInput:{formFillingStatus:true,...this.inputScreenForm.value,totalBeta, selectedIndustries:this.mainIndustries, companies:this.meanMedianList},
      step:2
    }
    this.processStateManager(processStateModel,localStorage.getItem('processStateId'))
    this.screenInputDetails.emit({formFillingStatus:true, ...this.inputScreenForm.value, totalBeta, selectedIndustries:this.mainIndustries, companies:this.meanMedianList});
  }

  previous(){
    this.previousPage.emit(true)
  }

  loadCiqIndustry(industry:any,location:any){
    this.loader = true;
    this.ciqSpService.getSPCompanyBasedIndustry(industry,location).subscribe((ciqIndustry:any)=>{
      if(ciqIndustry.status){
        this.loader = false;
        this.ciqIndustryData = ciqIndustry?.data;
      }
      else{
        this.loader = false;
        this.snackBar.open(`industry not found`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        },);
      }
    },(error)=>{
      this.loader = false;
      this.snackBar.open(`${error}`, 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
        panelClass: 'app-notification-error',
      },); 
    })
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

  isIndustryId(row:any){
    if(row === INDUSTRY_BASED_COMPANY[2]){
      return true;
    }
    return false;
  }

  loadCiqIndustryList(){
    this.ciqSpService.fetchSPHierarchyBasedIndustry().subscribe((industryList:any)=>{
      if(industryList.status){
        this.levelThreeIndustry = industryList.data;
      }
      else{
       this.snackBar.open('CIQ Industry list not found','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },
    (error)=>{
      this.snackBar.open(`${error?.message}`,'OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
    })
  }

  loadCiqDescriptorBasedIndustry(descriptor:any){
    this.levelFourIndustryDescription = [];
    this.industryFourDropdownValue = false;
    this.industryFourDropdownFocused = false;
    if(!this.levelFourIndustry.length){
      this.ciqSpService.getSPLevelFourIndustryBasedList(descriptor).subscribe((levelFourIndustryData:any)=>{
        if(levelFourIndustryData.status){
          this.levelFourIndustry = levelFourIndustryData.data
        }
        else{
          this.snackBar.open('CIQ Industry (Level-4) list not found','OK',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-error'
          })
        }
      },
      (error)=>{
        this.snackBar.open(`${error}`,'OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      })
    }
  }

  loadCiqIndustryBasedLevelFour(payload:any){
    this.loader = true;
    this.selectAll = false;
    if(!this.formOneData?.valuationDate){
      this.loader = false
      this.snackBar.open('Valuation date is missing','Ok',{
        horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
      })
      return;
    }
    
    this.ciqSpService.getSPIndustryListByLevelFourIndustries(payload).subscribe((industryData:any)=>{
      if(industryData.status){
        this.loader = false;
        this.ciqIndustryData = industryData.data;
        if (this.selectedIndustries.length) {
          this.ciqIndustryData.forEach((row: any) => {
            row.isSelected = this.selectedIndustries.some((selectedIndustriesRow: any) => {
              return selectedIndustriesRow.COMPANYID === row.COMPANYID;
            });
            if(this.mainIndustries.length && !this.selectAll){
              this.selectAll = true;
            }            
          });
        }
        this.total = industryData.total;
        this.length = industryData.total;
        if(!this.ciqIndustryData.length){
          this.snackBar.open('No records to be found','OK',{
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'app-notification-error'
          })
        }
      }
      else{
        this.loader = false;
        this.snackBar.open('Companies not found','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },
    (error)=>{
      this.loader = false;
      this.snackBar.open(`${error}`,'OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }

  loadCiqCompanyStatusType(){
    this.ciqSpService.getSPCompanyStatusType().subscribe((companyStatusTypeData:any)=>{
      if(companyStatusTypeData.status){
        this.companyStatusType = companyStatusTypeData.data;
      }
      else{
        this.snackBar.open('CIQ Company Status type fetch failed','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },(error)=>{
      this.snackBar.open(`${error}`,'OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }

  loadCiqCompanyType(){
    this.ciqSpService.getSPCompanyType().subscribe((companyTypeData:any)=>{
      if(companyTypeData.status){
        this.companyType = companyTypeData.data;
      }
      else{
        this.snackBar.open('CIQ Company type fetch failed','OK',{
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'app-notification-error'
        })
      }
    },(error)=>{
      this.snackBar.open(`${error}`,'OK',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error'
      })
    })
  }

  onDropdownFocus(event: any, desc: string) {
    if(desc === 'industryFour'){
      this.industryFourDropdownFocused = event;
    }
    if(desc === 'companyStatus'){
      this.companyStatusDropdownFocused = event;
    }

    if(desc === 'companyType'){
      this.companyTypeDropdownFocused = event;
    }
  }

  onDropdownChange(event: any, desc: string) {
    if(desc === 'industryFour' && event?.value){
      this.handleLevelFourIndustry(event);
    }

    if(desc === 'companyStatus' && event?.value){
      this.handleCompanyStatusType(event);
    }

    if(desc === 'companyType' && event?.value){
      this.handleCompanyType(event);
    }
  }

  handleCompanyType(event:any){
    if(event.value?.length){
      this.companyTypeDropdownValue = true;
      const createCompanyType = event.value.map((elements: any)=>{
        return elements.companytypename
      })
      this.companyTypeDescription = createCompanyType;
    }
    else{
      this.companyTypeDropdownValue = false;
      this.companyTypeDescription = [];
    }

    this.resetPaginator();
    this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  handleCompanyStatusType(event:any){
    if(event.value.length){
      this.companyStatusDropdownValue = true;
      const createCompanyStatusType = event.value.map((elements: any)=>{
        return elements.companystatustypename
      })
      this.companyStatusTypeDescription = createCompanyStatusType;
    }
    else{
      this.companyStatusDropdownValue = false
      this.companyStatusTypeDescription = [];
    }

    this.resetPaginator();
    this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  handleLevelFourIndustry(event:any){
    if(event?.value.length){
      this.industryFourDropdownValue = true;
      const createLevelFourIndustry = event.value.map((elements: any)=>{
        return elements.GICSDescriptor
      })
      this.levelFourIndustryDescription = createLevelFourIndustry;
    }
    else{
      this.industryFourDropdownValue = false;
      this.levelFourIndustryDescription = [];
    }

    this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  filterByBusinessDescriptor(event:any){
    if(event.target.value === ""){
      this.descriptorQuery = ""
      this.searchByDescriptor.next(this.descriptorQuery);
    }
    else if(this.descriptorQuery !== event.target.value){
      this.descriptorQuery = event.target.value;
      this.searchByDescriptor.next(this.descriptorQuery);
      this.resetPaginator();
      this.utilService.getWordList(this.descriptorQuery).subscribe((wordsArray)=>{
        this.options = wordsArray
      })
    }
  }

  createPayload() {
    return {
      levelFourIndustries: this.levelFourIndustryDescription,
      companyStatusType: this.companyStatusTypeDescription,
      // companyType: this.companyTypeDescription,
      companyType: ["Public Company"], //use the above companyTypeDescription to automate the value of company type 
      industryName: this.levelThreeIndustryDescription,
      businessDescriptor: this.descriptorQuery,
      location: this.formOneData?.location || this.secondStageInput?.formOneData?.location,
      processStateId:localStorage.getItem('processStateId'),
      pageStart: this.pageStart,
      size: this.pageSize,
      valuationDate: this.formOneData?.valuationDate,
      companyName: this.companyQuery
    };
  }

 async onIndustryCheck(event:any, data:any){
    if(!data)
      return;
    if(event.target.checked){
      await this.createIndustryStructure(data);
    }
    else{
      await this.removeUncheckedIndustry(data)
    }
    // event.stopPropagation();
    // this.selectAll = this.ciqIndustryData.every((row:any) => row.isSelected);
    this.selectAll = true;
  }

  async createIndustryStructure(data:any){
    const checkIfIndustryExist = this.mainIndustries;
    if(!this.mainIndustries.length){
      this.mainIndustries.push(data)
      return 
    }
    const isCompanyExist = checkIfIndustryExist.some((elements:any)=>{elements?.COMPANYID === data.COMPANYID})
    if(!isCompanyExist){
      this.mainIndustries.push(data)
    }
  }

  async createMultiSelectIndustryStructure(data:any){
    this.mainIndustries.push(...data);
  }

  async removeUncheckedIndustry(data:any){
    this.mainIndustries.splice(this.mainIndustries.findIndex((element:any) => element.COMPANYID === data.COMPANYID),1);
  }

  removeMultiSelectIndustryStructure(){
    this.mainIndustries = [];
  }

  onCheckboxChange(event:any){
    if(event.target.checked){
      this.inputScreenForm.controls['industryL3'].setValue('');
      this.levelThreeIndustryDescription = '';
      this.resetPaginator();
      this.loadCiqIndustryBasedLevelFour(this.createPayload());
    }
  }

  onOptionSelection(event:any){
    if(event?.option?.value){
      this.descriptorQuery = event.option.value;
      this.loadCiqIndustryBasedLevelFour(this.createPayload())
    }
  }

  displayFn(value: string): string {
    return value || '';
  }

  filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option:any) => option.toLowerCase().includes(filterValue));
  }

  getCurrentStageData(){
    this.processStatusManagerService.getStageWiseDetails(localStorage.getItem('processStateId'), 'secondStageInput').subscribe(
      async (response: any) => {
        if (!response.status) {
          this.snackBar.open(`Industry not found`, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 3000,
            panelClass: 'app-notification-error',
          });
          return;
        }
    
        const areIndustriesEqual = response.data.secondStageInput.selectedIndustries.length === this.mainIndustries.length &&
          response.data.secondStageInput.selectedIndustries.every((previousIndustries: any) =>
            this.mainIndustries.some((newIndustries: any) =>
              previousIndustries?.COMPANYID === newIndustries?.COMPANYID
            )
          );
    
        if (!areIndustriesEqual) {
          this.calculationService.betaChangeDetector.next({ status: true });
        }
    
        this.calculationService.betaChangeDetector.next({ status: false });
      },
      (error) => {
        this.snackBar.open(`${error}`, 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
          panelClass: 'app-notification-error',
        });
      }
    );
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize, previousPageIndex, length } = event;

  if (previousPageIndex > pageIndex) {
    this.pageStart = Math.max(0, this.pageStart - pageSize);
  } else {
    this.pageStart += pageSize;
  }
  if (this.prevPageSize !== null && this.prevPageSize !== undefined && this.prevPageSize !== pageSize) {
    this.resetPaginator();
    this.prevPageSize = pageSize;
  }

  this.pageSize = pageSize;
  this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  resetPaginator(): void {
    if (this.paginator) {
      this.pageStart = 0;
      this.paginator.firstPage();
    }
  }
  companyDetails(data:any){
    this.ciqSpService.searchCiqEntityByCompanyId(data.COMPANYID).subscribe((companyData:any)=>{
      if(companyData.status){
        const data = {
          value: 'ciqCompanyDetails',
          companyDetails:companyData.data[0]
        }
        const dialogRef =  this.dialog.open(GenericModalBoxComponent, {data:data,width:'80%'});
      }
    })
  }

  onSelectAllChange() {
    let toggleMultiSelect = false;
    for (let row of this.ciqIndustryData) {
      row.isSelected = this.selectAll;
      if(this.selectAll){
        toggleMultiSelect = true
      }
    }
    
    if(toggleMultiSelect){
      this.createMultiSelectIndustryStructure(this.ciqIndustryData);
    }
    else{
      this.removeMultiSelectIndustryStructure();
    }
  }

  clearInput(controlName:string){
    this.inputScreenForm.controls[controlName].setValue('');

    this.clearControlRelatedInput(controlName);
    this.loadCiqIndustryBasedLevelFour(this.createPayload());
  }

  clearControlRelatedInput(control:string){
    switch(control){
      case 'industryL3':
        this.levelThreeIndustryDescription = '';
      break;
      case 'descriptor':
        this.descriptorQuery = '';
        break;
      case 'companyType':
        this.companyTypeDescription = [];
        break;
      case 'companyStatus':
        this.companyStatusTypeDescription = [];
        break;
      case 'companyName':
        this.companyQuery = '';
        break;
    }
  }

  loadBetaWorking() {
    this.loader = true;
    this.calculateSPindustryBeta(this.createBetaPayload());
  }
  
  createBetaPayload() {
    return {
      industryAggregateList: this.mainIndustries,
      betaSubType: BETA_SUB_TYPE[0],
      taxRate: this.formOneData.taxRate,
      betaType: 'levered',
      valuationDate: this.formOneData.valuationDate
    };
  }
  
  calculateSPindustryBeta(betaPayload: any) {
    this.ciqSpService.calculateSPindustryBeta(betaPayload).subscribe(
      (betaData: any) => {
        if (betaData.status) {
          this.processBetaData(betaData);
        } else {
          this.handleError('Beta not found');
        }
      },
      (error) => {
        this.handleError('Beta calculation failed, please retry');
      }
    );
  }
  
  processBetaData(betaData: any) {
    this.processStatusManagerService.fetchProcessIdentifierId(localStorage.getItem('processStateId')).subscribe(
      async (processManagerDetails: any) => {
        if (processManagerDetails) {
          this.upsertBetaWorking(betaData, processManagerDetails.processIdentifierId);
        } else {
          this.handleError('Beta upsertion failed');
        }
      },
      (error) => {
        this.loader = false;
        this.handleError('Beta upsertion failed');
      }
    );
  }
  
  upsertBetaWorking(betaData: any, processIdentifierId: string) {
    const payload = {
      coreBetaWorking: betaData.coreBetaWorking,
      betaMeanMedianWorking: betaData.betaMeanMedianWorking,
      processIdentifierId: processIdentifierId
    };
    this.ciqSpService.upsertBetaWorking(payload).subscribe(
      async (upsertionStat: any) => {
        if (upsertionStat.status) {
          this.fetchBetaWorking(upsertionStat.processIdentifierId);
        } else {
          this.handleError('Beta working upsertion failed');
        }
      },
      (error) => {
        this.handleError('Beta working upsertion failed');
      }
    );
  }
  
  fetchBetaWorking(processIdentifierId: string) {
    this.ciqSpService.fetchBetaWorking(processIdentifierId).subscribe(
      (betaWorkingResponse: any) => {
        if (betaWorkingResponse.status) {
          this.openBetaWorkingDialog(betaWorkingResponse.data);
        } else {
          this.handleError('Beta working not found');
        }
      },
      (error) => {
        this.handleError('Backend error - Beta working not found');
      }
    );
  }
  
  openBetaWorkingDialog(betaData: any) {
    this.loader = false;
    const data = {
      value: 'betaCalculation',
      coreBetaWorking: betaData.coreBetaWorking,
      betaMeanMedianWorking: betaData.betaMeanMedianWorking
    };
    this.dialog.open(GenericModalBoxComponent, { data: data, width: '90%', maxHeight: '90vh', panelClass: 'custom-dialog-container' });
  }
  
  handleError(errorMessage: string) {
    this.loader = false;
    this.snackBar.open(errorMessage, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
      panelClass: 'app-notification-error'
    });
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  companyInputFocused(){
    this.companyInput = true;
  }

  companyInputBlurred(){
    this.companyInput = false;
  }

  filterByCompanyName(event:any){
    if(event.target.value && this.companyQuery !== event.target.value){
      this.companyQuery = event.target.value;
      this.searchByCompanyName.next(this.companyQuery);
    }
  }

  fetchCompanyNames(){
    this.utilService.fuzzySearchCompanyName(this.companyQuery).subscribe((data:any)=>{
      if(data?.companyDetails?.length){
        this.companyList = data.companyDetails;
      }
    },(error)=>{
      this.snackBar.open('Backend error - company details not found', 'Ok',{
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'app-notification-error',
      })
    })
  }

  onCompanySelection(event:any){
    if(event?.option?.value){
      this.companyQuery = event.option.value;
      this.fetchCompanyNames();
      this.loadCiqIndustryBasedLevelFour(this.createPayload())
    }
  }
}
