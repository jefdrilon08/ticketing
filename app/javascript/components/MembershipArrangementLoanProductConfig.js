import React, { useState } from 'react';
import Select from 'react-select';

function MembershipArrangementLoanProductConfig(props) { 
  let optionsMemberTypes = props.memberTypeOptions.map((o) => {
    return {
      value: o.id,
      label: o.name
    }
  });

  let optionsLoanProducts = props.loanProductOptions.map((o) => {
    return {
      value: o.id,
      label: o.name
    }
  });

  let optionsAccountingCodes = props.accountingCodeOptions.map((o) => {
    return {
      value: o.id,
      label: o.name
    }
  });

  let optionsDeductionTypes = [
    {
      value: "straight_one_time",
      label: "Straight One Time"
    },
    {
      value: "member_type_deduction_ratio",
      label: "Member Type Deduction Ratio"
    },
    {
      value: "deposit",
      label: "Deposit"
    },
    {
      value: "membership_fee",
      label: "Membership Fee"
    }
  ]

  if(props.loan_products) { 
    return (
      <div>
        {
          props.loan_products.map((obj, index) => {
            return (
              <div 
                key={'loan-product-' + index}
                className="card"
              >
                <div className="card-body">
                  <div className="form-group">
                    <label>
                      Loan Product
                    </label>
                    <Select
                      options={optionsLoanProducts}
                      value={optionsLoanProducts.filter((o) => { return o.value == obj.loan_product_id })}
                      onChange={(obj) => props.updateLoanProductId(index, obj)}
                      isDisabled={props.isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Receivable Accounting Code
                    </label>
                    <Select
                      options={optionsAccountingCodes}
                      value={optionsAccountingCodes.filter((o) => { return o.value == obj.receivable_accounting_code_id})}
                      onChange={(obj) => props.updateReceivableAccountingCode(index, obj)}
                      isDisabled={props.isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Interest Receivable Accounting Code
                    </label>
                    <Select
                      options={optionsAccountingCodes}
                      value={optionsAccountingCodes.filter((o) => { return o.value == obj.interest_receivable_accounting_code_id})}
                      onChange={(obj) => props.updateInterestReceivableAccountingCode(index, obj)}
                      isDisabled={props.isLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Default Amount
                    </label>
                    <input
                      value={obj.default_amount}
                      onChange={(event) => props.updateDefaultAmount(index, event.target.value)}
                      disabled={props.isLoading}
                      className="form-control"
                    />
                  </div>
                  
                  <h5>
                    Maintaining Balances
                  </h5>
                  {
                    obj.maintaining_balances.map((mbObj, mbIndex) => {
                      return (
                        <div className="card" key={"loan-product-" + index + "-mb-" + mbIndex}> 
                          <div className="card-body">
                            <div className="form-group">
                              <label>
                                Account Type
                              </label>
                              <select 
                                className="form-control"
                                value={mbObj.account_type}
                                onChange={(event) =>  props.updateMaintainingBalanceAccountType(index, mbIndex, event.target.value)}
                              >
                                <option value="SAVINGS">SAVINGS</option>
                                <option value="INSURANCE">INSURANCE</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>
                                Account Subtype
                              </label>
                              <input
                                className="form-control"
                                value={mbObj.account_subtype}
                                onChange={(event) => props.updateMaintainingBalanceAccountSubtype(index, mbIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Percentage
                              </label>
                              <input
                                className="form-control"
                                value={mbObj.percentage}
                                onChange={(event) => props.updateMaintainingBalancePercentage(index, mbIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Threshold
                              </label>
                              <input
                                className="form-control"
                                value={mbObj.threshold}
                                onChange={(event) => props.updateMaintainingBalanceThreshold(index, mbIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <button
                              className="btn btn-danger btn-block"
                              onClick={() => props.removeMaintainingBalance(index, mbIndex)}
                              disabled={props.isLoading}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })
                  }
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => props.addMaintainingBalance(index)}
                    disabled={props.isLoading}
                  >
                    Add Maintaining Balance Config
                  </button>

                  <hr/>

                  <h5>
                    Midas Configuration
                  </h5>

                  <div
                    className="card"
                  >
                    <div className="card-body">
                      <div className="form-group">
                        <label>
                          Contract Type
                        </label>
                        <input
                          className="form-control"
                          value={obj.midas.contract_type}
                          onChange={(event) => props.updateMidasContractType(index, event.target.value)}
                          disabled={props.isLoading}
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Contract Phase
                        </label>
                        <input
                          className="form-control"
                          value={obj.midas.contract_phase}
                          onChange={(event) => props.updateMidasContractPhase(index, event.target.value)}
                          disabled={props.isLoading}
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Transaction Type
                        </label>
                        <input
                          className="form-control"
                          value={obj.midas.transaction_type}
                          onChange={(event) => props.updateMidasTransactionType(index, event.target.value)}
                          disabled={props.isLoading}
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Loan Purpose
                        </label>
                        <input
                          className="form-control"
                          value={obj.midas.loan_purpose}
                          onChange={(event) => props.updateMidasLoanPurpose(index, event.target.value)}
                          disabled={props.isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <hr/>

                  <h5>
                    Deductions
                  </h5>

                  {
                    obj.deductions.map((dObj, dIndex) => {
                      return (
                        <div className="card" key={"loan-product-" + index + "-d-obj-" + dIndex}>
                          <div className="card-body">
                            <div className="form-group">
                              <label>
                                Name
                              </label>
                              <input
                                className="form-control"
                                value={dObj.name}
                                onChange={(event) => props.updateDeductionName(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Accounting Code
                              </label>
                              <Select
                                options={optionsAccountingCodes}
                                value={optionsAccountingCodes.filter((o) => { return o.value == dObj.accounting_code_id })}
                                onChange={(o) => props.updateDeductionAccountingCodeId(index, dIndex, o.value)}
                                isDisabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Deduction Type
                              </label>
                              <Select
                                options={optionsDeductionTypes}
                                value={optionsDeductionTypes.filter((o) => { return o.value == dObj.deduction_type })}
                                onChange={(o) => props.updateDeductionType(index, dIndex, o.value)}
                                isDisabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Amount
                              </label>
                              <input
                                className="form-control"
                                value={dObj.amount}
                                onChange={(event) => props.updateDeductionAmount(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Business Permit Available
                              </label>
                              <input
                                className="form-control"
                                value={dObj.business_permit_available}
                                onChange={(event) => props.updateDeductionBusinessPermitAvailable(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Business Permit Amount
                              </label>
                              <input
                                className="form-control"
                                value={dObj.business_permit_amount}
                                onChange={(event) => props.updateDeductionBusinessPermitAmount(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Skip For Special Loan Fund
                              </label>
                              <input
                                className="form-control"
                                value={dObj.skip_for_special_loan_fund}
                                onChange={(event) => props.updateDeductionSkipForSpecialLoanFund(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Use for Special Loan Fund
                              </label>
                              <input
                                className="form-control"
                                value={dObj.use_for_special_loan_fund}
                                onChange={(event) => props.updateDeductionUseForSpecialLoanFund(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Advance Insurance Value
                              </label>
                              <input
                                className="form-control"
                                value={dObj.advance_insurance_value}
                                onChange={(event) => props.updateDeductionAdvanceInsuranceValue(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <hr/>

                            <h6>
                              Meta Configuration
                            </h6>
                            <div className="form-group">
                              <label>
                                Member Type 
                              </label>
                              <Select
                                options={optionsMemberTypes}
                                value={optionsMemberTypes.filter((o) => { return o.value == dObj.meta.member_type })}
                                onChange={(o) => props.updateDeductionMetaMemberType(index, dIndex, o.value)}
                                isDisabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Account Type
                              </label>
                              <select
                                className="form-control"
                                value={dObj.meta.account_type}
                                onChange={(event) => props.updateDeductionMetaAccountType(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              >
                                <option value="SAVINGS">SAVINGS</option>
                                <option value="INSURANCE">INSURANCE</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>
                                Account Subtype
                              </label>
                              <input
                                className="form-control"
                                value={dObj.meta.account_subtype}
                                onChange={(event) => props.updateDeductionMetaAccountSubtype(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Value
                              </label>
                              <input
                                className="form-control"
                                value={dObj.meta.value}
                                onChange={(event) => props.updateDeductionMetaValue(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Algo
                              </label>
                              <input
                                className="form-control"
                                value={dObj.meta.algo}
                                onChange={(event) => props.updateDeductionMetaAlgo(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Offset
                              </label>
                              <input
                                className="form-control"
                                value={dObj.meta.offset}
                                onChange={(event) => props.updateDeductionMetaOffset(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Membership Name
                              </label>
                              <input
                                className="form-control"
                                value={dObj.meta.membership_name}
                                onChange={(event) => props.updateDeductionMetaMembershipName(index, dIndex, event.target.value)}
                                disabled={props.isLoading}
                              />
                            </div>

                            <h5>
                              Term Map
                            </h5>

                            <h6>
                              Weekly
                            </h6>

                            {
                              dObj.meta.term_map.weekly.map((tmWeeklyObj, tmIndex) => {
                                return (
                                  <div className="card" key={"tm-weekly-" + tmIndex}>
                                    <div className="card-body">
                                      <div className="row">
                                        <div className="col-md-6 col-xs-12">
                                          <div className="form-group">
                                            <label>
                                              Num Installments
                                            </label>
                                            <input
                                              className="form-control"
                                              value={tmWeeklyObj.num_installments}
                                              disabled={true}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6 col-xs-12">
                                          <div className="form-group">
                                            <label>
                                              Ratio
                                            </label>
                                            <input
                                              className="form-control"
                                              value={tmWeeklyObj.ratio}
                                              disabled={props.isLoading}
                                              onChange={(event) => props.updateDeductionMetaTermMapWeeklyRatio(index, dIndex, tmIndex, event.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            }

                            <h6>
                              Monthly
                            </h6>

                            {
                              dObj.meta.term_map.monthly.map((tmMonthlyObj, tmIndex) => {
                                return (
                                  <div className="card" key={"tm-weekly-" + tmIndex}>
                                    <div className="card-body">
                                      <div className="row">
                                        <div className="col-md-6 col-xs-12">
                                          <div className="form-group">
                                            <label>
                                              Num Installments
                                            </label>
                                            <input
                                              className="form-control"
                                              value={tmMonthlyObj.num_installments}
                                              disabled={true}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6 col-xs-12">
                                          <div className="form-group">
                                            <label>
                                              Ratio
                                            </label>
                                            <input
                                              className="form-control"
                                              value={tmMonthlyObj.ratio}
                                              disabled={props.isLoading}
                                              onChange={(event) => props.updateDeductionMetaTermMapMonthlyRatio(index, dIndex, tmIndex, event.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            }

                            <h6>
                              Semi-monthly
                            </h6>

                            {
                              dObj.meta.term_map.semi_monthly.map((tmSemiMonthlyObj, tmIndex) => {
                                return (
                                  <div className="card" key={"tm-weekly-" + tmIndex}>
                                    <div className="card-body">
                                      <div className="row">
                                        <div className="col-md-6 col-xs-12">
                                          <div className="form-group">
                                            <label>
                                              Num Installments
                                            </label>
                                            <input
                                              className="form-control"
                                              value={tmSemiMonthlyObj.num_installments}
                                              disabled={true}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-6 col-xs-12">
                                          <div className="form-group">
                                            <label>
                                              Ratio
                                            </label>
                                            <input
                                              className="form-control"
                                              value={tmSemiMonthlyObj.ratio}
                                              disabled={props.isLoading}
                                              onChange={(event) => props.updateDeductionMetaTermMapSemiMonthlyRatio(index, dIndex, tmIndex, event.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            }

                            <hr/>
                            <button
                              className="btn btn-danger btn-block"
                              onClick={() => props.removeDeduction(index, dIndex)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })
                  }

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => props.addDeduction(index)}
                  >
                    Add Deduction
                  </button>

                  <hr/>

                  <button
                    className="btn btn-danger"
                    onClick={() => props.removeLoanProductConfig(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  } else {
    return (
      <p>
        No loan product configurations
      </p>
    )
  }
}

export default MembershipArrangementLoanProductConfig;
