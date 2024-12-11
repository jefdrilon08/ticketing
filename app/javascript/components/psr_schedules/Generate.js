import React, { useState, useEffect } from "react";
import ErrorList from '../ErrorList';
import Select from 'react-select';
import { months, getYears } from '../utils/consts';
import { generate } from '../services/PsrScheduleService';
import { numberAsPercent, numberWithCommas } from "../utils/helpers";

const Generate = (props) => {
  const [currentBranches, setCurrentBranches] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState([]);

  const handleClick = () => {
    setIsLoading(true);
    setErrors([]);
    setData([]);

    const payload = {
      branch_ids: currentBranches.map((o) => { return o.value }),
      year: currentYear,
      month: currentMonth,
    }

    generate(payload, props.token).then((res) => {
      console.log(res.data);
      setData(res.data);
    }).catch((res) => {
      setErrors(res.response.data.errors);
    }).finally(() => {
      setIsLoading(false);
    })
  }
  
  return (
    <React.Fragment>
      <h1>
        Generate PSR Schedule
      </h1>
      <hr/>
      <label>
        Branch
      </label>
      <Select
        value={currentBranches}
        options={props.branch_options}
        isMulti
        isDisabled={isLoading}
        onChange={(selections) => {
          const _currentBranches = [];

          selections.forEach((o) => {
            _currentBranches.push(o);
          })

          setCurrentBranches(_currentBranches);
        }}
      />
      <div className="row mt-2">
        <div className="col">
          <div className="form-group">
            <label>
              Month
            </label>
            <select
              className="form-control"
              value={currentMonth}
              disabled={isLoading}
              onChange={(event) => {
                setCurrentMonth(event.target.value);
              }}
            >
              {months.map((month) => {
                return (
                  <option value={month.value} key={`month-${month.value}`}>
                    {month.label}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>
              Year
            </label>
            <select
              className="form-control"
              value={currentYear}
              disabled={isLoading}
              onChange={(event) => {
                setCurrentYear(event.target.value);
              }}
            >
              {getYears().map((year) => {
                return (
                  <option value={year} key={`year-${year}`}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>
      <button
        className="btn btn-info w-100 mt-2"
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          handleClick();
        }}
      >
        Generate
      </button>
      <hr/>
      <ErrorList errors={errors}/>
      {(() => {
        if(data.length > 0) {
          return (
            <React.Fragment>
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <th>
                      Branch
                    </th>
                    {data.map((obj) => {
                      return (
                        <th className="text-center" key={`branch-header-${obj.branch_id}`}>
                          {obj.branch}
                        </th>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Total Number of Active Members
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`active-total-${obj.branch_id}`}>
                          {obj.data.active_total}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Female
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`active-female-${obj.branch_id}`}>
                          {obj.data.active_female}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Male
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`active-male-${obj.branch_id}`}>
                          {obj.data.active_male}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Pure Savers
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`pure-savers-${obj.branch_id}`}>
                          {obj.data.pure_savers}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Active Borrowers
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`active-borrowers-${obj.branch_id}`}>
                          {obj.data.active_borrowers}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Admitted Members
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`admitted-members-${obj.branch_id}`}>
                          {obj.data.admitted}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Resigned
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`resigned-${obj.branch_id}`}>
                          {obj.data.resigned}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Percentage of Savers
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`percentage-of-savers-${obj.branch_id}`}>
                          {numberAsPercent(obj.data.pure_savers / obj.data.active_total)}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Percentage of Borrowers
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`percentage-of-borrowers-${obj.branch_id}`}>
                          {numberAsPercent(obj.data.active_borrowers / obj.data.active_total)}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Total Number of Active Loans
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-center" key={`percentage-of-borrowers-${obj.branch_id}`}>
                          {obj.data.total_active_loans}
                        </td>
                      )
                    })}
                  </tr>
                  {data[0].data.loans.map((o, i) => {
                    return (
                      <tr key={`loan-count-row-${i}`}>
                        <th className="ps-4">
                          {o.loan_product.name}
                        </th>
                        {data.map((obj) => {
                          return (
                            <td className="text-center" key={`loan-count-col-${obj.branch_id}`}>
                              {obj.data.loans[i].count}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr>
                    <th>
                      Outstanding Loans
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-end" key={`outstanding-loans-${obj.branch_id}`}>
                          {numberWithCommas(obj.data.total_overall_principal_balance)}
                        </td>
                      )
                    })}
                  </tr>
                  {data[0].data.loans.map((o, i) => {
                    return (
                      <tr key={`loan-portfolio-row-${i}`}>
                        <th className="ps-4">
                          {o.loan_product.name}
                        </th>
                        {data.map((obj) => {
                          return (
                            <td className="text-end" key={`loan-portfolio-col-${obj.branch_id}`}>
                              {numberWithCommas(obj.data.loans[i].overall_principal_balance)}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr>
                    <th>
                      Loans Disbursed for the Month
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-end" key={`loans-disbursed-for-the-month-${obj.branch_id}`}>
                          {numberWithCommas(obj.data.total_num_disbursed)}
                        </td>
                      )
                    })}
                  </tr>
                  {data[0].data.loans.map((o, i) => {
                    return (
                      <tr key={`loans-disbursed-for-the-month-row-${i}`}>
                        <th className="ps-4">
                          {o.loan_product.name}
                        </th>
                        {data.map((obj) => {
                          return (
                            <td className="text-center" key={`loans-disbursed-for-the-month-col-${obj.branch_id}`}>
                              {obj.data.loans[i].num_disbursed}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr>
                    <th>
                      Amount Disbursed As Of
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-end" key={`loans-total-amount-disbursed-${obj.branch_id}`}>
                          {numberWithCommas(obj.data.total_amount_disbursed)}
                        </td>
                      )
                    })}
                  </tr>
                  {data[0].data.loans.map((o, i) => {
                    return (
                      <tr key={`loans-amount-disbursed-row-${i}`}>
                        <th className="ps-4">
                          {o.loan_product.name}
                        </th>
                        {data.map((obj) => {
                          return (
                            <td className="text-end" key={`loans-amount-disbursed-col-${obj.branch_id}`}>
                              {numberWithCommas(obj.data.loans[i].amount_disbursed)}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr>
                    <th>
                      Gross Income
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-end" key={`loans-gross-income-${obj.branch_id}`}>
                          {numberWithCommas(obj.data.gross_income)}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Operating Expense
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-end" key={`loans-operating-expense-${obj.branch_id}`}>
                          {numberWithCommas(obj.data.operating_expense)}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <th>
                      Net Income Before Admin Expense
                    </th>
                    {data.map((obj) => {
                      return (
                        <td className="text-end" key={`loans-net-income-before-admin-expense-${obj.branch_id}`}>
                          {numberWithCommas(obj.data.net_income_before_admin_expense)}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          )
        }
      })()}
      <hr/>
    </React.Fragment>
  )
}

export default Generate;
