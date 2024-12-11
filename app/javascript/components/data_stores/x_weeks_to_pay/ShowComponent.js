import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

import SkCubeLoading from '../../SkCubeLoading';
import ErrorDisplay from '../../ErrorDisplay';
import {numberWithCommas} from '../../utils/helpers';

export default class ShowComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false,
      errors: false,
      officers: [],
      centers: [],
      loanProducts: [],
      currentOfficerId: "",
      currentCenterId: "",
      currentLoanProductId: ""
    };
  }

  fetch(options) {
    var context       = this;
    var officerId     = options.officerId || "";
    var centerId      = options.centerId || "";
    var loanProductId = options.loanProductId || "";

    var data  = {
      id: this.props.id,
      officer_id: officerId,
      center_id: centerId,
      loan_product_id: loanProductId
    }

    this.setState({
      currentOfficerId: officerId,
      currentCenterId: centerId,
      currentLoanProductId: loanProductId,
      isLoading: true
    });

    $.ajax({
      url: "/api/v1/data_stores/x_weeks_to_pay/fetch",
      data: data,
      method: 'GET',
      success: function(response) {
        console.log(response);

        context.setState({
          isLoading: false,
          data: response
        });
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong when fetching data store");
      }
    });
  }

  componentDidMount() {
    var context = this;

    $.ajax({
      url: "/api/v1/data_stores/x_weeks_to_pay/fetch",
      data: {
        id: context.props.id
      },
      method: 'GET',
      success: function(response) {
        console.log(response);

        // Setup officers, centers and loan_products
        var officers          = [];
        var centers           = [];
        var loanProducts      = [];

        if(response.data.records.length > 0) {
          for(var i = 0; i < response.data.officers.length; i++) {
            officers.push(
              response.data.officers[i]
            );
          }

          for(var i = 0; i < response.data.centers.length; i++) {
            centers.push(
              response.data.centers[i]
            );
          }

          for(var i = 0; i < response.data.loan_products.length; i++) {
            loanProducts.push(
              response.data.loan_products[i]
            );
          }
        }

        context.setState({
          isLoading: false,
          data: response,
          officers: officers,
          centers: centers,
          loanProducts: loanProducts
        });
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong when fetching data store");
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

  handleOfficerChanged(event) {
    this.fetch({
      officerId: event.target.value
    });
  }

  handleCenterChanged(event) {
    this.fetch({
      centerId: event.target.value,
      loanProductId: this.state.currentLoanProductId
    });
  }

  handleLoanProductChanged(event) {
    this.fetch({
      loanProductId: event.target.value,
      centerId: this.state.currentCenterId
    });
  }

  renderFilter() {
    var officerOptions  = [
      <option key={"officer-select"} value="">
        -- SELECT --
      </option>
    ];

    var centerOptions   = [
      <option key={"center-select"} value="">
        -- SELECT --
      </option>
    ];

    var loanProductOptions  = [
      <option key={"loan-product-select"} value="">
        -- SELECT --
      </option>
    ];

    for(var i = 0; i < this.state.officers.length; i++) {
      officerOptions.push(
        <option key={"officer-" + i} value={this.state.officers[i].id}>
          {this.state.officers[i].last_name + ", " + this.state.officers[i].first_name}
        </option>
      );
    }

    for(var i = 0; i < this.state.centers.length; i++) {
      centerOptions.push(
        <option key={"center-" + i} value={this.state.centers[i].id}>
          {this.state.centers[i].name}
        </option>
      );
    }

    for(var i = 0; i < this.state.loanProducts.length; i++) {
      loanProductOptions.push(
        <option key={"loan-product-" + i} value={this.state.loanProducts[i].id}>
          {this.state.loanProducts[i].name}
        </option>
      );
    }

    return  (
      <div className="row">
        <div className="col-md-4 col-xs-12">
          <div className="form-group">
            <label>
              Center:
            </label>
            <select value={this.state.currentCenterId} onChange={this.handleCenterChanged.bind(this)} className="form-control">
              {centerOptions}
            </select>
          </div>
        </div>
        <div className="col-md-4 col-xs-12">
          <div className="form-group">
            <label>
              Loan Product:
            </label>
            <select value={this.state.currentLoanProductId} onChange={this.handleLoanProductChanged.bind(this)} className="form-control">
              {loanProductOptions}
            </select>
          </div>
        </div>
        <div className="col-md-4 col-xs-12">
          <div className="form-group">
            <label>
              Officers:
            </label>
            <select value={this.state.currentOfficerId} onChange={this.handleOfficerChanged.bind(this)} className="form-control">
              {officerOptions}
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderDataRows() {
    var rows    = [];
    var records = this.state.data.data.records;
    var counter = 0;

    var totalLoanAmount       = 0.00;
    var totalPrincipalBalance = 0.00;
    var totalInterestBalance  = 0.00;
    var totalBalance          = 0.00;

    for(var i = 0; i < records.length; i++) {
      if(parseFloat(records[i].overall_balance) > 0) {
        counter++;

        totalLoanAmount       += parseFloat(records[i].principal);
        totalPrincipalBalance += parseFloat(records[i].overall_principal_balance);
        totalInterestBalance  += parseFloat(records[i].overall_interest_balance);
        totalBalance          += parseFloat(records[i].overall_balance);

        rows.push(
          <tr key={"loan-record-" + records[i].id}>
            <td className="text-center">
              {counter}
            </td>
            <td>
              <strong>
                <a href={"/loans/" + records[i].id} target="_blank">
                  {records[i].member.last_name}, {records[i].member.first_name} {records[i].member.middle_name}
                </a>
              </strong>
            </td>
            <td className="text-muted">
              {records[i].center.name}
            </td>
            <td className="">
              <strong>
                {records[i].loan_product.name}
              </strong>
            </td>
            <td className="text-end">
              {numberWithCommas(records[i].principal)}
            </td>
            <td className="text-end">
              {numberWithCommas(records[i].overall_principal_balance)}
            </td>
            <td className="text-end">
              {numberWithCommas(records[i].overall_interest_balance)}
            </td>
            <td className="text-end">
              {numberWithCommas(records[i].overall_balance)}
            </td>
            <td>
              {records[i].maturity_date}
            </td>
          </tr>
        );
      }
    }

    rows.push(
      <tr key={"grand-total"}>
        <td colSpan="4"/>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalLoanAmount)}
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalPrincipalBalance)}
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalInterestBalance)}
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalBalance)}
          </strong>
        </td>
        <td/>
      </tr>
    );

    return rows;
  }

  renderDisplay() {
    return  (
      <div>
        <table className="table table-sm table-bordered table-hover" style={{fontSize: "0.8em"}}>
          <thead>
            <tr>
              <th className="text-center">
              </th>
              <th>
                Member
              </th>
              <th>
                Center
              </th>
              <th>
                Product
              </th>
              <th className="text-end">
                Loan Amount
              </th>
              <th className="text-end">
                Principal Balance
              </th>
              <th className="text-end">
                Interest Balance
              </th>
              <th className="text-end">
                Total Balance
              </th>
              <th className="">
                Maturity Date
              </th>
            </tr>
          </thead>
          <tbody>
            {this.renderDataRows()}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
      return  (
        <div>
          {this.renderFilter()}
          {this.renderDisplay()}
        </div>
      );
    }
  }
}
