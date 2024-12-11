import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import SkCubeLoading from '../SkCubeLoading';
import DepositCollectionUITable from './DepositCollectionUITable';
import AccountingEntryPreview from '../accounting/AccountingEntryPreview';
import AddRecord from './AddRecord';
import LoadCenter from './LoadCenter';
import AddAccountingFund from './AddAccountingFund';
import {numberWithCommas} from '../utils/helpers';

export default class DepositCollectionUIComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      data: false
    };
  }

  componentDidMount() {
    this.fetchDepositCollectionData();
  }

  fetchDepositCollectionData() {
    var context = this;

    $.ajax({
      url: "/api/v1/deposit_collections/fetch",
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
        alert("Error in fetching deposit_collection");
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
      url: "/api/v1/deposit_collections/update_particular",
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

  saveOrNumber() {
    var context     = this;
    var data        = context.state.data;
    var newOrNumber = data.data.accounting_entry.data.or_number;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/deposit_collections/update_or_number",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        or_number: newOrNumber
      },
      success: function(response) {
        context.setState({
          isSaving: false
        });
      },
      error: function(response) {
        alert("Error in updating or number");
      }
    });
  }

  modifyOrNumber(event) {
    var context     = this;
    var newOrNumber = event.target.value;
    var data        = context.state.data;

    data.data.or_number                       = newOrNumber;
    data.data.accounting_entry.data.or_number = newOrNumber;

    context.setState({
      data: data
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

  saveArNumber() {
    var context     = this;
    var data        = context.state.data;
    var newArNumber = data.data.accounting_entry.data.ar_number;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/deposit_collections/update_ar_number",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        ar_number: newArNumber
      },
      success: function(response) {
        context.setState({
          isSaving: false
        });
      },
      error: function(response) {
        alert("Error in updating or number");
      }
    });
  }

  modifyArNumber(event) {
    var context     = this;
    var newArNumber = event.target.value;
    var data        = context.state.data;

    data.data.ar_number                       = newArNumber;
    data.data.accounting_entry.data.ar_number = newArNumber;

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

  renderOrNumber() {
    var orNumber  = this.state.data.data.or_number;

    if(this.state.data.status == "pending") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <input 
              value={orNumber} 
              onChange={this.modifyOrNumber.bind(this)} 
              disabled={this.state.isSaving}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isSaving}
              onClick={this.saveOrNumber.bind(this)}
            >
              <span className="bi bi-check"/>
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return this.state.data.data.or_number;
    }
  }

  renderArNumber() {
    var arNumber  = this.state.data.data.ar_number;
    if(this.state.data.status == "pending") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <input 
              value={arNumber} 
              onChange={this.modifyArNumber.bind(this)} 
              disabled={this.state.isSaving}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isSaving}
              onClick={this.saveArNumber.bind(this)}
            >
              <span className="bi bi-check"/>
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return this.state.data.data.ar_number;
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
                  OR Number:
                </th>
                <td className="text-end">
                  {this.renderOrNumber()}
                </td>
              </tr>
              <tr>
                <th>
                  AR Number:
                </th>
                <td className="text-end">
                  {this.renderArNumber()}
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
              <tr>
                <th>
                  Accounting Fund:
                </th>
                <td className="text-end">
                  <AddAccountingFund
                    data={this.state.data}
                    authenticityToken={this.props.authenticityToken}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <AddRecord
            data={this.state.data}
            authenticityToken={this.props.authenticityToken}
          />
          <LoadCenter
            authenticityToken={this.props.authenticityToken}
            centers={this.props.centers}
            data={this.state.data}
          />
          <hr/>
          <DepositCollectionUITable
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
            accountingFundId={accounting_entry_data.accounting_fund_id}
          />
        </div>
      );
    }
  }
}
