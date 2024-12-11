import React from 'react';
import {numberWithCommas} from '../utils/helpers';

export default class MemberRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      data: props.data
    }
  }

  renderMemberName() {
    var member  = this.state.data.member;

    return member.last_name + ", " + member.first_name;
  }

  renderRecords() {
    var member              = this.state.data.member;
    var memberAccount       = this.state.data.member_account;
    var records             = this.state.data.records;
    var accountTransactions = this.state.data.account_transactions;
    var dataRows            = [];

    for(var i = 0; i < records.length; i++) {
      dataRows.push(
        <tr key={"member-" + member.id + "-" + i + "-" + memberAccount.id}>
          <td className="">
            {records[i].date}
          </td>
          <td className="text-end">
            {numberWithCommas(records[i].beginning_balance)}
          </td>
          <td className="text-end">
            {numberWithCommas(records[i].deposits)}
          </td>
          <td className="text-end">
            {numberWithCommas(records[i].withdrawals)}
          </td>
          <td className="text-end">
            {numberWithCommas(records[i].ending_balance)}
          </td>
        </tr>
      );
    }

    // Interest
    dataRows.push(
      <tr key={"interest-row-" + memberAccount.id}>
        <td colSpan="2">
          <strong>
            Interest Earned
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(this.state.data.interest)}
          </strong>
        </td>
        <td>
          <strong>
            Annual Interest Rate:
          </strong>
        </td>
        <td className="text-muted">
          {this.state.data.annual_interest_rate * 100}%
        </td>
      </tr>
    );

    return dataRows;
  }

  render() {
    return  (
      <div>
        <div className="row">
          <div className="col">
            <h4>
              {this.renderMemberName()}
            </h4>
          </div>
          <div className="col">
            <div className="text-end">
              <a href={"/savings_accounts/" + this.state.data.member_account.id} target='_blank'>
                Go to Account
              </a>
            </div>
          </div>
        </div>

        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>
                Date
              </th>
              <th className="text-end">
                Beginning Balance
              </th>
              <th className="text-end">
                Deposit
              </th>
              <th className="text-end">
                Withdrawals
              </th>
              <th className="text-end">
                Ending Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {this.renderRecords()}
          </tbody>
        </table>
      </div>
    );
  }
}
