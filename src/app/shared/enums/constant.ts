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
    addInterestAdjTaxes:'Add: Interest adjusted Taxes',
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
  
  export const PAGINATION_VAL = [10, 20, 50, 100];

  export const MODELS = {
    FCFE:'FCFE',
    FCFF:'FCFF',
    NAV:'NAV',
    RELATIVE_VALUATION:'Relative_Valuation',
    EXCESS_EARNINGS:'Excess_Earnings',
    COMPARABLE_INDUSTRIES:'CTM',
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
    }
  }

  export const RELATIVE_VALUATION_COMPANY_MAPPING : { [key: string]: string } = {
      'Company Name': 'company',
      'PE Ratio': 'peRatio',
      'PB Ratio': 'pbRatio',
      'EbitDA': 'ebitda',
      'Sales': 'sales'
  }

  export const RELATIVE_VALUATION_INDUSTRY_MAPPING : { [key: string]: string } = {
    'Industry Name': 'industry',
    'PE Ratio': 'currentPE',
    'PB Ratio': 'pbv',
    'EbitDA': 'evEBITDA_PV',
    'Sales': 'priceSales' 
  }
  export const RELATIVE_VALUATION_INDUSTRY_COLUMNS = ['Industry Name', 'PE Ratio', 'PB Ratio', 'EbitDA', 'Sales'];
  
  export const RELATIVE_VALUATION_COMPANY_COLUMNS = ['Company Name', 'PE Ratio', 'PB Ratio', 'EbitDA', 'Sales'];