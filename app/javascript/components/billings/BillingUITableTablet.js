import React from 'react';
import $ from 'jquery';
import ReactTable from 'react-table';
import Toggle from 'react-toggle';

import {numberWithCommas} from '../utils/helpers';
import {customStyles} from '../utils/consts';

import ErrorDisplay from '../ErrorDisplay';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class BillingUITableTablet extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      currentTransaction: false,
      currentAmountValue: false,
      currentMember: false,
      modalIsOpen: false,
      modalArIsOpen: false,
      isLoading: false,
      errors: false,
      grandTotal: 0.00
    };
  }

  buildHeaders() {
    var headers = [];

    headers.push(
      <th key={"h-member-attendance"} style={{minWidth: "100px"}}>
        <center>
          <small>
            Attend.
          </small>
          <br/>
          <div className="btn-group">
            <div 
              className="btn btn-success btn-sm"
              onClick={this.handleToggleAllOn.bind(this)}
            >
              <span className="bi bi-check"/>
            </div>
            <div 
              className="btn btn-danger btn-sm"
              onClick={this.handleToggleAllOff.bind(this)}
            >
              <span className="bi bi-x"/>
            </div>
          </div>
        </center>
      </th>
    );

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
          CP
        </center>
      </th>
    );

    headers.push(
      <th  key={"h-grand-total"} style={{minWidth: "40px"}}>
        <center>
          TOTAL
        </center>
      </th>
    );

    return headers;
  }

  handleToggleAllOn() {
    var context = this;

    var data  = {
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    $.ajax({
      url: "/api/v1/billings/toggle_attendance_on",
      method: 'POST',
      data: data,
      success: function(response) {
        context.props.updateData(response);
        window.location.reload();
      },
      error: function(response) {
        alert("Error in toggling attendance (all on)");
      }
    });
  }

  handleToggleAllOff() {
    var context = this;

    var data  = {
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    $.ajax({
      url: "/api/v1/billings/toggle_attendance_off",
      method: 'POST',
      data: data,
      success: function(response) {
        context.props.updateData(response);
        window.location.reload();
      },
      error: function(response) {
        alert("Error in toggling attendance (all off)");
      }
    });
  }

  handleToggled(memberId) {
    var context = this;

    var data  = {
      member_id: memberId,
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    $.ajax({
      url: "/api/v1/billings/toggle_attendance",
      method: 'POST',
      data: data,
      success: function(response) {
        context.props.updateData(response);
      },
      error: function(response) {
        alert("Error in toggling attendance");
      }
    });
  }

  fetchGrandTotal() {
    var t = 0.00
    for(var i = 0; i < this.props.data.data.records.length; i++) {
      for(var j = 0; j < this.props.data.data.records[i].records.length; j++) {
        var paymentRecord = this.props.data.data.records[i].records[j];
        t += parseFloat(paymentRecord.amount);
      }
    }

    return t;
  }

  renderARNumber(member) {
    if(member.ar_number) {
      return (
        <>
          <br/>
          <small className="badge bg-secondary">
            AR: {member.ar_number}
          </small>
          <small className="badge bg-warning">
            OR: {member.or_number}
          </small>
        </>
      )
    } else {
      return (
        <></>
      )
    }
  }


  buildRecords() {
    var records = [];

    for(var i = 0; i < this.props.data.data.records.length; i++) {
      var components  = [];
      var record      = this.props.data.data.records[i];
      var member      = record.member;
      var grandTotal  = 0.00;
      
      if(this.props.data.status == "pending") {
        components.push(
          <td key={"c-member-attnd-" + member.id}>
            <center>
              <Toggle
                defaultChecked={record.attendance}
                onChange={this.handleToggled.bind(this, member.id)}
              />
            </center>
          </td>
        );
      } else if(record.attendance) {
        components.push(
          <td key={"c-member-attnd-" + member.id}>
            <center>
              <div className="badge bg-success">
                <span className="bi bi-check"/>
              </div>
            </center>
          </td>
        );
      } else {
        components.push(
          <td key={"c-member-attnd-" + member.id}>
            <center>
              <div className="badge bg-danger">
                <span className="fa fa-minus"/>
              </div>
            </center>
          </td>
        );
      }

      components.push(
        <td key={"c-member-" + member.id}>
          <strong>
            <a onClick={this.handleMemberClicked.bind(this, this.props.data.data.records[i].records[i])}>
              {this.props.data.data.records[i].member.full_name}
            </a>
            {this.renderARNumber(this.props.data.data.records[i].member)}
          </strong>
          <br/>
          <small className="badge bg-info">
            {this.props.data.data.records[i].member.member_type}
        
          </small>
        </td>
      );

      for(var j = 0; j < this.props.data.data.records[i].records.length; j++) {

        var paymentRecord = this.props.data.data.records[i].records[j];

        if(paymentRecord.record_type == "LOAN_PAYMENT" && paymentRecord.enabled == true) {
          if(this.props.data.status == "pending"  && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
            components.push(
              <td key={"loan-payment-" + paymentRecord.loan_id} className="text-end">
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
              <td key={"loan-payment-" + paymentRecord.loan_id} className="text-end">
                {numberWithCommas(paymentRecord.amount)}
              </td>
            );
          }

          // Add grand total
          grandTotal += parseFloat(paymentRecord.amount);
        } else if(paymentRecord.record_type == "SAVINGS" && paymentRecord.enabled == true) {
          if(this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false )  {
            components.push(
              <td key={"savings-" + paymentRecord.member_account_id} className="text-end">
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
              <td key={"savings-" + paymentRecord.member_account_id} className="text-end">
                {numberWithCommas(paymentRecord.amount)}
              </td>
            );
          }

          // Add grand total
          grandTotal += parseFloat(paymentRecord.amount);
        
        } else if(paymentRecord.record_type == "EQUITY" && paymentRecord.enabled == true) {
          if(this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
            components.push(
              <td key={"equity-" + paymentRecord.member_account_id} className="text-end">
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
              <td key={"equity-" + paymentRecord.member_account_id} className="text-end">
                {numberWithCommas(paymentRecord.amount)}
              </td>
            );
          }

          // Add grand total
          grandTotal += parseFloat(paymentRecord.amount);


        } else if(paymentRecord.record_type == "INSURANCE" && paymentRecord.enabled == true) {
          if(this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
            components.push(
              <td key={"insurance-" + paymentRecord.member_account_id} className="text-end">
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
              <td key={"insurance-" + paymentRecord.member_account_id} className="text-end">
                {numberWithCommas(paymentRecord.amount)}
              </td>
            );
          }

          // Add grand total
          grandTotal += parseFloat(paymentRecord.amount);




        } else if(paymentRecord.record_type == "WP" && paymentRecord.enabled == true) {
          if(this.props.data.status == "pending"  && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
            components.push(
              <td key={"WP-" + paymentRecord.member_account_id} className="text-end">
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
              <td key={"WP-" + paymentRecord.member_account_id} className="text-end">
                {numberWithCommas(paymentRecord.amount)}
              </td>
            );
          }
        } else {
          components.push(
            <td key={"na-" + member.id + "-" + j}>
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

      components.push(
        <td key={"c-member-grand-total-" + member.id} className="text-end">
          <strong>
            {numberWithCommas(grandTotal)}
          </strong>
        </td>
      );

      records.push(
        <tr key={"member-row-" + i} style={{ backgroundColor: (record.attendance ? '' : '') }}>
          {components}
        </tr>
      );
    }

    return records;
  }

  buildTotals() {
    var records     = [];
    var grandTotal  = 0.00;

    records.push(
      <td key="total-empty-td-0">
      </td>
    );

    records.push(
      <td key="total-label">
        <strong>
          TOTAL
        </strong>
      </td>
    );

    var totals  = this.props.data.data.totals;
    for(var i = 0; i < totals.length; i++) {
      if(totals[i].record_type == "LOAN_PAYMENT") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-loan-payment-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if(totals[i].record_type == "SAVINGS") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-savings-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if(totals[i].record_type == "EQUITY") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-equity-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if(totals[i].record_type == "INSURANCE") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-insurance-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if(totals[i].record_type == "WP") {
        records.push(
          <td key={"wp-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      }
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

    // Grand Total
    records.push(
      <td key="grand-total-final" className="text-end">
        <div className="badge bg-primary">
          <strong>
            {numberWithCommas(grandTotal)}
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

  handleMemberClicked(currentTransaction) {
    console.log(currentTransaction);
    this.setState({
      modalArIsOpen: true,
      currentTransaction: currentTransaction
    })
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

    if(currentTransaction.record_type == "LOAN_PAYMENT") {
      return (
        <h5>
          Loan Product: &nbsp;
          <span className="text-muted">
            {currentTransaction.loan_product.name}
          </span>
        </h5>
      );
    } else if(currentTransaction.record_type == "SAVINGS") {
      return (
        <h5>
          Savings Deposit
        </h5>
      );
    } else if(currentTransaction.record_type == "INSURANCE") {
      return (
        <h5>
          Insurance: &nbsp;
          <span className="text-muted">
            {currentTransaction.account_subtype} 
          </span>
        </h5>
      );
    } else if(currentTransaction.record_type == "WP") {
      return (
        <h5>
          Withdraw Payment
        </h5>
      );
    } else {
      return (
        <div>
        </div>
      );
    }
  }

  handleARModalConfirm() {
    var currentMember       = this.state.currentMember;
    var context             = this;

    var data = {
      current_member: currentMember,
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    }

    this.setState({
      isLoading: true
    });
    
    $.ajax({
      url: "/api/v1/billings/modify_member_record",
      method: "POST",
      data: data,
      success: function(response) {
        context.setState({
          currentMember: false,
          modalArIsOpen: false,
          isLoading: false
        });

        context.props.updateData(response);
      },
      error: function(response) {
        try {
          context.setState({
            isLoading: false,
            errors: ["Something went wrong"]
          });
        } catch(err) {
          console.log(response);
          alert("Something went wrong!");
        }
      }
    });
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
      url: "/api/v1/billings/modify_transaction_record",
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

  render() {
    var currentTransaction  = this.state.currentTransaction;
    var currentMember       = this.state.currentMember;

    return (
      <>
        <Modal
          show={this.state.modalIsOpen}
          onHide={this.handleModalClose.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {currentMember.fullName}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
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
          </Modal.Body>

          <Modal.Footer>
            <Button 
              variant="primary"
              onClick={this.handleModalConfirm.bind(this)}
              disabled={this.state.isLoading}
            >
              Confirm Change
            </Button>
            <Button
              variant="secondary"
              onClick={this.handleModalClose.bind(this)}
              disabled={this.state.isLoading}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.modalArIsOpen}
          onHide={() => { this.setState({ modalArIsOpen: false }) }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {currentMember.full_name}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <h5>
              AR Number: 
              jef
            </h5>
            <input
              type="number"
              className="form-control"
              value={currentMember.ar_number}
              disabled={this.state.isLoading}
              onChange={(event) => { currentMember.ar_number = event.target.value; this.setState({ currentMember: currentMember }); }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button 
              variant="primary"
              disabled={this.state.isLoading}
              onClick={this.handleARModalConfirm.bind(this)}
            >
              Save changes
            </Button>
            <Button 
              variant="secondary"
              onClick={() => { this.setState({ modalArIsOpen: false }) }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-sm tableFixHead">
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
      </>
    );
  }
}
