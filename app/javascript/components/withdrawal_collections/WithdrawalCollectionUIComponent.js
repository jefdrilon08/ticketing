import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import SkCubeLoading from '../SkCubeLoading';
import WithdrawalCollectionUITable from './WithdrawalCollectionUITable';
import AccountingEntryPreview from '../accounting/AccountingEntryPreview';
import AddRecord from './AddRecord';
import {numberWithCommas} from '../utils/helpers';

export default class WithdrawalCollectionUIComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      data: false
    };
  }

  componentDidMount() {
    this.fetchWithdrawalCollectionData();
  }

  fetchWithdrawalCollectionData() {
    var context = this;

    $.ajax({
      url: "/api/v1/withdrawal_collections/fetch",
      method: 'GET',
      data: {
        id: this.props.id
      },
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching withdrawal_collection");
      }
    });
  }

  updateData(data) {
    this.setState({
      data: data
    });
  }

  handleRemoveClicked(index) {
    alert("Not implemented for this module");
  }

  saveParticular() {
    var context       = this;
    var data          = context.state.data;
    var newParticular = data.data.accounting_entry.particular;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/withdrawal_collections/update_particular",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        particular: newParticular
      },
      success: function(response) {
        context.setState({
          isSaving: false
        });
      },
      error: function(response) {
        alert("Error in updating particular");
      }
    });
  }

  modifyParticular(event) {
    var context       = this;
    var newParticular = event.target.value;
    var data          = context.state.data;

    data.data.accounting_entry.particular = newParticular;

    context.setState({
      data: data
    });
  }

  renderParticular() {
    var particular  = this.state.data.data.accounting_entry.particular;

    if(this.state.data.status == "pending") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <input 
              value={particular} 
              onChange={this.modifyParticular.bind(this)} 
              disabled={this.state.isSaving}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isSaving}
              onClick={this.saveParticular.bind(this)}
            >
              <span className="bi bi-check"/>
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return particular;
    }
  }

  render() {
    if(this.state.isLoading) {
      return (
        <div>
          <SkCubeLoading/>
        </div>
      );
    } else {
      var accounting_entry_data = this.state.data.data.accounting_entry;
      console.log(accounting_entry_data);

      return (
        <div>
          <table className="table table-sm table-bordered">
            <tbody>
              <tr>
                <th>
                  Total Collected:
                </th>
                <td className="text-end">
                  <strong>
                    {numberWithCommas(this.state.data.data.total_collected)}
                  </strong>
                </td>
              </tr>
              <tr>
                <th>
                  Particular:
                </th>
                <td className="text-end">
                  {this.renderParticular()}
                </td>
              </tr>
            </tbody>
          </table>
          <AddRecord
            data={this.state.data}
            authenticityToken={this.props.authenticityToken}
          />
          <hr/>
          <WithdrawalCollectionUITable
            id={this.props.id}
            data={this.state.data}
            updateData={this.updateData.bind(this)}
            authenticityToken={this.props.authenticityToken}
          />
          <hr/>
          <h6>
            Accounting Entry
          </h6>
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
