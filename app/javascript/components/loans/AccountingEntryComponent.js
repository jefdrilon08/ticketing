import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';

import SkCubeLoading from '../SkCubeLoading';
import ErrorDisplay from '../ErrorDisplay';

import AccountingEntryPreview from '../accounting/AccountingEntryPreview';

export default class AccountingEntryComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false,
      errors: false
    };
  }

  componentDidMount() {
    var context = this;

    var data  = {
      id: this.props.id,
      member_id: this.props.memberId
    }

    $.ajax({
      url: "/api/v1/loans/fetch",
      data: data,
      method: 'GET',
      success: function(response) {
        console.log(response);
        context.setState({
          isLoading: false,
          data: response.loan
        });
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong when fetching loan");
      }
    });
  }

  renderErrorDisplay() {
    if(this.state.errors) {
      return  (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    }
  }

  handleRemoveClicked() {
  }

  render() {
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
      console.log("this.state.data:");
      console.log(this.state.data);
      var accounting_entry_data = this.state.data.data.accounting_entry;
      return  (
        <div>
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
        </div>
      );
    }
  }
}
