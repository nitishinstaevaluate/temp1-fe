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
  MARKET_PRICE:'Market_Price',
  SLUMP_SALE:'slumpSale'
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
  slumpSale:"Slump Sale"
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
          info:'This is Rule 11 UA model'
        }
      },
      slumpSaleApproach:{
        label:'Slump Sale Approach',
        slumpSale:{
          name:'Slump Sale Method',
          info:'This is Slump Sale model'
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
    },
    CHECKLIST_TYPES:{
      DATA_CHECKLIST:{
        value:'dataCheckList',
        name:'Data checklist form'
      }
    },
    BETA_CALCULATION:{
      value:'betaCalculation',
      name:'Beta Computation'
    },
    TERMINAL_VALUE_WORKING:{
      value:'terminalValueWorking',
      name:"Terminal value working",
      terminalValueCashFlowBased:{
        value:'terminalValueCashFlowBased',
        name:"Calculation of terminal value"
      },
      terminalValuePatBased:{
        value:'terminalValuePatBased',
        nameOne:"Calculation of Terminal Year Cash Flows",
        nameTwo:"Calculation of terminal value"
      }
    },
    CUSTOM_BETA:{
      value:'customBeta',
      name:'Custom Beta'
    },
    SENSITIVITY_ANALYSIS:{
      value:'sensitivityAnalysis',
      name:'Sensitivity Analysis'
    },
    REVALUATION_SA_MODEL:{
      value:'revaluationSAModel',
      name:'Workings'
    },
  }

  export const helperText = {
    fcffModelLabel: 'Cash flow available to all claimholders of a firm, including both debt and equity holders, after operating expenses and capital expenditures have been deducted from revenue.',
    fcfeModelLabel: 'Cash flow available to equity holders of a firm, after interest payments on debt have been deducted from operating cash flow.',
    excessEarningModelLabel: `Estimate the present value of a company's future cash flows by subtracting the cost of capital from the operating cash flow to arrive at the excess earnings, which are then discounted to their present value.`,
    navModelLabel: `Estimate the value of a company by subtracting the total liabilities from the total assets to arrive at the net asset value, which represents the value of the company's assets minus its liabilities.`,
    comparableCompaniesModelLabel: `Estimate the value of a company by comparing it to similar publicly traded companies, and using their valuation multiples, such as price-to-earnings ratio or enterprise value-to-EBITDA ratio, to estimate the value of the company.`,
    comparableTransactionModelLabel: `Estimate the value of a company by analyzing the values paid in similar mergers and acquisitions transactions, and using those values as a basis for estimating the value of the company. This method is particularly useful when there are no comparable public companies or when the company's financials are not publicly available.`,
    marketPriceModelLabel: `Estimate the value of a company by comparing its market price to its financial metrics, such as earnings, revenue, or book value`,
    ruleElevenModelLabel: `Estimate the value of a company for the purpose of mergers and acquisitions, takeovers, and other financial transactions. It is a judicial approach that is based on the principles of the Indian Companies Act, 1956, and the Securities and Exchange Board of India (SEBI) regulations.`,
    companyName:`The company name is a unique identifier used to distinguish and refer to a specific organization within a particular context, such as business operations, financial transactions, or legal documents.`,
    valuationDate: `The valuation date represents the specific point in time used for assessing the financial worth or value of an asset, investment, or company.`,
    location: `The location, or geographic presence, of a company is considered during valuation to assess factors such as market demand, competition, regulatory environment, and operational costs, all of which can influence the company's worth.`,
    outstandingShares: `Outstanding shares are pivotal in valuation, serving as the basis for calculating key metrics like earnings per share and market capitalization.`,
    reportingUnit:`Reporting units in valuation are used to normalize financial figures, facilitating comparisons across different scales such as millions, lakhs, crores, or thousands, ensuring consistent analysis and decision-making.`,
    currencyUnit:`In valuation, a currency unit represents the monetary denomination used to express financial figures, aiding in the comparison and understanding of financial data across different currencies.`,
    taxRate:`Tax rate in valuation is the percentage applied to assess the tax liability or expense on taxable income, influencing the after-tax cash flows used in financial analysis.`,
    uploadTemplate:`Upload provisional statement for Profit & Loss and Balance Sheet as per template. Make sure the template format is as per the the provided excel template.`,
    uploadAuditedTemplate:`Upload audited template.`,
    discountRateValue:`Less discount rate.`,
    tvCashFlowBased:`Estimation of a company's worth beyond the forecast period, based on its last year cash flow, discount rate, and long-term growth rate. It represents the perpetual value of the company assuming constant growth.`,
    tvPatBased:`Estimation of company value at the end of a forecast period, calculated based on the last year's Profit After Tax, discount rate, and long-term growth rate. It signifies the perpetual value of the company considering profit figures.`,
    capitalIqBetaDesc:`Capital IQ is used to calculate beta for valuation due to its extensive financial data coverage, aiding in the analysis of a stock's volatility relative to the market.`,
    aswathDamodaranBetaDesc:`Aswath Damodaran's methodologies are utilized for beta calculation due to their robustness and insight into market dynamics, ensuring accurate risk assessment relative to the market.`,
    faceValue:`Face value`,
    slumpSaleModelLabel:`Assess the value of a company for the purpose of mergers and acquisitions, takeovers, and other financial transactions. It is a regulatory approach based on UAE-specific legal frameworks, involving the transfer of a business unit as a going concern without assigning individual values to assets and liabilities, and requiring regulatory approval and adherence to legal provisions.`
    vwapNse:`VWAP on NSE represents the average price of a security traded throughout the day, weighted by the volume of trades on the NSE, indicating the true average trading price during that period.`,
    vwapBse:`VWAP on BSE is the average price of a security traded throughout the day, weighted by the volume of trades on the BSE, reflecting the actual average trading price over the given timeframe.`
  }

  export const CHECKLIST_TYPES = {
    mandateChecklist:"mandatechecklist",
    dataCheckList: "datachecklist"
  }

  export const GET_MULTIPLIER_UNITS:any = {
    absolute:1,
    Hundreds:100,
    Thousands:1000,
    Lakhs:100000,
    Millions:1000000,
    Crores:10000000
}

  export const INCOME_APPROACH = ['FCFE','FCFF','Excess_Earnings'];

  export const NET_ASSET_APPROACH = ['NAV'];

  export const RULE_ELEVEN_UA_APPROACH = ['ruleElevenUa', 'slumpSale'];

  export const MARKET_APPROACH = ['Relative_Valuation','CTM','Market_Price'];

