import React from 'react';
import {numberWithCommas} from '../../utils/helpers';

export default MasterListView = (props) => {
  let {
    data
  } = props;

  const renderDataRows = () => {
    var loans = data.records;
    var rows  = [];

    var totalLoanAmount       = 0.00;
    var totalPrincipalBalance = 0.00;
    var totalInterestBalance  = 0.00;
    var totalTotalBalance     = 0.00;

    for(var i = 0; i < loans.length; i++) {
      var member      = loans[i].member;
      var center      = loans[i].center;
      var loanProduct = loans[i].loan_product;

      rows.push(
        <tr key={"ml-" + loans[i].id}>
          <td className="text-center">
            {i + 1} 
          </td>
          <td>
            <a href={"/loans/" + loans[i].id} target="_blank">
              <strong>
                {member.last_name}, {member.first_name} {member.middle_name}
              </strong>
            </a>
          </td>
          <td className="text-muted">
            <small>
              {center.name}
            </small>
          </td>
          <td>
            {loanProduct.name}
          </td>
          <td>
            {loans[i].date_released} 
          </td>
          <td>
            {loans[i].maturity_date} 
          </td>
          <td className="text-end">
            {numberWithCommas(loans[i].principal)}
          </td>
          <td className="text-end">
            {numberWithCommas(loans[i].overall_principal_balance)}
          </td>
          <td className="text-end">
            {numberWithCommas(loans[i].overall_interest_balance)}
          </td>
          <td className="text-end">
            {numberWithCommas(loans[i].overall_balance)}
          </td>
        </tr>
      );

      totalLoanAmount       += parseFloat(loans[i].principal);
      totalPrincipalBalance += parseFloat(loans[i].overall_principal_balance);
      totalInterestBalance  += parseFloat(loans[i].overall_interest_balance);
      totalTotalBalance     += parseFloat(loans[i].overall_balance);
    }

    rows.push(
      <tr key={"ml-grand-total"}>
        <th></th>
        <th colSpan="5">
          Total ({loans.length})
        </th>
        <th className="text-end">
          {numberWithCommas(totalLoanAmount)}
        </th>
        <th className="text-end">
          {numberWithCommas(totalPrincipalBalance)}
        </th>
        <th className="text-end">
          {numberWithCommas(totalInterestBalance)}
        </th>
        <th className="text-end">
          {numberWithCommas(totalTotalBalance)}
        </th>
      </tr>
    );

    return rows;
  }

  return  (
    <div>
      <h5>
        Master List of Loans
      </h5>

      <table className="table table-bordered table-hover table-sm" style={{fontSize: "0.8em"}}>
        <thead>
          <tr>
            <th>
            </th>
            <th style={{width: "20%"}}>
              Name
            </th>
            <th>
              Center
            </th>
            <th>
              Loan Product
            </th>
            <th>
              Date Released
            </th>
            <th>
              Maturity Date
            </th>
            <th className="text-end">
              Loan Amount
            </th>
            <th className="text-end">
              Principal Balance
            </th>
            <th className="text-end">
              Interest Balance
            </th>
            <th className="text-end">
              Total Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {renderDataRows()}
        </tbody>
      </table>
    </div>
  );
}
