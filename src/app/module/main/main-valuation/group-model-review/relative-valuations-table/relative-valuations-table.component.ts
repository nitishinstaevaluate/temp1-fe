import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RELATIVE_VALUATION_COMPANY_COLUMNS, RELATIVE_VALUATION_COMPANY_MAPPING, RELATIVE_VALUATION_INDUSTRY_COLUMNS, RELATIVE_VALUATION_INDUSTRY_MAPPING } from 'src/app/shared/enums/constant';
import { IS_ARRAY_EMPTY_OR_NULL, formatPositiveAndNegativeValues } from 'src/app/shared/enums/functions';
import { CalculationsService } from 'src/app/shared/service/calculations.service';
import { ValuationService } from 'src/app/shared/service/valuation.service';

@Component({
  selector: 'app-relative-valuations-table',
  templateUrl: './relative-valuations-table.component.html',
  styleUrls: ['./relative-valuations-table.component.scss']
})
export class RelativeValuationsTableComponent implements OnChanges, OnInit {
  @Input() tableData : any = [];
  @Input() formData : any;
  @Input() multiples : any;
  @Output() recalculateCcmValuation = new EventEmitter();
  @Input() ccmValuationMetric : any;

  companyColumn = RELATIVE_VALUATION_COMPANY_COLUMNS;
  companyColumnMap = RELATIVE_VALUATION_COMPANY_MAPPING;
  industryColumn = RELATIVE_VALUATION_INDUSTRY_COLUMNS;
  industryColumnMap = RELATIVE_VALUATION_INDUSTRY_MAPPING;

  companyData :any;
  averageMedianData:any = [];
  industryData:any = new MatTableDataSource();
  ccmCompanyTableLoader = false;
  peSelection = true;
  psSelection = true;
  pbSelection = true;
  evEbitdaSelection = true;
  constructor(
    private valuationService: ValuationService,
    private calculationService: CalculationsService){}
  ngOnChanges(changes: SimpleChanges): void {
    this.companyData = [];
    this.industryData = [];
    this.companyData = this.tableData?.company;
    // this.industryData = this.tableData?.industry;
    // if(this.companyData && this.companyData?.length>0 && !this.isArrayEmptyOrNull(this.companyData)){
    // this.checkAverageExist(); // check if average object already exist or not in company array,if exist then splice and add new one,else create new
    // this.checkMedianExist(); // check if median object already exist or not in company array,if exist then splice and add new one,else create new one
    // }
    this.loadPostDiscountMultiples();
  }

  ngOnInit(): void {
    this.calculationService.ccmValuationDetector.subscribe((info)=>{
      if(info.status){
          this.ccmCompanyTableLoader = false;
        }
    })
  }
    loadPostDiscountMultiples(){
      // Patching multiples first
      if(this.multiples){
        this.peSelection = this.multiples.peSelection;
        this.pbSelection = this.multiples.pbSelection;
        this.psSelection = this.multiples.psSelection;
        this.evEbitdaSelection = this.multiples.evEbitdaSelection;
        this.calculationService.multiplesSelector.next(this.multiples);
      }
      else{
        this.resetMultiples();
        this.calculationService.multiplesSelector.next(this.multiples);
      }

      const isSelectedExists = this.tableData?.company.some((indCompanies: any) => 'isSelected' in indCompanies);

      // If isSelected doesn't exist, set it to true for all objects
      if (!isSelectedExists) {
          this.companyData.forEach((indCompanies: any) => {
              indCompanies.isSelected = true;
          });
      }

      const averageIndex = this.tableData?.company.findIndex((item:any)=>item?.company === 'Average');
      if(averageIndex !== -1){
        const spliced = this.tableData?.company.splice(averageIndex, 1);
        const checkIfAverageExistIndex = this.averageMedianData.findIndex((avg:any)=>avg?.company === 'Average')
        if(checkIfAverageExistIndex !== -1){
            this.averageMedianData.splice(checkIfAverageExistIndex, 1, ...spliced)
        }
        else{
          this.averageMedianData.push(...spliced);
        }
      }

      const medianIndex = this.tableData?.company.findIndex((item:any)=>item?.company === 'Median');
      if(medianIndex !== -1){
        const spliced = this.tableData?.company.splice(medianIndex, 1);
        const checkIfMedianExistIndex = this.averageMedianData.findIndex((med:any)=>med?.company === 'Median')
        if(checkIfMedianExistIndex !== -1){
            this.averageMedianData.splice(checkIfMedianExistIndex, 1, ...spliced)
        }
        else{
          this.averageMedianData.push(...spliced);
        }
      }

      // Calculate post multiples
      // Here first check if POST multiple exist or not in array (since this is child component, it is getting called few times in different components)
      const checkIfAlreadyExist = this.averageMedianData.findIndex((item:any)=>item?.company.includes('Post Discount Multiple'));
      if(this.averageMedianData?.length){
        // If POST multiple doesn't exist, then push the new post multiples
        if(checkIfAlreadyExist === -1){
          this.computePostMultiples();
        }
        else{
          // If POST multiple exist, then first splice the old post multiples and then push the new one's
          const indexOfPstMltpleAvg = this.averageMedianData.findIndex((avg:any)=>avg?.company === "Post Discount Multiple (Average)")
          if(indexOfPstMltpleAvg !== -1){
            this.averageMedianData.splice(indexOfPstMltpleAvg);
          }
          
          const indexOfPstMltpleMed = this.averageMedianData.findIndex((med:any)=>med?.company === "Post Discount Multiple (Median)")
          if(indexOfPstMltpleMed !== -1){
            this.averageMedianData.splice(indexOfPstMltpleMed);
          }

          this.computePostMultiples();
        }
      }
  }

