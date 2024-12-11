import React from 'react';
import { useState } from 'react';
import $ from 'jquery';
import ReactTable from 'react-table';
import Toggle from 'react-toggle';
import ToggleSwitch from '../utils/ToggleSwitch';

import { numberWithCommas } from '../utils/helpers';
import { customStyles } from '../utils/consts';

import ErrorDisplay from '../ErrorDisplay';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class BillingUITable extends React.Component {
  constructor(props) {
    super(props);
  

    this.state = {
      currentTransaction: false,
      currentAmountValue: false,
      currentMember: false,
      memberRecords: false,
      modalIsOpen: false,
      modalArIsOpen: false,
      modalTotal: 0.00,
      isLoading: false,
      errors: false,
      grandTotal: 0.00,
    };

    
  }


  buildHeaders() {
    var headers = [];

    headers.push(
      <th key={"h-member-attendance"} style={{ minWidth: "100px" }} >
        <center>
          <small>
            Attend.
          </small>
          <br />
          <div className="btn-group">
            <div
              className="btn btn-success btn-sm"
              onClick={this.handleToggleAllOn.bind(this)}
            >
              <span className="bi bi-check" />
            </div>
            <div
              className="btn btn-danger btn-sm"
              onClick={this.handleToggleAllOff.bind(this)}
            >
              <span className="bi bi-x" />
            </div>
          </div>
        </center>
      </th>
    );

    headers.push(
      <th key={"h-member"} style={{ minWidth: "300px" }} >
        Member
      </th>
    );

    for (var i = 0; i < this.props.data.data.headers.length; i++) {
      headers.push(
        <th key={"h-" + i} style={{ minWidth: "100px" }}>
          <center>
            <small>
              {this.props.data.data.headers[i]}
            </small>
          </center>
        </th>
      );
    }

    headers.push(
      <th key={"h-total-cp"} style={{ minWidth: "40px" }} >
        <center>
          CP
        </center>
      </th>
    );


    headers.push(
      <th key={"h-grand-total"} style={{ minWidth: "40px" }} >
        <center>
          LP
        </center>
      </th>
    );

    headers.push(
      <th key={"h-total"} style={{ minWidth: "40px" }} >
        <center>
          TOTAL
        </center>
      </th>
    );

    return headers;
  }

  handleToggleAllOn() {
    var context = this;

    var data = {
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    $.ajax({
      url: "/api/v1/billings/toggle_attendance_on",
      method: 'POST',
      data: data,
      success: function (response) {
        context.props.updateData(response);
        window.location.reload();
      },
      error: function (response) {
        alert("Error in toggling attendance (all on)");
      }
    });
  }

  handleToggleAllOff() {
    var context = this;

    var data = {
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    $.ajax({
      url: "/api/v1/billings/toggle_attendance_off",
      method: 'POST',
      data: data,
      success: function (response) {
        context.props.updateData(response);
        window.location.reload();
      },
      error: function (response) {
        alert("Error in toggling attendance (all off)");
      }
    });
  }

  handleToggled(memberId) {
    var context = this;

    var data = {
      member_id: memberId,
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    $.ajax({
      url: "/api/v1/billings/toggle_attendance",
      method: 'POST',
      data: data,
      success: function (response) {
        context.props.updateData(response);
      },
      error: function (response) {
        alert("Error in toggling attendance");
      }
    });
  }

  fetchGrandTotal() {
    var t = 0.00
    for (var i = 0; i < this.props.data.data.records.length; i++) {
      for (var j = 0; j < this.props.data.data.records[i].records.length; j++) {
        var paymentRecord = this.props.data.data.records[i].records[j];
        t += parseFloat(paymentRecord.amount);
      }
    }

    return t;
  }

  renderARNumber(member) {
    if (member.ar_number) {
      return (
        <>
          <br />
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

    for (var i = 0; i < this.props.data.data.records.length; i++) {
      var components = [];
      var memberRecords = this.props.data.data.records[i].records;
      var record = this.props.data.data.records[i];
      var member = record.member;
      var grandTotal = 0.00;

      if (this.props.data.status == "pending") {
        components.push(
          <td key={"c-member-attnd-" + member.id}>
            <center>
              <ToggleSwitch
                key={"c-member-attnd-toggle-switch-" + member.id}
                name={"c-member-attnd-toggle-switch-" + member.id}
                checked={record.attendance}
                onChange={this.handleToggled.bind(this, member.id)} 
              />
            </center>
          </td>
        );
      } else if (record.attendance) {
        components.push(
          <td key={"c-member-attnd-" + member.id}>
            <center>
              <div className="badge bg-success">
                <span className="bi bi-check" />
              </div>
            </center>
          </td>
        );
      } else {
        components.push(
          <td key={"c-member-attnd-" + member.id} >
            <center>
              <div className="badge bg-danger">
                <span className="fa fa-minus" />
              </div>
            </center>
          </td>
        );
      }

      components.push(
        <td key={"c-member-" + member.id} >
          <strong>
            <a onClick={this.handleMemberClicked.bind(this, this.props.data.data.records[i].member, this.props.data.data.records[i].records)}>
              {this.props.data.data.records[i].member.full_name}
            </a>
            {this.renderARNumber(this.props.data.data.records[i].member)}
          </strong>
          <br />
          <small className="badge bg-info">
            {this.props.data.data.records[i].member.member_type}
          </small>
          {
  this.props.data.data.records[i].member.data &&
  "sms_record" in this.props.data.data.records[i].member.data &&
  this.props.data.data.records[i].member.data.sms_record &&
  this.props.data.data.records[i].member.data.sms_record.sms_rec === true ? (
    <>
      {/* Add validation for sms_validation */}
      {this.props.data.data.records[i].member.data.sms_record.sms_rec === true ? (
        <>
          {/* Check if loan_maturity date is greater than the current date */}
          {this.props.data.data.records[i].member.data.sms_record.loan_maturity ? (
            new Date(this.props.data.data.records[i].member.data.sms_record.loan_maturity) > new Date() ? (
              <small className='badge bg-success'>
                Sms is Active
              </small>
            ) : (
              <small className='badge bg-danger'>
                Sms is not Active
              </small>
            )
          ) : (
            <>
              <small className='badge bg-danger'>
                Sms is not Active
              </small>
            </>
          )}
        </>
      ) : (
        <>
          <small className='badge bg-danger'>
            Sms is not Active
          </small>
        </>
      )}
    </>
  ) : (
    <>
      <small className='badge bg-danger'>
        Sms is Inactive
      </small>
    </>
  )
}

          </td>
        );

      for (var j = 0; j < this.props.data.data.records[i].records.length; j++) {

        var paymentRecord = this.props.data.data.records[i].records[j];

        if (paymentRecord.record_type == "LOAN_PAYMENT" && paymentRecord.enabled == true) {
          if (this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
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
        } else if (paymentRecord.record_type == "SAVINGS" && paymentRecord.enabled == true) {
          if (this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
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

        } else if (paymentRecord.record_type == "EQUITY" && paymentRecord.enabled == true) {
          if (this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
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


        } else if (paymentRecord.record_type == "INSURANCE" && paymentRecord.enabled == true) {
          if (this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
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




        } else if (paymentRecord.record_type == "WP" && paymentRecord.enabled == true) {
          if (this.props.data.status == "pending" && this.props.data.data.is_checked == null || this.props.data.data.is_checked == false) {
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
        <td key={"c-member-grand-total-lp" + member.id} className="text-end">
          <strong>
            {numberWithCommas(this.props.data.data.records[i].total_loan_payment)}
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
    var records = [];
    var grandTotal = 0.00;

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

    var totals = this.props.data.data.totals;
    for (var i = 0; i < totals.length; i++) {
      if (totals[i].record_type == "LOAN_PAYMENT") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-loan-payment-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if (totals[i].record_type == "SAVINGS") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-savings-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if (totals[i].record_type == "EQUITY") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-equity-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if (totals[i].record_type == "INSURANCE") {
        grandTotal += parseFloat(totals[i].amount);

        records.push(
          <td key={"total-insurance-" + totals[i].key} className="text-end">
            <strong>
              {numberWithCommas(totals[i].amount)}
            </strong>
          </td>
        );
      } else if (totals[i].record_type == "WP") {
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
    records.push(
      <td key="grand-total-loan-paymet-total" className="text-end">
        <div className="badge bg-success">
          <strong>
            {numberWithCommas(this.props.data.data.grand_total_loan_paymet)}
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

  handleMemberClicked(member, memberRecords) {
    var status = this.props.data.status;
    if (status == "pending"){
      this.setState({
        modalArIsOpen: true,
        currentMember: member,
        memberRecords: memberRecords
      });
    }

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
    var currentTransaction = this.state.currentTransaction;
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
    var currentTransaction = this.state.currentTransaction;
    if (currentTransaction) {
      currentTransaction.amount = event.target.value;
      console.log(currentTransaction.amount);
      this.setState({
        currentTransaction: currentTransaction
      });
    }
  }

  handleModalInputChanged(event,index) {
    console.log(index);
  }
  renderEquityTransaction() {
    var memberRecords = this.state.memberRecords;
    const renderRecords = [];

    Array.from(this.state.memberRecords).forEach((record, index)=>{
      (record.record_type == "EQUITY" && record.enabled == true) ? (
        renderRecords.push(<div key={index} className='mb-3'>
            <label className='form-label'>{record.account_subtype}</label>
            <input
              type="number"
              id = {record.account_subtype}
              className="form-control"
              value={this.state.memberRecords[index].amount}
              disabled={this.state.isLoading}
              onChange={text=>{
              this.setState(state =>({
                ...state, 
                memberRecords: state.memberRecords.map((val, i)=>{
                  if(i !== index) {return val}
                  else return {...val, amount: text.target.value}
                })
              }))
              
            }}
            
            />
          </div>)
      ) : (<></>)
    })
    return (
      <ul>
        {renderRecords}
      </ul>
    )
  }
  renderTotalModal(){
    var memberRecords = this.state.memberRecords
    var modalTotal = this.state.modalTotal;
    const renderRecords = [];

    Array.from(memberRecords).forEach((record, index)=>{
      if (record.record_type == "LOAN_PAYMENT" && record.enabled == true) {
        modalTotal = modalTotal + parseFloat(this.state.memberRecords[index].amount)
          
      }
      else if ((record.record_type == "SAVINGS" && record.enabled == true)){
        modalTotal = modalTotal + parseFloat(this.state.memberRecords[index].amount)
        
      }
      else if ((record.record_type == "LOAN_PAYMENT" && record.enabled == true)) {
        modalTotal = modalTotal + parseFloat(this.state.memberRecords[index].amount)
        
      }
      else if ((record.record_type == "EQUITY" && record.enabled == true)) {
        modalTotal = modalTotal + parseFloat(this.state.memberRecords[index].amount)
        
      }
      else if ((record.record_type == "WP" && record.enabled == true)) {
        modalTotal = modalTotal - parseFloat(this.state.memberRecords[index].amount)
      }
      else if ((record.record_type == "INSURANCE" && record.enabled == true)) {
        modalTotal = modalTotal + parseFloat(this.state.memberRecords[index].amount)
      }
    })

    renderRecords.push(
      <div>
        <label className='form-label'> TOTAL CASH PAYMENT </label>
        <input 
        type="number"
        className='form-control'
        disabled='true'
        value={modalTotal}
        />
      </div>

    )

    return (
      <ul>
        {renderRecords}
      </ul>
    )

  }
  renderWithdrawTransaction() {
    var memberRecords = this.state.memberRecords;
    const renderRecords = [];

    Array.from(this.state.memberRecords).forEach((record, index)=>{
      (record.record_type == "WP" && record.enabled == true) ? (
        renderRecords.push(<div key={index} className='mb-3'>
            <label className='form-label'>{record.account_subtype}</label>
            <input
              type="number"
              id = {record.account_subtype}
              className="form-control"
              value={this.state.memberRecords[index].amount}
              disabled={this.state.isLoading}
              onChange={text=>{
              this.setState(state =>({
                ...state, 
                memberRecords: state.memberRecords.map((val, i)=>{
                  if(i !== index) {return val}
                  else return {...val, amount: text.target.value}
                })
              }))
              
            }}
            
            />
          </div>)
      ) : (<></>)
    })

    return (
      <ul>
        {renderRecords}
      </ul>
    )
  }
  renderInsuranceTransaction() {
    var memberRecords = this.state.memberRecords;
    const renderRecords = [];

    Array.from(this.state.memberRecords).forEach((record, index)=>{
      (record.record_type == "INSURANCE" && record.enabled == true) ? (
        renderRecords.push(<div key={index} className='mb-3'>
            <label className='form-label'>{record.account_subtype}</label>
            <input
              type="number"
              id = {record.account_subtype}
              className="form-control"
              value={this.state.memberRecords[index].amount}
              disabled={this.state.isLoading}
              onChange={text=>{
              this.setState(state =>({
                ...state, 
                memberRecords: state.memberRecords.map((val, i)=>{
                  if(i !== index) {return val}
                  else return {...val, amount: text.target.value}
                })
              }))
              
            }}
            
            />
          </div>)
      ) : (<></>)
    })
    return (
      <ul>
        {renderRecords}
      </ul>
    )
  }
  renderSavingsTransaction() {
    var memberRecords = this.state.memberRecords;
    const renderRecords = [];

    Array.from(this.state.memberRecords).forEach((record, index)=>{
      (record.record_type == "SAVINGS" && record.enabled == true) ? (
        renderRecords.push(<div key={index} className='mb-3'>
            <label className='form-label'>{record.account_subtype}</label>
            <input
              type="number"
              id = {record.account_subtype}
              className="form-control"
              value={this.state.memberRecords[index].amount}
              disabled={this.state.isLoading}
              onChange={text=>{
              this.setState(state =>({
                ...state, 
                memberRecords: state.memberRecords.map((val, i)=>{
                  if(i !== index) {return val}
                  else return {...val, amount: text.target.value}
                })
              }))
              
            }}
            
            />
          </div>)
      ) : (<></>)
    })
    return (
      <ul>
        {renderRecords}
      </ul>
    )
  }
  renderLoansTransaction() {

    var memberRecords = this.state.memberRecords;
    const renderRecords = [];

    Array.from(this.state.memberRecords).forEach((record, index)=>{
        (record.record_type == "LOAN_PAYMENT" && record.enabled == true) ? (
          renderRecords.push(<div key={index} className='mb-3'>
              <label className='form-label'>{record.loan_product.name}</label>
              <input
                type="number"
                id = {record.loan_product.name}
                className="form-control"
                value={this.state.memberRecords[index].amount}
                disabled={this.state.isLoading}
                onChange={text=>{
                this.setState(state =>({
                  ...state, 
                  memberRecords: state.memberRecords.map((val, i)=>{
                    if(i !== index) {return val}
                    else return {...val, amount: text.target.value}
                  })
                }))
              }}
              
              />
            </div>)
        ) : (<></>)
      })
      

    return (
      <ul>
        {renderRecords}
      </ul>
    )
  }

  renderTransactionParticular() {
    var currentTransaction = this.state.currentTransaction;
    var currentMember = this.state.currentMember;
    
    if (currentTransaction.record_type == "LOAN_PAYMENT") {
      return (
        <h5>
          Loan Product: &nbsp;
          <span className="text-muted">
            {currentTransaction.loan_product.name}

          </span>
        </h5>
      );
    } else if (currentTransaction.record_type == "SAVINGS") {
      return (
        <h5>
          Savings Deposit
        </h5>
      );
    } else if (currentTransaction.record_type == "INSURANCE") {
      return (
        <h5>
          Insurance: &nbsp;
          <span className="text-muted">
            {currentTransaction.account_subtype}
          </span>
        </h5>
      );
    } else if (currentTransaction.record_type == "WP") {
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

    // FOR AR NUMBER
    var currentMember = this.state.currentMember;
    var memberRecords = this.state.memberRecords;
    var context = this;

    console.log("data", this.state.memberRecords);

    var data = {
      current_member: currentMember,
      id: this.props.id,
      member_records: memberRecords,
      authenticity_token: this.props.authenticityToken
    }
    

    this.setState({
      isLoading: true
    });

    $.ajax({
      url: "/api/v1/billings/modify_member_record",
      method: "POST",
      data: data,
      success: function (response) {
        context.setState({
          currentMember: false,
          memberRecords: false,
          modalArIsOpen: false,
          errors: false,
          isLoading: false
        });

        context.props.updateData(response);
      },
      error: function (response) {
        var errors = JSON.parse(response.responseText).errors;
        try {
          context.setState({
            isLoading: false,
            errors: errors
          });
        } catch (err) {
          console.log(response);
          alert("Something went wrong!");
          context.setState({
            isLoading: false
          });
        }
      }
    });

  }

  handleModalConfirm() {
    var currentTransaction = this.state.currentTransaction;
    var currentMember = this.state.currentMember;
    var context = this;

    var data = {
      current_transaction: currentTransaction,
      current_member: currentMember,
      id: this.props.id,
      authenticity_token: this.props.authenticityToken
    };

    console.log("data", data);

    this.setState({
      isLoading: true
    });

    $.ajax({
      url: "/api/v1/billings/modify_transaction_record",
      method: "POST",
      data: data,
      success: function (response) {
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
      error: function (response) {
        try {
          var errors = JSON.parse(response.responseText).errors;

          context.setState({
            isLoading: false,
            errors: errors
          });
        } catch (err) {
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
    if (this.state.isLoading) {
      return (
        <div className="callout callout-info">
          Loading...
        </div>
      );
    } else if (this.state.errors) {
      return (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    }
  }

  render() {
    var currentTransaction = this.state.currentTransaction;
    var currentMember = this.state.currentMember;
    const memberRecords = this.state.memberRecords;



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

            <hr />

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
              <a href={"/members/" + currentMember.id + "/display"} target='_blank'>
                {currentMember.full_name}
              </a>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>
              AR Number:
            </h5>
            <input
              type="number"
              className="form-control"
              value={currentMember.ar_number}
              disabled={this.state.isLoading}
              onChange={(event) => { currentMember.ar_number = event.target.value; this.setState({ currentMember: currentMember }); }}
            />
            <hr></hr>
            {this.renderLoadingStatus()}
            <div className='mb-3'>
              <h6>Loan Transaction</h6>
              {this.renderLoansTransaction()}
            </div>
            <hr></hr>
            <div className='mb-3'>
              <h6> Savings </h6>
              {this.renderSavingsTransaction()}
            </div>
            <hr></hr>
            <div className='mb-3'>
              <h6>Equity Accounts</h6>
              {this.renderEquityTransaction()}
            </div>
            <hr></hr>
            <div className='mb-3'>
              <h6>Insurance Accounts</h6>
              {this.renderInsuranceTransaction()}
            </div>
            <div className='mb-3'>
              <h6>Withdraw</h6>
              {this.renderWithdrawTransaction()}
            </div>
            <div className='mb-3'>
              <h6>TOTAL</h6>
              {this.renderTotalModal()}
            </div>
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
        <div className="tableFixHead">
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
      </>
    );
  }
}
