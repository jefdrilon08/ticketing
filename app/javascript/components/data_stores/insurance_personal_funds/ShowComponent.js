import React from 'react';
import $ from 'jquery';
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
      accountHeaders: [],
      officers: [],
      centers: [],
      currentOfficerId: "",
      currentCenterId: "",
      xKoinsAppAuthSecret: props.xKoinsAppAuthSecret,
      userId: props.userId
    };
  }

  fetch(options) {
    var context   = this;
    var officerId = options.officerId || "";
    var centerId  = options.centerId || "";

    var data  = {
      id: this.props.id,
      officer_id: officerId,
      center_id: centerId
    }

    console.log("fetch (data):");
    console.log(data);

    this.setState({
      currentOfficerId: officerId,
      currentCenterId: centerId,
      isLoading: true
    });

    $.ajax({
      url: "/api/v1/data_stores/insurance_personal_funds/fetch",
      data: data,
      method: 'GET',
      headers: {
        'X-KOINS-APP-AUTH-SECRET': context.state.xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
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
      url: "/api/v1/data_stores/insurance_personal_funds/fetch",
      data: {
        id: context.props.id
      },
      method: 'GET',
      headers: {
        'X-KOINS-APP-AUTH-SECRET': context.state.xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      success: function(response) {
        console.log(response);

        // Setup account headers, officers and centers
        var accountHeaders    = [];
        var officers          = [];
        var centers           = [];

        if(response.data.records.length > 0) {
          for(var i = 0; i < response.data.records[0].accounts.length; i++) {
            accountHeaders.push(
              response.data.records[0].accounts[i].account_subtype
            );
          }
          
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
        }

        context.setState({
          isLoading: false,
          accountHeaders: accountHeaders,
          data: response,
          officers: officers,
          centers: centers
        });
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong when fetching data store");
      }
    });
  }

  handleDownloadExcel() {
    var context   = this;
    var officerId = context.state.currentOfficerId || "";
    var centerId  = context.state.currentCenterId || "";

    var data  = {
      id: this.props.id,
      officer_id: officerId,
      center_id: centerId,
      user_id: context.state.userId
    }

    $.ajax({
      url: "/api/v1/data_stores/insurance_personal_funds/download_excel",
      data: data,
      headers: {
        'X-KOINS-APP-AUTH-SECRET': context.state.xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      method: 'GET',
      success: function(response) {
        console.log(response);

        var filename = response.filename;

        window.location.href = "/download_file?filename=" + filename;
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

  renderAccountHeaders() {
    var headers = [];

    // Member name
    headers.push(
      <th key="member-header">
        Member
      </th>
    );

    // Officer
    headers.push(
      <th key="officer-header">
        Officer
      </th>
    );

    // Center
    headers.push(
      <th key="center-header">
        Center
      </th>
    );

    console.log(this.state.accountHeaders);
    for(var i = 0; i < this.state.accountHeaders.length; i++) {
      headers.push(
        <th className="text-end" key={"account-header-" + i}>
          {this.state.accountHeaders[i]}
        </th>
      );
    }

    return headers;
  }

  renderAccountValues(index, accounts) {
    var columns = [];

    for(var i = 0; i < accounts.length; i++) {
      if(accounts[i].account_type == "SAVINGS" && accounts[i].id) {
        columns.push(
          <td className="text-end">
            <a href={"/savings_accounts/" + accounts[i].id} target="_blank">
              {numberWithCommas(accounts[i].balance)}
            </a>
          </td>
        );
      } else {
        columns.push(
          <td className="text-end">
            {numberWithCommas(accounts[i].balance)}
          </td>
        );
      }
    }

    return columns;
  }

  renderDataRows() {
    var rows  = [];
    var records = this.state.data.data.records;

    for(var i = 0; i < records.length; i++) {
      rows.push(
        <tr key={"record-item-" + i}>
          <td>
            {records[i].member.last_name + ", " + records[i].member.first_name + " " + records[i].member.middle_name}
          </td>
          <td>
            {records[i].officer.last_name + ", " + records[i].officer.first_name}
          </td>
          <td className="text-muted">
            {records[i].center.name}
          </td>
          {this.renderAccountValues(i, records[i].accounts)}
        </tr>
      );
    }

    return rows;
  }

  renderDataTotals() {
    var columns = [];
    var records = this.state.data.data.records;

    columns.push(
      <th colSpan="3">
        TOTAL: ({records.length})
      </th>
    );

    var totals  = [];

    for(var i = 0; i < this.state.accountHeaders.length; i++) {
      totals.push(0.00);
    }

    for(var i = 0; i < records.length; i++) {
      for(var j = 0; j < records[i].accounts.length; j++) {
        totals[j] += parseFloat(records[i].accounts[j].balance);
      }
    }

    for(var i = 0; i < totals.length; i++) {
      columns.push(
        <th className="text-end">
          {numberWithCommas(totals[i])}
        </th>
      );
    }

    return columns;
  }

  handleOfficerChanged(event) {
    this.fetch({
      officerId: event.target.value
    });
  }

  handleCenterChanged(event) {
    this.fetch({
      centerId: event.target.value
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

    return  (
      <div className="row">
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
            Action:
          </label>
          <br></br>
            <button className='btn btn-primary btn-block' href='#' onClick={this.handleDownloadExcel.bind(this)}>Download Excel</button>
          </div>
        </div>
      </div>
    ); 
  }

  renderDisplay() {
    return  (
      <div>
        <table className="table table-sm table-bordered table-hover" style={{fontSize: "0.9em"}}>
          <thead>
            <tr>
              {this.renderAccountHeaders()}
            </tr>
          </thead>
          <tbody>
            {this.renderDataRows()}
          </tbody>
          <tfoot>
            <tr>
              {this.renderDataTotals()}
            </tr>
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