export const RELATIVE_VALUATION_COMPANY_MAPPING: { [key: string]: string } = {
  'Company Name': 'company',
  'P/E': 'peRatio',
  'P/B': 'pbRatio',
  'P/S': 'sales',
  'EV/EBITDA': 'ebitda'
}

export const RELATIVE_VALUATION_INDUSTRY_MAPPING: { [key: string]: string } = {
  'Industry Name': 'industry',
  'P/E': 'currentPE',
  'P/B': 'pbv',
  'P/S': 'priceSales',
  'EV/EBITDA': 'evEBITDA_PV'
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

export const RELATIVE_VALUATION_INDUSTRY_COLUMNS = ['Industry Name', 'P/E', 'P/B', 'P/S', 'EV/EBITDA'];

export const RELATIVE_VALUATION_COMPANY_COLUMNS = ['Company Name', 'P/E', 'P/B', 'P/S', 'EV/EBITDA'];

export const IS_FCFE_CHECK = [
  'particulars','pat', 'depAndAmortisation','onCashItems','nca','changeInBorrowings','defferedTaxAssets', 'netCashFlow','fixedAssets','fcff','discountingPeriod','discountingFactor','presentFCFF',
  'sumOfCashFlows','cashEquivalents','surplusAssets','otherAdj','equityValue', 'noOfShares', 'valuePerShare']

export const FCFE_COLUMN = [
 'PAT',
 'Depn and Amortisation',
 'Other Non Cash items',
 'Change in NCA',
 'Change in Borrowings',
 'Add/Less: Deferred Tax Assets (Net)',
 'Net Cash Flow',
 'Change in fixed assets',
 'FCFE',
 'Discounting Period',
 'Discounting Factor',
 'Present Value of FCFE',
 'Sum of Discounted Cash Flows (Explicit Period)',
 'Present Value of Terminal Value',
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
  'Add/Less: Deferred Tax Assets (Net)',
  'Net Cash Flow',
  'Change in fixed assets',
  'FCFF',
  'Discounting Period',
  'Discounting Factor',
  'Present Value of FCFF',
  'Sum of Discounted Cash Flows (Explicit Period)',
  'Present Value of Terminal Value',
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

export const BETA_FROM_TYPE = {
  ASWATHDAMODARAN:'aswathDamodaran',
  CAPITALIQ:'capitalIqBeta'
}

export const ADD_SPACE_BEFORE_LINE_ITEM_PL = [
  'Other Non-Operating Income',
  'Expenses',
  'Other Non-Operating expenses:',
  'Total Expense',
  'Earnings Before Interest Taxation, Depreciation and Amortisation (EBITDA)',
  'Earnings Before Interest Taxation (EBIT)',
  'Profit/(loss) before exceptional items and tax (I - IV)',
  'Profit/(loss) before tax (V-VI)',
  'Profit (Loss) for the period from continuing operations (VII-VIII)',
  'Profit/(loss) for the period (IX+XII)',
  'Other Comprehensive Income',
  'A',
  'Total Comprehensive Income for the period (XIII+XIV) (Comprising Profit (Loss) and Other Comprehensive Income for the period)'
]

export const ADD_SPACE_BEFORE_LINE_ITEM_BS = [
  'Non-current assets',
  'Total non current assets',
  'Current assets',
  'Total Assets',
  'EQUITY AND LIABILITIES',
  'Equity',
  'Liabilities',
  'Current liabilities',
  'Total Equity and Liabilities',
  'Check'
]

export const ADD_SPACE_BEFORE_LINE_ITEM_CASH_FLOW = [
  'Cash flows from investing activities',
  'Cash flows from financing activities',
  'Net increase in cash and cash equivalents (I+II+III)',
  'Cash and cash equivalents at beginning of period',
  'Cash and cash equivalents at end of period (IV+V)'
]

export const ADD_SPACE_BEFORE_LINE_ITEM_ASSESSMENT_OF_WC = [
  'Operating Liabilities',
  'Non-Cash Working Capital (A-B)',
  'Change in NCA'
]