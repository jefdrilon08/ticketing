import React from 'react';
import $ from 'jquery';

import SkCubeLoading from '../SkCubeLoading';
import {numberWithCommas} from '../utils/helpers';
import MemberRecord from './MemberRecord';
import AccountingEntryPreview from '../accounting/AccountingEntryPreview';

export default class ShowUI extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false
    };
  }

  componentDidMount() {
    var id                = this.props.id;
    var authenticityToken = this.props.authenticityToken;
    var context           = this;

    $.ajax({
      url: "/api/v1/insurance_monthly_closing_collections/fetch",
      method: 'GET',
      data: {
        id: id
      },
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response
        });
      },
      error: function(response) {
        alert("Error in fetching data");
      }
    });
  }

  handleRemoveClicked() {
  }

  renderAccountingEntry() {
    var context = this;

    if(context.state.data.data.accounting_entry) {
      var accounting_entry_data = context.state.data.data.accounting_entry;
      console.log(accounting_entry_data);

      return  (
        <AccountingEntryPreview
          book={accounting_entry_data.book}
          particular={accounting_entry_data.particular}
          datePrepared={accounting_entry_data.date_prepared}
          referenceNumber={accounting_entry_data.reference_number}
          approved_by={accounting_entry_data.approved_by}
          branch={accounting_entry_data.branch_name}
          balanced={true}
          status={accounting_entry_data.status}
          journalEntries={accounting_entry_data.journal_entries}
          isLoading={this.state.isLoading}
          handleRemoveClicked={this.handleRemoveClicked.bind(this)}
          data={accounting_entry_data.data}
        />
      )
    } else {
      return  (
        <h3>
          No accounting entry data found
        </h3>
      );
    }
  }

  render() {
    var context = this;

    if(context.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
      console.log(context.state.data);

      var data          = context.state.data.data;
      var memberRecords = [];

      var totalInterest = 0.00;

      for(var i = 0; i < data.records.length; i++) {
        totalInterest += parseFloat(data.records[i].interest);

        memberRecords.push(
          <MemberRecord
            key={"member-record-" + i}
            data={data.records[i]}
          />
        );
      }

      // Other parameters
      var closingDate = context.state.data.closing_date;
      var closedAt    = context.state.data.closed_at;
      var status      = context.state.data.status;

      return  (
        <div>
          <table className="table table-bordered table-hover table-sm">
            <tbody>
              <tr>
                <th>
                  Closing Date
                </th>
                <td>
                  {closingDate}
                </td>
              </tr>
              <tr>
                <th>
                  Closed At
                </th>
                <td>
                  {closedAt}
                </td>
              </tr>
              <tr>
                <th>
                  Total Increase Earned
                </th>
                <td>
                  {numberWithCommas(totalInterest)}
                </td>
              </tr>
              <tr>
                <th>
                  Number of Members
                </th>
                <td>
                  {data.records.length}
                </td>
              </tr>
            </tbody>
          </table>

          {memberRecords}

          <table className="table table-bordered table-hover">
            <tbody>
              <tr>
                <th>
                  Total Interest:
                </th>
                <th className="text-end">
                  {numberWithCommas(totalInterest)}
                </th>
              </tr>
            </tbody>
          </table>

          {this.renderAccountingEntry()}
        </div>
      );
    }
  }
}
