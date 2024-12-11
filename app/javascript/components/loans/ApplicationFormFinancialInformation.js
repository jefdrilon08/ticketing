import React from "react";

export default class ApplicationFormFinancialInformation extends React.Component {
  constructor(props) {
    super(props);
    
    this.state  = {
    }
  }

  handleBankCheckNumber(event) {
    var data  = this.props.data;

    data.data.voucher.bank_check_number = event.target.value;

    this.props.updateData(data);
  }

  handleBank(event) {
    var data  = this.props.data

    data.data.voucher.bank = event.target.value;

    this.props.updateData(data);
  }

  // Voucher check number
  handleCheckNumber(event) {
    var data  = this.props.data;

    data.data.voucher.check_number  = event.target.value;

    this.props.updateData(data);
  }

  handleDateOfCheck(event) {
    var data  = this.props.data;

    data.data.voucher.date_of_check = event.target.value;

    this.props.updateData(data);
  }

  handleDateRequested(event) {
    var data  = this.props.data;

    data.data.voucher.date_requested = event.target.value;

    this.props.updateData(data);
  }

  handleBankTransactionReferenceNumber(event) {
    var data  = this.props.data;

    data.data.voucher.bank_transaction_reference_number = event.target.value;

    this.props.updateData(data);
  }

  renderBanks() {
    var banks       = this.props.banks;
    var bankOptions = [];

    for(var i = 0; i < banks.length; i++) {
      bankOptions.push(
        <option key={"bank-" + i} value={banks[i]}>
          {banks[i]}
        </option>
      );
    }

    return  (
      bankOptions
    );
  }

  render() {
    return  (
      <div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>
                Check Voucher Number
              </label>
              <input
                className="form-control"
                value={this.props.data.data.voucher.check_number}
                onChange={this.handleCheckNumber.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Date Requested
              </label>
              <input
                className="form-control"
                type="date"
                value={this.props.data.data.voucher.date_requested}
                onChange={this.handleDateRequested.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Bank Check Number
              </label>
              <input
                className="form-control"
                value={this.props.data.data.voucher.bank_check_number}
                onChange={this.handleBankCheckNumber.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Date of Check
              </label>
              <input
                className="form-control"
                type="date"
                value={this.props.data.data.voucher.date_of_check}
                onChange={this.handleDateOfCheck.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}
