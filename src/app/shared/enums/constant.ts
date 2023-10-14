export const FCFE_HEADING_OBJ = {
  particulars: 'Particulars',
  pat: 'PAT',
  depAndAmortisation: 'Depn and Amortisation',
  onCashItems: 'Other Non Cash items',
  nca: 'Change in NCA',
  changeInBorrowings: 'Change in Borrowings',
  defferedTaxAssets: 'Add/Less: Deferred Tax Assets(Net)',
  netCashFlow: 'Net Cash Flow',
  fixedAssets: 'Change in fixed assets',
  fcff: 'FCFE',
  discountingPeriod: 'Discounting Period',
  discountingFactor: 'Discounting Factor',             //  '@WACCAT' removed this
  presentFCFF: 'Present Value of FCFE',
  sumOfCashFlows: 'Sum of Cash Flows',
  // debtOnDate: 'Less: Debt as on Date',
  cashEquivalents: 'Add: Cash & Cash Equivalents',
  surplusAssets: 'Add: Surplus Assets/Investments',
  otherAdj: 'Add/Less: Other Adjustments(if any)',
  equityValue: 'Equity Value',
  noOfShares: 'No. of Shares',
  valuePerShare: 'Value per Share',
};


export const FCFF_HEADING_OBJ = {
  particulars: 'Particulars',
  pat: 'PAT',
  addInterestAdjTaxes: 'Add: Interest adjusted Taxes',
  depAndAmortisation: 'Depn and Amortisation',
  onCashItems: 'Other Non Cash items',
  nca: 'Change in NCA',
  defferedTaxAssets: 'Add/Less: Deferred Tax Assets(Net)',
  netCashFlow: 'Net Cash Flow',
  fixedAssets: 'Change in fixed assets',
  fcff: 'FCFF',
  discountingPeriod: 'Discounting Period',
  discountingFactor: 'Discounting Factor',             //  '@WACCAT' removed this
  presentFCFF: 'Present Value of FCFF',
  sumOfCashFlows: 'Sum of Cash Flows',
  debtOnDate: 'Less: Debt as on Date',
  cashEquivalents: 'Add: Cash & Cash Equivalents',
  surplusAssets: 'Add: Surplus Assets/Investments',
  otherAdj: 'Add/Less: Other Adjustments(if any)',
  equityValue: 'Equity Value',
  noOfShares: 'No. of Shares',
  valuePerShare: 'Value per Share',
};

export const EXCESS_EARNING_HEADING_OBJ={
  particulars:'Particulars',
  netWorth:'Networth',
  pat:'PAT',
  expectedProfitCOE:'Expected Profit COE',
  excessReturn:'Excess Return',
  discountingPeriod:'Discount Period',
  discountingFactor:'Discount Factor',
  presentValueOfExcessReturn:'Present Value Of Excess Return',
  sumOfCashFlows:'Sum of Cash Flows',
  bookValue:'Book Value',
  equityValue:'Equity Value',
  noOfShares:'No. of Shares',
  valuePerShare:'Value per Share'
}

export const PAGINATION_VAL = [10, 20, 50, 100];

export const MODELS = {
  FCFE: 'FCFE',
  FCFF: 'FCFF',
  NAV: 'NAV',
  RELATIVE_VALUATION: 'Relative_Valuation',
  EXCESS_EARNINGS: 'Excess_Earnings',
  COMPARABLE_INDUSTRIES: 'CTM',
}

  export const GLOBAL_VALUES = {
    Normal_Tax_Rate:{
      name:"Normal Tax Rate",
      value:"Normal_Tax_Rate"
    },
    MAT_Rate:{
      name:"Mat Tax Rate",
      value:"MAT_Rate"
    },
    ANALYST_CONSENSUS_ESTIMATES:{
      name:"Analyst Consensus Estimates",
      value:"ACE"
    },
    GOING_CONCERN:{
     name:"Going Concern Approach",
     value:"Going_Concern",
     options:{
      projectionYears:{
        name:"Projection Years",
        value:"Going_Concern"
       },
       terminalGrowthRate:{
        name:"Terminal Growth Years",
        value:"Going_Concern"
       }
     }
    },
    SPECIFIC_RISK_PREMIUM:{
      name:"Specific Risk Premium/Alpha",
      value:"specificRiskPremiumForm",
      options:{
        qualitativeFactors:{
          name:"Qualitative Factors"
        },
        companySizw:{
          name:"Company Size"
        },
        marketPosition:{
          name:"Market Positioning"
        },
        liquidityFactor:{
          name:"Liquidity Factor"
        },
        competition:{
          name:"Competition"
        }
      }
    },
    REGISTERED_VALUER_DETAILS:{
      value:'registeredValuerDetails',
      name:'Registered Valuer Details',
      data:{
        registeredValuerName:"Full Name",
        registeredValuerMobileNumber:'Mobile Number',
        registeredValuerEmailId:"Email-Id",
        registeredValuerIbbiId:'Ibbi-Id',
        registeredValuerGeneralAddress:'Address',
        registeredValuerCorporateAddress:'Corporate Address',
        registeredValuerQualifications:'Qualifications',
        registeredvaluerDOIorConflict:'Disclosure of Interest or Conflicts',
        otherinvolvedExperts:'Other Involved Experts'
      }

    }
  }
