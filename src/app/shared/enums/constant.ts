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
  RULE_ELEVEN_UA: 'ruleElevenUa',
}

export const ALL_MODELS = {
  FCFE:'Free Cash Flow to Equity',
  FCFF:'Free Cash Flow to Firm',
  Relative_Valuation:'Comparable Companies',
  CTM:'Comparable Transaction',
  NAV:'Net Asset Value',
  Market_Price:'Market Price',
  Excess_Earnings:"Excess Earning",
  ruleElevenUa:"Rule Eleven UA",
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

    },
    TARGET_CAPITAL_STRUCTURE:{
      name:"Target Capital Structure",
      value:"targetCapitalStructure",
      options:{
        debtProp:{
          name:"Debt Proportion"
        },
        equityProp:{
          name:"Equity Proportion"
        },
        prefProp:{
          name:"Preference Share Capital Proportion"
        },
        totalCapital:{
          name:"Total Capital"
        }
      }
    },
    PREVIEW_DOC:{
      name:'Valuation Report Preview',
      value:'previewDoc'
    },
    VALUATION_METHOD:{
      name:"valuationMethod",
      value:"valuationMethod",
      incomeApproach:{
        label:'Income Approach',
        fcfe:{
          name:'DCF-Method FCFE',
          info:'This is FCFE model'
        },
        fcff:{
          name:'DCF-Method FCFF',
          info:'This is FCFF model'
        },
        excessEarning:{
          name:'Excess Earning Method',
          info:'This is Excess Earning model'
        },
      },
      assetApproach:{
        label:'Asset Approach',
        nav:{
          name:'Net Asset Value (NAV) Method',
          info:'This is NAV model'
        }
      },
      marketApproach:{
        label:'Market Approach',
        ccm:{
          name:'Comparable Companies Method (CCM)',
          info:'This is CCM model'
        },
        ctm:{
          name:'Comparable Transaction Method (CTM)',
          info:'This is CTM model'
        },
        marketPriceMethod:{
          name:'Market Price Method',
          info:'This is Market Price model'
        }
      },
      ruleElevenUaApproach:{
        label:'Rule 11 UA Approach',
        ruleElevenUa:{
          name:'Rule 11 UA Method',
          info:'This is NAV model'
        }
      },
    },
    RISK_FREE_RATE:{
      name:"Risk Free Rate",
      value:"customRiskFreeRate"
    },
    RESTORE_SESSION:{
      name:"Session Found",
      value:"restoreSession"
    },
    CIQ_COMPANY_DETAILS:{
      value:'ciqCompanyDetails',
      name:"CIQ Company Details"
    }
  }

  export const INCOME_APPROACH = ['FCFE','FCFF','Excess_Earnings'];

  export const NET_ASSET_APPROACH = ['NAV'];

  export const RULE_ELEVEN_UA_APPROACH = ['ruleElevenUa'];

  export const MARKET_APPROACH = ['Relative_Valuation','CTM','Market_Price'];

export const RELATIVE_VALUATION_COMPANY_MAPPING: { [key: string]: string } = {
  'Company Name': 'company',
  'P/E': 'peRatio',
  'P/B': 'pbRatio',
  'EV/EBITDA': 'ebitda',
  'P/S': 'sales'
}

export const RELATIVE_VALUATION_INDUSTRY_MAPPING: { [key: string]: string } = {
  'Industry Name': 'industry',
  'P/E': 'currentPE',
  'P/B': 'pbv',
  'EV/EBITDA': 'evEBITDA_PV',
  'P/S': 'priceSales'
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

export const RELATIVE_VALUATION_INDUSTRY_COLUMNS = ['Industry Name', 'P/E', 'P/B', 'EV/EBITDA', 'P/S'];

export const RELATIVE_VALUATION_COMPANY_COLUMNS = ['Company Name', 'P/E', 'P/B', 'EV/EBITDA', 'P/S'];

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
 'Value per Share (INR)'
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
  'Value per Share (INR)'
]

export const EXCESS_EARNING_COLUMN=[
'Networth',
'PAT',
'Expected Profit COE',
'Excess Return',
'Discounting Period',
'Discounting Factor',
'Present Value Of Excess Return',
'Sum of Cash Flows',
'Book Value',
'Equity Value on',
'No. of Shares',
'Value per Share (INR)'
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

export const REPORT_OBJECTIVE = {
  companiesAct:"Companies Act",
  ita1961:"Income Tax Act, 1961",
  fema:"Fema",
  sebiRegulations:"SEBI Regulations",
}

export const INDUSTRY_BASED_COMPANY = ['COMPANYID', 'COMPANYNAME', 'SIMPLEINDUSTRYID', 'SIMPLEINDUSTRYDESCRIPTION'];

export const BETA_SUB_TYPE = ['meanBeta', 'medianBeta'];