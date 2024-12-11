import React, { useState, useEffect } from "react";
import ErrorList from '../ErrorList';
import { numberAsPercent, numberWithCommas } from "../utils/helpers";

export default function BranchPsrRecordsShow(props) {
  const [data]  = useState(props.data);
  const [token] = useState(props.token);
  const miniSpace = '\u00A0'.repeat(8);
  const tabSpace = '\u00A0'.repeat(14);
 
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4>
            {data.branch}
            <small className="text-muted ms-2">
              {data.closing_date}
            </small>
          </h4>
          <table className="table table-sm table-bordered">
            <tbody>
	      <tr>
		<th>A . OUTREACH</th>
	   	<td></td>
	      </tr>	    
	      <tr>
                <td><strong>a1. Total Number of Active Members</strong></td>
                <th className="text-center"> {data.data.active_total} </th>
              </tr>
              <tr>
		<td>{tabSpace}Female</td>
                <td className="text-center">
                  {data.data.active_female}
                </td>
              </tr>
              <tr>
                <td>{tabSpace}Male</td>
                <td className="text-center">
                  {data.data.active_male}
                </td>
              </tr>
              <tr>
                <th>{miniSpace}Pure Savers</th>
                <td className="text-center">
                  {data.data.pure_savers}
                </td>
	      </tr>

              <tr>
		<td>{tabSpace}Primary</td>
                <td className="text-center">
                </td>
              </tr>
              <tr>
                <td>{tabSpace}Kaagapay</td>
                <td className="text-center">
                </td>
              </tr>
              <tr>
                <td>{tabSpace}GK</td>
                <td className="text-center">
                </td>
              </tr>

              <tr>
                <th>{miniSpace}Active Borrowers</th>
                <td className="text-center">
                  {data.data.active_borrowers}
                </td>
	      </tr>

              <tr>
		<td>{tabSpace}Primary</td>
                <td className="text-center">
                </td>
              </tr>
              <tr>
                <td>{tabSpace}Kaagapay</td>
                <td className="text-center">
                </td>
              </tr>
              <tr>
                <td>{tabSpace}GK</td>
                <td className="text-center">
                </td>
              </tr>

              <tr>
                <th>{miniSpace}Admitted Members</th>
                <td className="text-center">
                  {data.data.admitted}
                </td>
	      </tr>
              <tr>
                <th>{miniSpace}Inactive Members</th>
                <td className="text-center">
                </td>
              </tr>
              <tr>
                <th>{miniSpace}Delinquent Member</th>
                <td className="text-center">
                </td>
              </tr>
	      {/*
	      <tr>
                <th>
                  Resigned
                </th>
                <td className="text-center">
                  {data.data.resigned}
                </td>
              </tr>
              <tr>
                <th>
                  Percentage of Savers
                </th>
                <td className="text-center">
                  {numberAsPercent(data.data.pure_savers / data.data.active_total)}
                </td>
              </tr>
              <tr>
                <th>
                  Percentage of Borrowers
                </th>
                <td className="text-center">
                  {numberAsPercent(data.data.active_borrowers / data.data.active_total)}
                </td>
		</tr>
	       */}
              <tr>
                <th>a2. Total Number of Active Loans </th>
                <th className="text-center">
                  {data.data.total_active_loans}
                </th>
              </tr>
              {data.data.loans.map((o) => {
                return (
                  <tr key={`loan-count-${o.loan_product.id}`}>
                    <td>{miniSpace}{o.loan_product.name.toUpperCase()}</td>
                    <td className="text-center">
                      {o.count}
                    </td>
                  </tr>
                )
	      })}
	      <tr>
	        <th>a3. DROP OUT for the month </th>
                <th className="text-center">
                </th>
	      </tr>
              <tr>
                <td>{miniSpace}Drop out Rate</td>
                <td className="text-center">
                </td>
	      </tr>
	      <tr>
	        <th>a4. Total NEW CLIENTS (as of)</th>
                <th className="text-center">
                </th>
	      </tr>
              <tr>
                <td>{miniSpace}NEW CLIENTS for the month</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>B. LOAN PORTFOLIO</th>
                <th className="text-end">
                  {numberWithCommas(data.data.total_overall_principal_balance)} 
                </th>
              </tr>
              <tr>
                <th>
                  b1. Outstanding Loans
                </th>
                <th className="text-end"></th>
              </tr>
              {data.data.loans.map((o) => {
                return (
                  <tr key={`loan-portfolio-${o.loan_product.id}`}>
                    <td>{miniSpace}{o.loan_product.name.toUpperCase()}</td>
                    <td className="text-end">
                      {numberWithCommas(o.overall_principal_balance)}
                    </td>
                  </tr>
                )
	      })}
              <tr>
                <th>
                  Average Loan amount (portfolio) for the month
                </th>
                <th className="text-end"></th>
              </tr>
              <tr>
                <th>b2. PAST DUE AMOUNT:</th>
                <th className="text-end"></th>
              </tr>
               <tr>
                <td>{miniSpace}Past due (1-30 days)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <td>{miniSpace}Past due (31-365 days)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <td>{miniSpace}Past due (365 days above)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>Total PAST DUE</th>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>Past Due Rate</th>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>b3. PAR AMOUNT:</th>
                <th className="text-end"></th>
              </tr>
               <tr>
                <td>{miniSpace}Portfolio at Risk (1-30 days)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <td>{miniSpace}Portfolio at Risk (31-365 days)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <td>{miniSpace}Portfolio at Risk (365 days above)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>Total PAR AMOUNT</th>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>PAR Rate (1day)</th>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>b4. Allow. For Impairment losses</th>
                <th className="text-end"></th>
              </tr>
               <tr>
                <td>{miniSpace}Current (1%)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <td>{miniSpace}1-365 days (35%)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <td>{miniSpace}over 1 yr (100%)</td>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>Total </th>
                <td className="text-center">
                </td>
	      </tr>

              <tr>
                <th>C. DISBURSEMENTS:</th>
                <td className="text-center">
                </td>
	      </tr>
              <tr>
                <th>C1. Total no. of LOAN DISBURSED  (As of)</th>
                <td className="text-center">
                </td>
	      </tr>
	      <tr>
                <th>C2. No. of LOAN DISBURSED for the month</th>
                <th className="text-center">
                  {data.data.total_num_disbursed}
                </th>
              </tr>
              {data.data.loans.map((o) => {
                return (
                  <tr key={`loan-num-disbursed-${o.loan_product.id}`}>
                    <td>{miniSpace}{o.loan_product.name.toUpperCase()}</td>
                    <td className="text-center">
                      {o.num_disbursed}
                    </td>
                  </tr>
                )
	      })}
	      <tr>
                <th>C3. AMOUNT DISBURSED as of</th>
                <td className="text-center">
                </td>
	      </tr>


              <tr>
                <th> C4. DISBURSEMENT for the month</th>
                <th className="text-end">
                  {numberWithCommas(data.data.total_amount_disbursed)} 
                </th>
              </tr>
              {data.data.loans.map((o) => {
                return (
                  <tr key={`loan-amount-disbursed-${o.loan_product.id}`}>
                    <td>{miniSpace}{o.loan_product.name}</td>
                    <td className="text-end">
                      {numberWithCommas(o.amount_disbursed)}
                    </td>
                  </tr>
                )
              })}
              <tr>
                <th>
                  Gross Income
                </th>
                <th className="text-end">
                  {numberWithCommas(data.data.gross_income)}
                </th>
              </tr>
              <tr>
                <th>
                  Operating Expense
                </th>
                <th className="text-end">
                  {numberWithCommas(data.data.operating_expense)}
                </th>
              </tr>
              <tr>
                <th>
                  Net Income Before Admin Expense
                </th>
                <th className="text-end">
                  {numberWithCommas(data.data.net_income_before_admin_expense)}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