  computePostMultiples(){
    let postMultipleAverage, postMultipleMedian;
    this.averageMedianData.map((indCompanyData:any)=>{  
    if(indCompanyData.company === 'Average'){
      postMultipleAverage = {
        company: 'Post Discount Multiple (Average)',
        peRatio: indCompanyData.peRatio ? indCompanyData.peRatio.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0,
        pbRatio: indCompanyData.pbRatio ? indCompanyData.pbRatio.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0,
        ebitda: indCompanyData.ebitda ?  indCompanyData.ebitda.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0,
        sales: indCompanyData.sales ? indCompanyData.sales.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0
      }
    }
    if(indCompanyData.company === 'Median'){
      postMultipleMedian = {
        company: 'Post Discount Multiple (Median)',
        peRatio: indCompanyData.peRatio ? indCompanyData.peRatio.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0,
        pbRatio: indCompanyData.pbRatio ? indCompanyData.pbRatio.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0,
        ebitda: indCompanyData.ebitda ? indCompanyData.ebitda.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0,
        sales: indCompanyData.sales ? indCompanyData.sales.toFixed(2) * (1-this.formData.formOneAndThreeData.discountRateValue/100) : 0
      }
    }
  })
  this.averageMedianData.push(postMultipleAverage, postMultipleMedian);
  }

  isArrayEmptyOrNull(array: any): boolean {
    return IS_ARRAY_EMPTY_OR_NULL(array);
  }

  updateDecimal(data:any){
    if(data){
      return formatPositiveAndNegativeValues(data);
    }
    else{
      return '-';
    }
  }

  addStylingConditions(element:any){
    if (this.updateDecimal(element) === '-') {
      return 'add-padding';
    }
    return '';
  }

  selectCompany(index: number, multiples?:boolean, multipleName?:string) {
    this.ccmCompanyTableLoader = true;
    if(!multiples){
      this.companyData[index].isSelected = !this.companyData[index].isSelected;
    }
    if(multiples){
      if(multipleName === 'peSelection'){
        this.peSelection = !this.peSelection;
      }
      else if (multipleName === 'pbSelection'){
        this.pbSelection = !this.pbSelection;
      }
      else if (multipleName === 'psSelection'){
        this.psSelection = !this.psSelection;
      }
      else if (multipleName === 'evEbitdaSelection'){
        this.evEbitdaSelection = !this.evEbitdaSelection;
      }
    }
    const structure = {
      companyList: this.companyData,
      multiplesSelection:{
        pbSelection:this.pbSelection,
        peSelection:this.peSelection,
        evEbitdaSelection:this.evEbitdaSelection,
        psSelection:this.psSelection,
      }
    } 
    this.recalculateCcmValuation.emit(structure);
}
resetMultiples(){
  this.pbSelection = true;
  this.peSelection = true; 
  this.evEbitdaSelection = true;
  this.psSelection = true;
}
}
