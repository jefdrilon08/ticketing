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
      currentCenterId: "",
      maturity_year: []
    };
  }

  fetch(options) {

    var context       = this;
    var centerId = options.centerId;
    var year = options.year;
   

    var data  = {
      id: this.props.id,
      center_id: centerId,
      year: year
      
    }
    this.setState({
      currentCenterId: centerId,
      maturity_year: year
    });
    $.ajax({

      url: "/api/v1/data_stores/for_writeoff/fetch",
      data: data,
      method: 'GET',

      success: function(response) {
        context.setState({
          isLoading: false,
          data: response
          
        });
      },
      error: function(response) {
        alert("Something went wrong when fetching data store");
      }
    });
  }

  componentDidMount() {
    var context = this;

    $.ajax({
      url: "/api/v1/data_stores/for_writeoff/fetch",
      data: {
        id: context.props.id
      },

      method: 'GET',

      success: function(response) {
        console.log(response);
        var centers       = response.data.centers;
        var year     = response.data.maturity_year;
        context.setState({
          isLoading: false,
          data: response,
          centers:centers,
          years: year
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
  handleCenterChanged(event) {
      this.fetch({
        centerId: event.target.value,
        years: this.state.currentOfficerId
      });
    }

  

  handleYearChanged(event) {
    this.fetch({
      centerId: this.state.currentCenterId,
      year: event.target.value
    });
  }
  
  renderFilter(){
    var centerOptions   = [
      <option key={"center-select"} value="">
        -- SELECT --
      </option>
    ];

    var yearOptions  = [
      <option key={"yaer-select"} value="">
        -- SELECT --
      </option>
    ];

    for(var i = 0; i < this.state.years.length; i++) {
      yearOptions.push(
        <option key={"year-" + i} value={this.state.years[i].id}>
          {this.state.years[i]}
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
              Maturity Year
            </label>
            <select value={this.state.year} onChange={this.handleYearChanged.bind(this)} className="form-control">
              {yearOptions}
            </select>
          </div>
        </div>
      </div>
    );

  }


  renderMembersData(){
      var rows  = [];
      var member_data = this.state.data.data.records;

      for(var i = 0; i < member_data.length; i++) {
        rows.push(
          <tr key={"member_data-item-" + i} style={{width: "20px" }}>
            <td>
            {i+1}
            </td>
            <td className="text-left" style={{width: "250px" }}>
              <a href={"/members/" + member_data[i].id+"/display"} target='_blank' >
              {member_data[i].last_name + ", " + member_data[i].first_name + " " + member_data[i].middle_name} </a>
            </td>
            <td className="text-center">
              {member_data[i].member_id}
            </td>
            <td className="text-center">
              {member_data[i].member_status}
            </td>
            <td className="text-center">
              <a href={"/loans/" + member_data[i].loan_id} target='_blank'>
              {member_data[i].loan_product}</a>
            </td>
            <td className="text-center">
              {member_data[i].maturity_date}
            </td>
            <td className="text-center">
              {member_data[i].loan_status}
            </td>
            <td className="text-end">
              {numberWithCommas(member_data[i].principal_balance)}
            </td>
            <td className="text-end">
              {numberWithCommas(member_data[i].interest_balance)}
            </td>
            <td className="text-end">
              <a href={"/savings_accounts/" + member_data[i].psa_id} target='_blank'>
              {numberWithCommas(member_data[i].psa_balance)}</a>
            </td>
            <td className="text-end">
              <a href={"/savings_accounts/" + member_data[i].rsa_id} target='_blank'>
              {numberWithCommas(member_data[i].rsa_balance)}</a>
            </td>
            <td className="text-end">
              <a href={"/savings_accounts/" + member_data[i].mbs_id} target='_blank'>
              {numberWithCommas(member_data[i].mbs_balance)}</a>
            </td>
            <td className="text-end">
              <a href={"/savings_accounts/" + member_data[i].gk_id} target='_blank'>
              {numberWithCommas(member_data[i].gk_balance)}</a>
            </td>
            <td className="text-end">
              <a href={"/insurance_accounts/" + member_data[i].rf_id} target='_blank'>
              {numberWithCommas(member_data[i].rf_balance)}</a>
            </td>
            <td className="text-end">
              <a href={"/insurance_accounts/" + member_data[i].eq_id} target='_blank'>
              {numberWithCommas(member_data[i].eq_balance)}</a>
            </td>
            <td className="text-end">
              <a href={"/equity_accounts/" + member_data[i].cbu_id} target='_blank'>
              {numberWithCommas(member_data[i].cbu_balance)}</a>
            </td>
            <td className="text-end">
              <a href={"/equity_accounts/" + member_data[i].sharecap_id} target='_blank'>
              {numberWithCommas(member_data[i].sharecap_balance)}</a>
            </td>
            <td className="text-center">
              {member_data[i].center['name']}
            </td>


            
          </tr>
        );
      }
      return rows;
  }
 renderHeader() {
    var headers = [];
    headers.push(
      <th key="num" className="text-center" >
        
      </th>
    );
    headers.push(
      <th key="member-header" className="text-center">
        Member
      </th>
    );
    headers.push(
      <th key="identification-number" className="text-center">
        Identification Number
      </th>
    );
     headers.push(
      <th key="member-status" className="text-center">
        Member Status
      </th>
    );
     headers.push(
      <th key="loan-product" className="text-center">
        Loan Product
      </th>
    );
     headers.push(
      <th key="maturity-date" className="text-center">
        Maturity Date
      </th>
    );
    headers.push(
      <th key="loan-status" className="text-center">
        Loan Status
      </th>
    );
    headers.push(
      <th key="princ-balance" className="text-center">
        Principal Bal
      </th>
    );
    headers.push(
      <th key="interest-balance" className="text-center">
        Interest Bal
      </th>
    );
    headers.push(
      <th key="psa-balance" className="text-center">
        PSA Bal
      </th>
    );

    headers.push(
      <th key="rsa-balance" className="text-center">
       RSA Balance
      </th>
    );
    headers.push(
      <th key="rsa-balance" className="text-center">
       MBS Balance
      </th>
    );
    headers.push(
      <th key="gk-balance" className="text-center">
       GK Bal
      </th>
    );
    headers.push(
      <th key="rf-balance" className="text-center">
       RF Bal
      </th>
    );
    headers.push(
      <th key="lf-balance" className="text-center">
       Equity Account Balance
      </th>
    );
    headers.push(
      <th key="cbu-balance" className="text-center">
       CBU Bal
      </th>
    );

    headers.push(
      <th key="share-cap-balance" className="text-center">
       Share Capital Bal
      </th>
    );
    headers.push(
      <th key="center-header" className="text-center">
       Center
      </th>
    );
    return headers;
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
        <div className="tableWritoff">
          <table className="table table-lg table-bordered table-responsive">
            <thead>
            <tr>
              {this.renderHeader()}
            </tr>
            </thead>
            <tbody>
             {this.renderMembersData()}
            </tbody>
          </table>
          </div>
        </div>
      );
    }
  }
}
