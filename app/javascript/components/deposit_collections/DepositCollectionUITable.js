import React from 'react';
import ReactTable from 'react-table';
import Modal from 'react-modal';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import $ from "jquery";

import {numberWithCommas} from '../utils/helpers';
import {customStyles} from '../utils/consts';

import ErrorDisplay from '../ErrorDisplay';

export default class DepositCollectionUITable extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      currentTransaction: false,
      currentAmountValue: false,
      currentMember: false,
      modalIsOpen: false,
      modalRemoveIsOpen: false,
      isLoading: false,
      errors: false
    };
  }

  buildHeaders() {
    var headers = [];

    headers.push(
      <th key={"h-member"} style={{minWidth: "300px"}}>
        Member
      </th>
    );

    for(var i = 0; i < this.props.data.data.headers.length; i++) {
      headers.push(
        <th key={"h-" + i} style={{minWidth: "100px"}}>
          <center>
            <small>
              {this.props.data.data.headers[i]}
            </small>
          </center>
        </th>
      );
    }

    headers.push(
      <th  key={"h-total"} style={{minWidth: "40px"}}>
        <center>
          TOTAL
        </center>
      </th>
    );

    return headers;
  }

  handleRemoveRecord(id) {
    var context = this;

    this.setState({
      isLoading: true
    });

    $.ajax({
      url: "/api/v1/deposit_collections/remove_member",
      method: 'POST',
      data: {
        authenticity_token: context.props.authenticityToken,
        member_id: id,
        id: context.props.data.id
      },
      success: function(response) {
        context.setState({
          errors: false,
          message: "Success! Redirecting..."
        });

        window.location.reload();
      },
      error: function(response) {
        try {
          console.log(response);
          context.setState({
            errors: JSON.parse(response.responseText),
            isLoading: false,
            message: "Error"
          });
        } catch(err) {
          context.setState({
            errors: false,
            message: "Error!",
            isLoading: false
          });
        }
      }
    });
  }

  buildRecords() {
    var records = [];

    for(var i = 0; i < this.props.data.data.records.length; i++) {
      var components  = [];
      var record      = this.props.data.data.records[i];
      var member      = record.member;

      var btnDelete = "";
      if(this.props.data.status == "pending") {
        btnDelete = (
          <button
            className="btn btn-danger btn-sm"
            onClick={this.handleRemovedClicked.bind(this, member)}
            disabled={this.state.isLoading}
          >
            <span className="bi bi-x"/>
          </button>
        );
      }

      var center      = this.props.data.data.records[i].member.center;
      var centerName  = "";

      if(center) {
        centerName = center.name;
      }

      components.push(
        <td key={"c-member-" + member.id}>
          {btnDelete}
          <strong>
            <a href={"/members/" + member.id + "/display"} target="_blank">
              {this.props.data.data.records[i].member.full_name} ({centerName})
            </a>
          </strong>
        </td>
      );

      for(var j = 0; j < this.props.data.data.records[i].records.length; j++) {
        var paymentRecord = this.props.data.data.records[i].records[j];
        if(this.props.data.status == "pending") {
          components.push(
            <td key={"deposit-payment-" + j} className="text-end">
              <strong>
                <a 
                  href="#"
                  onClick={this.handleTransactionClicked.bind(this, paymentRecord, member)}
                >
                  {numberWithCommas(paymentRecord.amount)}
                </a>
              </strong>
            </td>
          );
        } else {
          components.push(
            <td key={"na-" + member.id + "-" + j} className="text-end">
              {numberWithCommas(paymentRecord.amount)}
            </td>
          )
        }
      }

      components.push(
        <td key={"c-member-total-" + member.id} className="text-end">
          <strong>
            {numberWithCommas(this.props.data.data.records[i].total_collected)}
          </strong>
        </td>
      );

      records.push(
        <tr key={"member-row-" + i}>
          {components}
        </tr>
      );
    }

    return records;
  }

  buildTotals() {
    var records = [];

    records.push(
      <td key="total-label">
        <strong>
          TOTAL
        </strong>
      </td>
    );

    var totals  = this.props.data.data.totals;
    for(var i = 0; i < totals.length; i++) {
      records.push(
        <td key={"total-deposit-payment-" + i} className="text-end">
          <strong>
            {numberWithCommas(totals[i].amount)}
          </strong>
        </td>
      );
    }

    records.push(
      <td key="grand-total" className="text-end">
        <div className="badge bg-success">
          <strong>
            {numberWithCommas(this.props.data.data.total_collected)}
          </strong>
        </div>
      </td>
    )

    return (
      <tr key={"totals-row"}>
        {records}
      </tr>
    );
  }

  handleTransactionClicked(paymentRecord, member) {
    this.setState({
      modalIsOpen: true,
      currentTransaction: paymentRecord,
      currentMember: member,
      currentAmountValue: paymentRecord.amount
    });
  }

  handleModalClose() {
    var currentTransaction    = this.state.currentTransaction;
    currentTransaction.amount = this.state.currentAmountValue;

    this.setState({
      modalIsOpen: false,
      currentTransaction: false,
      currentMember: false,
      currentAmountValue: false,
      errors: false
    });
  }

  handleRemovedClicked(member) {
    this.setState({
      modalRemoveIsOpen: true,
      currentMember: member
    });
  }

  handleRemoveModalClose() {
    this.setState({
      modalRemoveIsOpen: false,
      currentMember: false,
      errors: false
    });
  }


  handleInputAmountChanged(event) {
    var currentTransaction  = this.state.currentTransaction;

    if(currentTransaction) {
      currentTransaction.amount = event.target.value;

      this.setState({
        currentTransaction: currentTransaction
      });
    }
  }

  renderTransactionParticular() {
    var currentTransaction  = this.state.currentTransaction;
    var currentMember       = this.state.currentMember;

    return (
      <h5>
        SAVINGS
      </h5>
    );
  }

  handleModalConfirm() {
    var currentTransaction  = this.state.currentTransaction;
    var currentMember       = this.state.currentMember;
    var context             = this;

    var data  = {
      current_transaction: currentTransaction,
      current_member: currentMember,
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    this.setState({
      isLoading: true
    });

    $.ajax({
      url: "/api/v1/deposit_collections/modify_transaction_record",
      method: "POST",
      data: data,
      success: function(response) {
        //window.location.reload();
        context.setState({
          currentTransaction: false,
          currentAmountValue: false,
          currentMember: false,
          modalIsOpen: false,
          isLoading: false,
          errors: false
        });

        context.props.updateData(response);
      },
      error: function(response) {
        try {
          var errors  = JSON.parse(response.responseText).errors;

          context.setState({
            isLoading: false,
            errors: errors
          });
        } catch(err) {
          console.log(response);
          alert("Something went wrong!");
          context.setState({
            isLoading: false
          });
        }
      }
    });
  }

  renderLoadingStatus() {
    if(this.state.isLoading) {
      return  (
        <div className="callout callout-info">
          Loading...
        </div>
      );
    } else if(this.state.errors) {
      return (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    }
  }

  renderModalContent() {
    var currentTransaction  = this.state.currentTransaction;
    var currentMember       = this.state.currentMember;

    if(currentTransaction) {
      return (
        <div className="container">
          <div className="row">
            <div className="col">
              <h5>
                Member: &nbsp;
                <span className="text-muted">
                  {currentMember.full_name}
                </span>
              </h5>
              <h5>
                Transaction Type:  &nbsp;
                <span className="text-muted">
                  {currentTransaction.record_type}
                </span>
              </h5>
              {this.renderTransactionParticular()}

              <hr/>

              <input
                type="number"
                className="form-control"
                value={currentTransaction.amount}
                disabled={this.state.isLoading}
                onChange={this.handleInputAmountChanged.bind(this)}
              />
              {this.renderLoadingStatus()}
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col">
              <center>
                <div className="btn-group">
                  <button 
                    className="btn btn-success" 
                    onClick={this.handleModalConfirm.bind(this)}
                    disabled={this.state.isLoading}
                  >
                    <span className="bi bi-check" />
                    Confirm Change
                  </button>

                  <button 
                    className="btn btn-danger" 
                    onClick={this.handleModalClose.bind(this)}
                    disabled={this.state.isLoading}
                  >
                    <span className="bi bi-x" />
                    Cancel Change
                  </button>
                </div>
              </center>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          Internal Error
        </div>
      );
    }
  }

  renderRemoveModalContent() {
    var currentMember       = this.state.currentMember;

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h5>
              Member: &nbsp;
              <span className="text-muted">
                {currentMember.full_name}
              </span>
            </h5>
            <h5>
              <span className="text-muted" />
              Are you sure you want to remove?
            </h5>
            {this.renderLoadingStatus()}
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col">
            <center>
              <div className="btn-group">
                <button 
                  className="btn btn-success" 
                  onClick={this.handleRemoveRecord.bind(this, currentMember.id)}
                  disabled={this.state.isLoading}
                >
                  <span className="bi bi-check" />
                  Confirm
                </button>
                &emsp;
                <button 
                  className="btn btn-danger" 
                  onClick={this.handleRemoveModalClose.bind(this)}
                  disabled={this.state.isLoading}
                >
                  <span className="bi bi-x" />
                  Cancel
                </button>
              </div>
            </center>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="table-responsive">
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
        >
          {this.renderModalContent()}
        </Modal>
        <Modal
          isOpen={this.state.modalRemoveIsOpen}
          style={customStyles}
        >
          {this.renderRemoveModalContent()}
        </Modal>
        {this.renderLoadingStatus()}
        <table className="table table-bordered table-hover table-sm">
          <thead>
            <tr>
              {this.buildHeaders()}
            </tr>
          </thead>
          <tbody>
            {this.buildRecords()}
          </tbody>
          <tfoot>
            {this.buildTotals()}
          </tfoot>
        </table>
      </div>
    );
  }
}
