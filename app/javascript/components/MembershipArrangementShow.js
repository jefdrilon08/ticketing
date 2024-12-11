import React, { useState } from 'react';
import Toggle from 'react-toggle';

import MembershipArrangementLoanProductConfig from "./MembershipArrangementLoanProductConfig";

import { buildLoanProductConfigObject } from "./utils/helpers";

function MembershipArrangementShow(props) {
  const [id]                      = useState(props.id);
  const [data, setData]           = useState(props.data);
  const [accounting_codes]        = useState(props.accounting_codes);
  const [loan_products]           = useState(props.loan_products);
  const [isLoading, setIsLoading] = useState(false);
  const [membership_types]        = useState(props.membership_types);

  function handleSave() {
    setIsLoading(true);

    const payload = {
      id: id,
      data: JSON.stringify(data),
      authenticity_token: props.authenticityToken
    }

    $.ajax({
      url: "/api/v1/administration/membership_arrangements/update_data",
      method: 'POST',
      data: payload,
      success: function(response) {
        console.log("Successfully updated data");
        alert("Successfully updated data!");

        setData(data);
        setIsLoading(false);
      },
      error: function(response) {
        console.log(response);
        alert("Error in updating data");
        setIsLoading(false);
      }
    })
  }

  function removeLoanProductConfig(index) {
    data.loan_products.splice(index, 1);

    setData({...data});
  }

  function removeMaintainingBalance(index, mbIndex) {
    data.loan_products[index].maintaining_balances.splice(mbIndex, 1);

    setData({...data});
  }

  function removeDeduction(index, dIndex) {
    data.loan_products[index].deductions.splice(dIndex, 1);

    setData({...data});
  }

  function updateDeductionAccountingCodeId(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].accounting_code_id = val;

    setData({...data});
  }

  function updateDeductionAmount(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].amount = val;

    setData({...data});
  }

  function updateDeductionType(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].deduction_type = val;

    setData({...data});
  }

  function updateDeductionSkipForSpecialLoanFund(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].skip_for_special_loan_fund = val;

    setData({...data});
  }

  function updateDeductionUseForSpecialLoanFund(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].use_for_special_loan_fund = val;

    setData({...data});
  }

  function updateDeductionAdvanceInsuranceValue(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].advance_insurance_value = val;

    setData({...data});
  }

  function updateMidasContractType(index, val) {
    data.loan_products[index].midas.contract_type = val;

    setData({...data});
  }

  function updateMidasContractPhase(index, val) {
    data.loan_products[index].midas.contract_phase = val;

    setData({...data});
  }

  function updateMidasTransactionType(index, val) {
    data.loan_products[index].midas.transaction_type = val;

    setData({...data});
  }

  function updateMidasLoanPurpose(index, val) {
    data.loan_products[index].midas.loan_purpose = val;

    setData({...data});
  }

  function updateDefaultAmount(index, amount) {
    data.loan_products[index].default_amount = amount;

    setData({...data});
  }

  function updateLoanProductId(index, obj) {
    console.log(obj);
    data.loan_products[index].loan_product_id = obj.value;
    setData({...data});
  }

  function updateReceivableAccountingCode(index, obj) {
    data.loan_products[index].receivable_accounting_code_id = obj.value;

    setData({...data});
  }

  function updateInterestReceivableAccountingCode(index, obj) {
    data.loan_products[index].interest_receivable_accounting_code_id = obj.value;

    setData({...data});
  }

  function updateMaintainingBalanceAccountType(index, mbIndex, val) {
    data.loan_products[index].maintaining_balances[mbIndex].account_type = val;

    setData({...data});
  }

  function updateMaintainingBalanceAccountSubtype(index, mbIndex, val) {
    data.loan_products[index].maintaining_balances[mbIndex].account_subtype = val;

    setData({...data});
  }

  function updateMaintainingBalancePercentage(index, mbIndex, val) {
    data.loan_products[index].maintaining_balances[mbIndex].percentage = val;

    setData({...data});
  }

  function updateMaintainingBalanceThreshold(index, mbIndex, val) {
    data.loan_products[index].maintaining_balances[mbIndex].threshold = val;

    setData({...data});
  }

  function updateDeductionName(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].name = val;

    setData({...data});
  }

  function updateDeductionBusinessPermitAvailable(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].business_permit_available = val;

    setData({...data});
  }

  function updateDeductionBusinessPermitAmount(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].business_permit_amount = val;

    setData({...data});
  }

  function updateDeductionMetaMemberType(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.member_type = val;

    setData({...data});
  }

  function updateDeductionMetaAccountType(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.account_type = val;

    setData({...data});
  }

  function updateDeductionMetaAccountSubtype(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.account_subtype = val;

    setData({...data});
  }

  function updateDeductionMetaValue(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.value = val;

    setData({...data});
  }

  function updateDeductionMetaAlgo(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.algo = val;

    setData({...data});
  }

  function updateDeductionMetaOffset(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.offset = val;

    setData({...data});
  }

  function updateDeductionMetaMembershipName(index, dIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.membership_name = val;

    setData({...data});
  }

  function updateDeductionMetaTermMapWeeklyRatio(index, dIndex, tmIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.term_map.weekly[tmIndex].ratio = val;

    setData({...data});
  }

  function updateDeductionMetaTermMapMonthlyRatio(index, dIndex, tmIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.term_map.monthly[tmIndex].ratio = val;

    setData({...data});
  }

  function updateDeductionMetaTermMapSemiMonthlyRatio(index, dIndex, tmIndex, val) {
    data.loan_products[index].deductions[dIndex].meta.term_map.semi_monthly[tmIndex].ratio = val;

    setData({...data});
  }

  function addMaintainingBalance(index) {
    data.loan_products[index].maintaining_balances.push({
      account_type: "SAVINGS",
      account_subtype: "K-IMPOK",
      percentage: 0.0,
      threshold: 0.00
    })

    setData({...data});
  }

  function addDeduction(index) {
    data.loan_products[index].deductions.push({
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
        meta_type: "",
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
        },
        account_type: "",
        account_subtype: "",
        value: 0.00,
        algo: "",
        offset: 0,
        membership_name: ""
      }
    })

    console.log(data);

    setData({...data});
  }

  function handleAddLoanProductConfigClicked() {
    const configObject = buildLoanProductConfigObject();

    if(!data.loan_products) {
      data.loan_products = [];
    }
    
    data.loan_products.push(configObject);

    setData({...data});
  }

  function handleUseCoMakerOneChanged(event) {
    data.use_co_maker_one = event.target.checked;

    setData({...data});
  }

  function handleUseCoMakerTwoChanged(event) {
    data.use_co_maker_two = event.target.checked;

    setData({...data});
  }

  function handleUseCoMakerThreeChanged(event) {
    data.use_co_maker_three = event.target.checked;

    setData({...data});
  }

  return (
    <div className="">
      <h4>
        Co-maker Settings for Loan Application
      </h4>
      <div className="row">
        <div className="col">
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th>
                  Co-maker 1 (Kasama sa sentro)
                </th>
                <th>
                  Co-maker 2 (Kamag-anak)
                </th>
                <th>
                  Co-maker 3 (Hindi kamag-anak / Kapit-bahay)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Toggle
                    defaultChecked={data.use_co_maker_one === 'true'}
                    onChange={handleUseCoMakerOneChanged}
                    className="btn"
                  />
                </td>
                <td>
                  <Toggle
                    defaultChecked={data.use_co_maker_two === 'true'}
                    onChange={handleUseCoMakerTwoChanged}
                    className="btn"
                  />
                </td>
                <td>
                  <Toggle
                    defaultChecked={data.use_co_maker_three === 'true'}
                    onChange={handleUseCoMakerThreeChanged}
                    className="btn"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h4>
        Loan Product Configuration
      </h4>
      <hr/>
      <button
        onClick={() => handleAddLoanProductConfigClicked()}
        className="btn btn-primary"
      >
        Add Loan Product Config
      </button>
      <hr/>
      <MembershipArrangementLoanProductConfig
        loan_products={data.loan_products}
        memberTypeOptions={membership_types}
        loanProductOptions={loan_products}
        accountingCodeOptions={accounting_codes}
        removeLoanProductConfig={removeLoanProductConfig}
        removeMaintainingBalance={removeMaintainingBalance}
        removeDeduction={removeDeduction}
        updateLoanProductId={updateLoanProductId}
        updateReceivableAccountingCode={updateReceivableAccountingCode}
        updateInterestReceivableAccountingCode={updateInterestReceivableAccountingCode}
        updateDefaultAmount={updateDefaultAmount}
        updateMaintainingBalanceAccountType={updateMaintainingBalanceAccountType}
        updateMaintainingBalanceAccountSubtype={updateMaintainingBalanceAccountSubtype}
        updateMaintainingBalancePercentage={updateMaintainingBalancePercentage}
        updateMaintainingBalanceThreshold={updateMaintainingBalanceThreshold}
        updateMidasContractType={updateMidasContractType}
        updateMidasContractPhase={updateMidasContractPhase}
        updateMidasTransactionType={updateMidasTransactionType}
        updateMidasLoanPurpose={updateMidasLoanPurpose}
        updateDeductionName={updateDeductionName}
        updateDeductionAccountingCodeId={updateDeductionAccountingCodeId}
        updateDeductionType={updateDeductionType}
        updateDeductionAmount={updateDeductionAmount}
        updateDeductionBusinessPermitAvailable={updateDeductionBusinessPermitAvailable}
        updateDeductionBusinessPermitAmount={updateDeductionBusinessPermitAmount}
        updateDeductionSkipForSpecialLoanFund={updateDeductionSkipForSpecialLoanFund}
        updateDeductionUseForSpecialLoanFund={updateDeductionUseForSpecialLoanFund}
        updateDeductionAdvanceInsuranceValue={updateDeductionAdvanceInsuranceValue}
        updateDeductionMetaMemberType={updateDeductionMetaMemberType}
        updateDeductionMetaAccountType={updateDeductionMetaAccountType}
        updateDeductionMetaAccountSubtype={updateDeductionMetaAccountSubtype}
        updateDeductionMetaValue={updateDeductionMetaValue}
        updateDeductionMetaAlgo={updateDeductionMetaAlgo}
        updateDeductionMetaOffset={updateDeductionMetaOffset}
        updateDeductionMetaMembershipName={updateDeductionMetaMembershipName}
        updateDeductionMetaTermMapWeeklyRatio={updateDeductionMetaTermMapWeeklyRatio}
        updateDeductionMetaTermMapMonthlyRatio={updateDeductionMetaTermMapMonthlyRatio}
        updateDeductionMetaTermMapSemiMonthlyRatio={updateDeductionMetaTermMapSemiMonthlyRatio}
        addMaintainingBalance={addMaintainingBalance}
        addDeduction={addDeduction}
        isLoading={isLoading}
      />
      <hr/>
      <button
        className="btn btn-success btn-block"
        onClick={() => handleSave()}
      >
        <span
          className="bi bi-check"
        >
        </span>
        Save
      </button>
    </div>
  )
}

export default MembershipArrangementShow;
