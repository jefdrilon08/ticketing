import React from 'react';
import $ from 'jquery';

import SkCubeLoading from '../SkCubeLoading';
import BillingUITable from './BillingUITable';
import BillingUITableTablet from './BillingUITableTablet';
import AccountingEntryPreview from '../accounting/AccountingEntryPreview';
import {numberWithCommas} from '../utils/helpers';

export default class BillingUIComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      data: false,
      changes: []
    };
  }

  componentDidMount() {
    this.fetchBillingData();
  }

  handleChangeTransaction(m, t, pAmount) {
    console.log("handleChageTransaction");
    console.log(t);
    console.log(this.state.data);

    var changes = this.state.changes;

    var currentData = this.state.data;

    changes.push({
      previousAmount: pAmount,
      member: m,
      transaction: t
    });

    for(var totalsIndex = 0; totalsIndex < currentData.data.totals.length; totalsIndex++) {
      currentData.data.totals[totalsIndex].amount = 0.00;
    }

    for(var totalsIndex = 0; totalsIndex < currentData.data.totals.length; totalsIndex++) {
      var totalObject = currentData.data.totals[totalsIndex];

      for(var i = 0; i < currentData.data.records.length; i++) {
        for(var j = 0; j < currentData.data.records[i].records.length; j++) {
          var rr = currentData.data.records[i].records[j];

          if(["SAVINGS", "INSURANCE", "EQUITY"].includes(rr.record_type) && totalObject.key == rr.account_subtype) {
            currentData.data.totals[totalsIndex].amount += parseFloat(rr.amount);
          } else if(rr.record_type == "LOAN_PAYMENT" && totalObject.key == rr.loan_product.name) {
            currentData.data.totals[totalsIndex].amount += parseFloat(rr.amount);
          } else if(rr.record_type == "WP" && totalObject.key == "WP") {
            currentData.data.totals[totalsIndex].amount += parseFloat(rr.amount);
          }
        }
      }
    }

    this.updateData(currentData);

    this.setState({ changes: changes });
  }

  fetchBillingData() {
    var context = this;

    $.ajax({
      url: "/api/v1/billings/fetch",
      method: 'GET',
      data: {
        id: this.props.id,
        authenticity_token: context.props.authenticityToken
      },
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching billing test");
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

  handleSaveChangesClicked() {
    var context = this.state;

    this.setState({
      isLoading: true
    });

    $.ajax({
      url: "/api/v1/billings/update",
      method: "POST",
      data: {
        data: context.data,
        changes: context.changes,
        authenticity_token: context.authenticityToken,
        billing_id: context.data.id
      },
      success: function(response) {
        console.log(response);
        alert("Successfully updated billing! Reloading...");

        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        alert("Error in updating billing");
      }
    });
  }

  saveParticular() {
    var context       = this;
    var data          = context.state.data;
    var newParticular = data.data.accounting_entry.particular;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/billings/update_particular",
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

  handleBookChanged(event) {
    var context = this;
    var data    = context.state.data;
    var book    = event.target.value;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/billings/update_book",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        book: book
      },
      success: function(response) {
        data.data.accounting_entry.book = book;

        context.setState({
          isSaving: false
        });

        context.updateData(data);
      },
      error: function(response) {
        alert("Error in updating particular");
      }
    });
  }
  saveSiNumber() {
    var context     = this;
    var data        = context.state.data;
    var newSiNumber = data.data.accounting_entry.data.si_number;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/billings/update_si_number",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        si_number: newSiNumber
      },
      success: function(response) {
        context.setState({
          isSaving: false
        });
      },
      error: function(response) {
        alert("Error in updating Si number");
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
      url: "/api/v1/billings/update_or_number",
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
  modifySiNumber(event) {
    var context     = this;
    var newSiNumber = event.target.value;
    var data        = context.state.data;

    data.data.si_number                       = newSiNumber;
    data.data.accounting_entry.data.si_number = newSiNumber;

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
      url: "/api/v1/billings/update_ar_number",
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

    if(this.state.data.status == "pending" || "save") {
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
   
    if(this.state.data.status == "save") {
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
    
     /*return this.state.data.data.or_number;*/
  }
  renderSiNumber() {
    var siNumber  = this.state.data.data.si_number;
   
    if(this.state.data.status == "save") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <input 
              value={siNumber} 
              onChange={this.modifySiNumber.bind(this)} 
              disabled={this.state.isSaving}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isSaving}
              onClick={this.saveSiNumber.bind(this)}
            >
              <span className="bi bi-check"/>
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return this.state.data.data.si_number;
    }
    
     /*return this.state.data.data.si_number;*/
  }
  renderBook() {
    var book  = this.state.data.data.accounting_entry.book;

    if(this.state.data.status == "save") {
      return (
        <div className="row">
          <div className="col">
            <select
              value={book}
              disabled={this.state.isLoading}
              onChange={this.handleBookChanged.bind(this)}
              className="form-control"
            >
              <option value="CRB">CRB</option>
              <option value="JVB">JVB</option>
            </select>
          </div>
        </div>
      );
    } else {
      return book;
    }
  }

  renderArNumber() {
    var arNumber  = this.state.data.data.ar_number;
    if(this.state.data.status == "save") {
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
   
   /* return this.state.data.data.ar_number; */
  }

  renderChanges() {
    if(this.state.changes.length > 0) {
      return (
        <div className="alert alert-danger">
          <small className="text-muted">
            Some changes occurred. Please save changes.
          </small>
          <ul>
            {
              this.state.changes.map(function(o, i) {
                return (
                  <li key={"change-" + i}>
                    Updated {o.transaction.record_type} of {o.member.last_name}, {o.member.first_name} from {o.previousAmount} to {o.transaction.amount}
                  </li>
                );
              })
            }
          </ul>
          <hr/>
          <button className="btn btn-info" onClick={this.handleSaveChangesClicked.bind(this)}>
            <span className="bi bi-check"></span>
            Save Changes
          </button>
        </div>
      );
    } else {
      return  (
        <div>
        </div>
      );
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
          {this.renderChanges()}
          <table className="table table-sm table-bordered">
            <tbody>
              <tr>
                <th>
                  Expected Collections:
                </th>
                <td className="text-end">
                  <div className="text-muted">
                    {numberWithCommas(this.state.data.data.total_expected_collections)}
                  </div>
                </td>
              </tr>
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
                  Book:
                </th>
                <td className="text-end">
                  {this.renderBook()}
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
                  SI number:
                </th>
                <td className="text-end">
                  {this.renderSiNumber()}
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
            </tbody>
          </table>
          <hr/>
          <BillingUITable
            id={this.props.id}
            data={this.state.data}
            updateData={this.updateData.bind(this)}
            handleChangeTransaction={this.handleChangeTransaction.bind(this)}
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
          <hr/>
          <h6>
            AR Number
          </h6>
          <table className="table table-responsive table-sm">
            <thead>
              <tr>
                <th>
                  Member
                </th>
                <th>
                  AR Number
                </th>
                <th>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.data.records.map((o) => {
                if(o.member.ar_number) {
                  return (
                    <tr key={"ar-row-" + o.member.id}>
                      <td>
                        {o.member.full_name}
                      </td>
                      <td>
                        {o.member.ar_number}
                      </td>
                      <td>
                      </td>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }
}
