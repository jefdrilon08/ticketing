export function buildLoanProductConfigObject() {
  var configObject = {
    loan_product_id: "",
    receivable_accounting_code_id: "",
    interest_receivable_accounting_code_id: "",
    default_amount: 5000.00,
    maintaining_balances: [
      {
        account_type: "SAVINGS",
        account_subtype: "K-IMPOK",
        percentage: 0.0,
        threshold: 0.00
      }
    ],
    midas: {
      contract_type: 22,
      contract_phase: "AC",
      transaction_type: "NA",
      loan_purpose: "ET"
    },
    deductions: [
      {
        name: "",
        accounting_code_id: "",
        amount: 0.00,
        deduction_type: "",
        business_permit_available: false,
        business_permit_amount: 0.00,
        skip_for_special_loan_fund: false,
        use_for_special_loan_fund: false,
        advance_insurance_value: false,
        meta: {
          member_type: "Regular",
          account_type: "",
          account_subtype: "",
          value: 0.00,
          algo: "",
          offset: 0,
          membership_name: "",
          term_map: {
            weekly: [
              {
                num_installments: 15,
                ratio: 0.0035
              },
              {
                num_installments: 25,
                ratio: 0.007
              },
              {
                num_installments: 35,
                ratio: 0.0105
              },
              {
                num_installments: 50,
                ratio: 0.0140
              }
            ],
            monthly: [
              {
                num_installments: 3,
                ratio: 0.0035
              },
              {
                num_installments: 6,
                ratio: 0.007
              },
              {
                num_installments: 9,
                ratio: 0.0105
              },
              {
                num_installments: 12,
                ratio: 0.0140
              }
            ],
            semi_monthly: [
              {
                num_installments: 6,
                ratio: 0.0035
              },
              {
                num_installments: 12,
                ratio: 0.007
              },
              {
                num_installments: 18,
                ratio: 0.0105
              },
              {
                num_installments: 24,
                ratio: 0.0140
              }
            ]
          }
        }
      }
    ]
  }

  return configObject;
}

export function buildBillingTableData(o) {
  var data  = [];

  for(var i = 0; i < o.data.records.length; i++) {
    // Loan products
    data.push({
    });

    // Deposits

    // Insurance

    // Withdraw payments
  }

  return data;
}

export function numberAsPercent(x) {
  //x = ((Math.round(x * 100) / 100) * 100).toFixed(2);

  return parseFloat(x * 100).toFixed(2) + "%";
}

export function numberWithCommas(x) {
  x = (Math.round(x * 100) / 100).toFixed(2);

  if(x < 0) {
    x = x * -1; 
    x = "(" + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")";
  } else {
    x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }   

  return x;
}

export function getReligionOptions() {
  var religions = [
    "Roman Catholic", 
    "Other Christian", 
    "Members Church of God International", 
    "Iglesia ni Cristo", 
    "Protestant", 
    "Jehovah's Witnesses", 
    "Seventh-day Adventist Church", 
    "Muslim", 
    "Aglipayan", 
    "Seventh Day Baptist Church", 
    "Church of God", 
    "Jesus Miracle Crusade International Ministry", 
    "Pentecostal Missionary Church of Christ", 
    "Assemblies of God", 
    "The Church of Jesus Christ of Latter-day Saints", 
    "Sta. Iglesia Rosa Mistica Inc.", 
    "United Pentecostal Church International", 
    "Evangelical", 
    "Most Holy Church of God in Jesus Christ"
  ]

  var data = [];

  for(var i = 0; i < religions.length; i++) {
    data.push({
      value: religions[i],
      label: religions[i]
    });
  }

  return data;
}