export const RELATIVE_VALUATION_COMPANY_MAPPING: { [key: string]: string } = {
  'Company Name': 'company',
  'PE Ratio': 'peRatio',
  'PB Ratio': 'pbRatio',
  'EbitDA': 'ebitda',
  'Sales': 'sales'
}

export const RELATIVE_VALUATION_INDUSTRY_MAPPING: { [key: string]: string } = {
  'Industry Name': 'industry',
  'PE Ratio': 'currentPE',
  'PB Ratio': 'pbv',
  'EbitDA': 'evEBITDA_PV',
  'Sales': 'priceSales'
}

export const VALUATION_RESULT_FCFE_MAPPING: { [key: string]: string } = {
  'Particulars': 'particulars',
  'PAT': 'pat',
  'DEP And Amortisation': 'depAndAmortisation',
  'On Cash Items': 'onCashItems',
  'NCA': 'nca',
  'Change In Borrowings': 'changeInBorrowings',
  'Deffered Tax Assets': 'defferedTaxAssets',
  'Net Cash Flow': 'netCashFlow',
  'Fixed Assets': 'fixedAssets',
  'FCFF': 'fcff',
  'Discounting Period': 'discountingPeriod',
  'Discounting Factor': 'discountingFactor',
  'Present FCFF': 'presentFCFF',
  'Sum Of Cash Flows': 'sumOfCashFlows',
  'Cash Equivalents': 'cashEquivalents',
  'Surplus Assets': 'surplusAssets',
  'Other Adjustment': 'otherAdj',
  'Equity Value': 'equityValue',
  'No. of Shares': 'noOfShares',
  'Value per share': 'valuePerShare',
}

export const RELATIVE_VALUATION_INDUSTRY_COLUMNS = ['Industry Name', 'PE Ratio', 'PB Ratio', 'EbitDA', 'Sales'];

export const RELATIVE_VALUATION_COMPANY_COLUMNS = ['Company Name', 'PE Ratio', 'PB Ratio', 'EbitDA', 'Sales'];

export const IS_FCFE_CHECK = [
  'particulars','pat', 'depAndAmortisation','onCashItems','nca','changeInBorrowings','defferedTaxAssets', 'netCashFlow','fixedAssets','fcff','discountingPeriod','discountingFactor','presentFCFF',
  'sumOfCashFlows','cashEquivalents','surplusAssets','otherAdj','equityValue', 'noOfShares', 'valuePerShare']

export const FCFE_COLUMN = [
 'PAT',
 'Depn and Amortisation',
 'Other Non Cash items',
 'Change in NCA',
 'Change in Borrowings',
 'Add/Less: Deferred Tax Assets(Net)',
 'Net Cash Flow',
 'Change in fixed assets',
 'FCFE',
 'Discounting Period',
 'Discounting Factor',
 'Present Value of FCFE',
 'Sum of Cash Flows',
 'Add: Cash & Cash Equivalents',
 'Add: Surplus Assets/Investments',
 'Add/Less: Other Adjustments(if any)',
 'Equity Value on',
 'No. of Shares',
 'Value per Share',
]
export const FCFF_COLUMN = [
  'PAT',
  'Add: Interest adjusted Taxes',
  'Depn and Amortisation',
  'Other Non Cash items',
  'Change in NCA',
  'Add/Less: Deferred Tax Assets(Net)',
  'Net Cash Flow',
  'Change in fixed assets',
  'FCFF',
  'Discounting Period',
  'Discounting Factor',
  'Present Value of FCFF',
  'Sum of Cash Flows',
  'Less: Debt as on Date',
  'Add: Cash & Cash Equivalents',
  'Add: Surplus Assets/Investments',
  'Add/Less: Other Adjustments(if any)',
  'Equity Value on',
  'No. of Shares',
  'Value per Share'
]

export const EXCESS_EARNING_COLUMN=[
'Networth',
'PAT',
'Expected Profit COE',
'Excess Return',
'Discount Period',
'Discount Factor',
'Present Value Of Excess Return',
'Sum of Cash Flows',
'Book Value',
'Equity Value on',
'No. of Shares',
'Value per Share'
]

export const COMMON_COLUMN = [
  "Particulars",
  "2023-24",
  "2024-25",
  "2025-26",
  "2026-27",
  "2027-28",
  "Terminal Value"
];