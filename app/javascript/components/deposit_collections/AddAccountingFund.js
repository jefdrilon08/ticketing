import React from 'react';
import $ from "jquery";
import ErrorDisplay from '../ErrorDisplay';

export default class AddAccountingFund extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.data);
    var accountingFundId = props.data.data.accounting_entry.accounting_fund_id;
    //alert(accountingFundId);

    this.state  = {
      accountingFunds: [],
      accountingFundId: accountingFundId,
      message: "Loading...",
      isLoading: true,
      errors: false
    }
  }

  componentDidMount() {
    var context = this;

    $.ajax({
      url: "/api/v1/deposit_collections/fetch_accounting_funds",
      method: 'GET',
      data: {
        id: context.props.data.id
      },
      success: function(response) {
        context.setState({
          accountingFunds: response.accounting_funds,
          isLoading: false,
          message: ""
        });
      },
      error: function(response) {
        console.log(response);
        context.setState({
          isLoading: false,
          message: "Error! eee"
        });
      }
    });
  }

  handleAccountingFundChanged(event) {
    this.setState({
      accountingFundId: event.target.value
    });
  }

  saveAccountingFund() {
    var context           = this;

    this.setState({
      errors: false,
      isLoading: true
    });

    //alert(context.props.data.id);
    if(this.state.accountingFundId){
      $.ajax({
        url: "/api/v1/deposit_collections/update_accounting_fund",
        method: 'POST',
        data: {
          id: context.props.data.id,
          authenticity_token: this.props.authenticityToken,
          accounting_fund_id: this.state.accountingFundId
        },
        success: function(response) {
          context.setState({
            isLoading: false
          });
        },
        error: function(response) {
          alert("Error in updating accounting fund");
        }
      });
    } else {
      this.setState({
        isLoading: false,
        message: "Accounting fund not selected"
      });
    }  
  }

  renderOptions() {
    var records = [];
    var accountingFunds = this.state.accountingFunds;

    records.push(
      <option key="null">
        -- SELECT --
      </option>
    );

    for(var i = 0; i < accountingFunds.length; i++) {
      records.push(
        <option key={"accounting-fund-" + i} value={accountingFunds[i].id}>
          {accountingFunds[i].name}
        </option>
      );
    }

    return  records;
  }

  renderErrorDisplay() {
    if(this.state.errors) {
      return  (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    } else {
      return  (
        <div>
        </div>
      );
    }
  }

  render() {
    var accountingFundId  = this.state.accountingFunds;

    if(this.props.data.status == "pending") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <select
              className="form-control"
              onChange={this.handleAccountingFundChanged.bind(this)}
              value={this.state.accountingFundId}
              disabled={this.state.isLoading}
            >
              {this.renderOptions()}
            </select>
            <div>
              {this.state.message}
            </div>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isLoading}
              onClick={this.saveAccountingFund.bind(this)}
            >
              <span className="bi bi-check" />
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return "" + this.props.data.data.accounting_fund_name;
    }
  }
}
