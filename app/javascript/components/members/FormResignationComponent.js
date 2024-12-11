import React from "react";
import $ from 'jquery';

import AccountingEntryPreview from '../accounting/AccountingEntryPreview';
import moment from 'moment';

import SkCubeLoading from '../SkCubeLoading';
import ErrorDisplay from '../ErrorDisplay';
import {numberWithCommas} from '../utils/helpers';
import {customStyles} from '../utils/consts';
import Modal from 'react-modal';

export default class FormResignationComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      data: false,
      isLoading: true,
      isProcessing: false,
      isModalOpen: false,
      errors: false,
      errorsProcessing: false
    };
  }

  componentDidMount() {
    var id      = this.props.id;
    var context = this;

    $.ajax({
      url: "/api/v1/members/fetch_resignation_details",
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
        console.log(response);
        try {
          context.setState({
            errors: JSON.parse(response.responseText),
            errorsProcessing: true,
            isLoading: false
          });
        } catch(err) {
          alert("Something went wrong");
          context.setState({
            errors: false,
            data: false,
            isLoading: true
          });
        }
      }
    });
  }

  handleDateResignedChanged(event) {
    var data            = this.state.data;
    data.date_resigned  = event.target.value;

    this.setState({
      data: data
    });
  }

  handleParticularChanged(event) {
    var data        = this.state.data;
    data.particular = event.target.value;

    data.accounting_entry.particular  = event.target.value;

    this.setState({
      data: data
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

  renderErrorProcessingDisplay() {
    if(this.state.errorsProcessing) {
      return  (
        <ErrorDisplay
          errors={this.state.errorsProcessing}
        />
      );
    }
  }

  renderEquityAccounts() {
    var equityAccounts  = this.state.data.equity_accounts;
    var display = [];

    for(var i = 0; i < equityAccounts.length; i++) {
      display.push(
        <tr key={"equity-account-" + equityAccounts[i].id}>
          <th>
            {equityAccounts[i].account_subtype}
          </th>
          <td>
            {numberWithCommas(equityAccounts[i].balance)}
          </td>
        </tr>
      );
    }

    return display;
  }

  handleResignationTypeChanged(event) {
    var data                          = this.state.data;
    data.member_resignation_type.name = event.target.value;

    var memberResignationTypes  = this.props.memberResignationTypes;

    var code  = data.member_resignation_type.particular.code;
    var name  = data.member_resignation_type.particular.name;

    for(var i = 0; i < memberResignationTypes.length; i++) {
      if(data.member_resignation_type.name == memberResignationTypes[i].name) {
        code  = memberResignationTypes[i].particulars[0].code;
        name  = memberResignationTypes[i].particulars[0].name;
      }
    }

    data.member_resignation_type.particular.code  = code;
    data.member_resignation_type.particular.name  = name;

    this.setState({
      data: data 
    });
  }

  handleResignationCodeChanged(event) {
    var data  = this.state.data;
    var code  = event.target.value;
    var name  = "";

    var memberResignationTypes  = this.props.memberResignationTypes;

    for(var i = 0; i < memberResignationTypes.length; i++) {
      if(data.member_resignation_type.name == memberResignationTypes[i].name) {
        for(var j = 0; j < memberResignationTypes[i].particulars.length; j++) {
          if(code == memberResignationTypes[i].particulars[j].code) {
            name  = memberResignationTypes[i].particulars[j].name;
          }
        }
      }
    }

    data.member_resignation_type.particular.code  = code;
    data.member_resignation_type.particular.name  = name;

    this.setState({
      data: data
    });
  }

  handleRemoveClicked() {
  }

  handleJournalEntryEdit() {
  }

  renderAccountingEntry() {
    var accountingEntry = this.state.data.accounting_entry;
    var datePrepared    = moment(accountingEntry.date_prepared).format("YYYY-MM-DD");

    return  (
      <AccountingEntryPreview
        book={accountingEntry.book}
        particular={accountingEntry.particular}
        datePrepared={datePrepared}
        branch={accountingEntry.branch_name}
        balanced={true}
        status={accountingEntry.status}
        journalEntries={accountingEntry.journal_entries}
        isLoading={this.state.isLoading}
        handleRemoveClicked={this.handleRemoveClicked.bind(this)}
        handleJournalEntryEdit={this.handleJournalEntryEdit.bind(this)}
        data={accountingEntry.data}
      />
    );
  }

  renderResignationTypes() {
    var memberResignationTypes  = this.props.memberResignationTypes;
    var display                 = [];

    for(var i = 0; i < memberResignationTypes.length; i++) {
      display.push(
        <option key={"resignation-type-" + i} value={memberResignationTypes[i].name}>
          {memberResignationTypes[i].name}
        </option>
      );
    }

    return display;
  }

  renderResignationCodes() {
    var resignationType         = this.state.data.member_resignation_type.name;
    var memberResignationTypes  = this.props.memberResignationTypes;
    var display                 = [];

    for(var i = 0; i < memberResignationTypes.length; i++) {
      if(resignationType == memberResignationTypes[i].name) {
        for(var j = 0; j < memberResignationTypes[i].particulars.length; j++) {
          display.push(
            <option key={"resignation-code-" + i + "-" + j} value={memberResignationTypes[i].particulars[j].code}>
              {memberResignationTypes[i].particulars[j].code} - {memberResignationTypes[i].particulars[j].name}
            </option>
          );
        }
      }
    }

    return display;
  }

  handleResignBtnClicked() {
    this.setState({
      isModalOpen: true
    });
  }

  handleCancelClicked() {
    this.setState({
      isModalOpen: false
    });
  }

  handleConfirmationClicked() {
    var authenticityToken = this.props.authenticityToken;
    var data              = this.state.data;
    var context           = this;

    this.setState({
      isProcessing: true
    });

    console.log(data);

    $.ajax({
      url: "/api/v1/members/process_resignation",
      method: 'POST',
      data: {
        data: JSON.stringify(data),
        authenticity_token: authenticityToken
      },
      success: function(response) {
        window.location.href = "/members/" + context.props.id + "/display";
      },
      error: function(response) {
        console.log(response);
        try {
          context.setState({
            errorsProcessing: JSON.parse(response.responseText),
            isProcessing: false,
            errors: true
          });
        } catch(err) {
          alert("Something went wrong");
          context.setState({
            errors: false,
            errorsProcessing: false,
            isModalOpen: false,
            data: false,
            isLoading: true
          });
        }
      }
    });
  }

  renderProcessing() {
    if(this.state.isProcessing) {
      return  (
        <div>
          <SkCubeLoading/>
          <center>
            <p>
              Resigning member. Please wait...
            </p>
          </center>
        </div>
      );
    } else {
      return  (
        <div></div>
      );
    }
  }

  renderConfirmationModal() {
    return (
      <Modal
        isOpen={this.state.isModalOpen}
        style={customStyles}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <p>
                Are you sure you want to resign this member?
              </p>
              <hr/>
              {this.renderProcessing()}
              {this.renderErrorProcessingDisplay()}
              <center>
                <div className="btn-group">
                  <button
                    className="btn btn-info"
                    onClick={this.handleConfirmationClicked.bind(this)}
                    disabled={this.state.isProcessing}
                  >
                    <span className="bi bi-check"/>
                    Confirm Resignation
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={this.handleCancelClicked.bind(this)}
                    disabled={this.state.isProcessing}
                  >
                    <span className="bi bi-x"/>
                    Cancel
                  </button>
                </div>
              </center>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    console.log(this.state);
    if(this.state.isLoading) {
      return  (
        <div>
          <SkCubeLoading/>
        </div>
      );
    } else if(!this.state.isLoading && !this.state.errorsProcessing) {
      console.log(this.state.data);
      var member  = this.state.data.member;
      var branch  = this.state.data.branch;
      var center  = this.state.data.center;
      
      var memberResignationType = this.state.data.member_resignation_type;

      return  (
        <div>
          <h5>
            Member Details
          </h5>
          <table className="table table-bordered table-sm table-hover">
            <tbody>
              <tr>
                <th width="25%">
                  Member:
                </th>
                <td>
                  {member.last_name}, {member.first_name} {member.middle_name}
                </td>
              </tr>
              <tr>
                <th>
                  Branch / Center:
                </th>
                <td>
                  {branch.name} / {center.name}
                </td>
              </tr>
              {this.renderEquityAccounts()}
              <tr>
                <th>
                  Date Resigned:
                </th>
                <td>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={this.state.data.date_resigned}
                    onChange={this.handleDateResignedChanged.bind(this)}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Particular:
                </th>
                <td>
                  <input
                    className="form-control"
                    value={this.state.data.particular}
                    onChange={this.handleParticularChanged.bind(this)}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Resignation Type:
                </th>
                <td>
                  <div className="row">
                    <div className="col">
                      <select 
                        onChange={this.handleResignationTypeChanged.bind(this)} 
                        className="form-control"
                        value={memberResignationType.name}
                      >
                        {this.renderResignationTypes()}
                      </select>
                    </div>
                    <div className="col">
                      <select 
                        onChange={this.handleResignationCodeChanged.bind(this)} 
                        className="form-control"
                        value={memberResignationType.particular.code}
                      >
                        {this.renderResignationCodes()}
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th>
                  Reason:
                </th>
                <td>
                  {memberResignationType.particular.name}
                </td>
              </tr>
            </tbody>
          </table>
          <hr/>
          <h5>
            Accounting Entry
          </h5>
          {this.renderAccountingEntry()}
          {this.renderConfirmationModal()}
          <hr/>
          <div className="callout callout-danger">
            <h6>
              Make sure to review all details before resigning member.
            </h6>
            <button
              className="btn btn-danger btn-lg"
              onClick={this.handleResignBtnClicked.bind(this)}
            >
              <span className="bi bi-x"/>
              Resign Member
            </button>
          </div>
        </div>
      );
    } else {
      return  (
        <div>
          {this.renderErrorDisplay()} 
        </div>
      );
    }
  }
}
