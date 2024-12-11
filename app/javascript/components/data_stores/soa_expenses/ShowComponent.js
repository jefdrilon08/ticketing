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
      centers: [],
      officers: [],
      currentCenterId: "",
      loanProducts: [],
      currentLoanProductId: "",
      currentOfficerId: ""
    };
  }

  fetch(options) {
    var context       = this;
    var loanProductId = options.loanProductId;
    var centerId      = options.centerId;
    var officerId     = options.officerId;

    var data  = {
      id: this.props.id,
      loan_product_id: loanProductId,
      center_id: centerId,
      officer_id: officerId
    }

    this.setState({
      currentLoanProductId: loanProductId,
      currentCenterId: centerId,
      currentOfficerId: officerId
    });

    $.ajax({
      url: "/api/v1/data_stores/soa_expenses/fetch",
      data: data,
      method: 'GET',
      success: function(response) {
        console.log("response: ", response)
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
      url: "/api/v1/data_stores/soa_expenses/fetch",
      data: {
        id: context.props.id
      },
      method: 'GET',
      success: function(response) {
        var loanProducts  = response.data.loan_products;
        var centers       = response.data.centers;
        var officers      = response.data.officers;

        context.setState({
          isLoading: false,
          data: response,
          loanProducts: loanProducts,
          centers: centers,
          officers: officers
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

  renderDataRows() {
    var rows  = [];
    var records = this.state.data.data.records;

    for(var i = 0; i < records.length; i++) {
      rows.push(
        <tr key={"record-item-" + i}>
          <td className="text-center">
            {i + 1}
          </td>
          <td>
            {records[i].member.full_name}
          </td>
          <td>
            {records[i].center.name}
          </td>
          <td>
            {records[i].loan_product.name}
          </td>
          <td className="text-end">
            {numberWithCommas(records[i].principal)}
          </td>
          <td>
            {records[i].date_released}
          </td>
          <td>
            {records[i].bank_check_number}
          </td>
        </tr>
      );
    }

    return rows;
  }

  handleCenterChanged(event) {
    this.fetch({
      centerId: event.target.value,
      loanProductId: this.state.currentLoanProductId,
      officerId: this.state.currentOfficerId
    });
  }

  handleLoanProductChanged(event) {
    this.fetch({
      loanProductId: event.target.value,
      centerId: this.state.currentCenterId,
      officerId: this.state.currentOfficerId
    });
  }

  handleOfficerChanged(event) {
    this.fetch({
      loanProductId: this.state.currentLoanProductId,
      centerId: this.state.currentCenterId,
      officerId: event.target.value
    });
  }

  renderFilter() {
    var loanProductOptions  = [
      <option key={"select-loan-product"} value="">
        -- SELECT --
      </option>
    ];

    var centerOptions   = [
      <option key={"center-select"} value="">
        -- SELECT --
      </option>
    ];

    var officerOptions  = [
      <option key={"officer-select"} value="">
        -- SELECT --
      </option>
    ];

    for(var i = 0; i < this.state.loanProducts.length; i++) {
      loanProductOptions.push(
        <option key={"loanProduct-" + i} value={this.state.loanProducts[i].id}>
          {this.state.loanProducts[i].name}
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

    for(var i = 0; i < this.state.officers.length; i++) {
      officerOptions.push(
        <option key={"officer-" + i} value={this.state.officers[i].id}>
          {this.state.officers[i].last_name}, {this.state.officers[i].first_name}
        </option>
      );
    }

    return  (
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>
              Loan Product:
            </label>
            <select value={this.state.currentLoanProductId} onChange={this.handleLoanProductChanged.bind(this)} className="form-control">
              {loanProductOptions}
            </select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>
              Center:
            </label>
            <select value={this.state.currentCenterId} onChange={this.handleCenterChanged.bind(this)} className="form-control">
              {centerOptions}
            </select>
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>
              Officer:
            </label>
            <select value={this.state.currentOfficerId} onChange={this.handleOfficerChanged.bind(this)} className="form-control">
              {officerOptions}
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderTotal() {
    var total = 0.00;

    for(var i = 0; i < this.state.data.data.records.length; i++) {
      total += parseFloat(this.state.data.data.records[i].principal);
    }

    return  (
      <tr>
        <th colSpan="4">
          TOTAL
        </th>
        <td className="text-end">
          <strong>
            {numberWithCommas(total)}
          </strong>
        </td>
        <td>
        </td>
        <td>
        </td>
      </tr>
    );
  }

  renderDisplay() {
    return  (
      <div>
        <table className="table table-sm table-bordered table-hover" style={{fontSize: "0.9em"}}>
          <thead>
            <tr>
              <th>
              </th>
              <th>
                Member
              </th>
              <th>
                Center
              </th>
              <th>
                Loan Product
              </th>
              <th className="text-end">
                Amount
              </th>
              <th>
                Date Released
              </th>
              <th>
                Check No.
              </th>
            </tr>
          </thead>
          <tbody>
            {this.renderDataRows()}
          </tbody>
          <tfoot>
            {this.renderTotal()}
          </tfoot>
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
