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
      loanProducts: [],
      currentOfficerId: "",
      currentCenterId: "",
      currentLoanProductId: ""
    };
  }

  fetch(options) {
    var context       = this;
    var centerId      = options.centerId;
    var loanProductId = options.loanProductId;
    var officerId     = options.officerId;

    var data  = {
      id: this.props.id,
      center_id: centerId,
      loan_product_id: loanProductId,
      officer_id: officerId
    }

    console.log("fetch (data):");
    console.log(data);

    this.setState({
      currentCenterId: centerId,
      currentLoanProductId: loanProductId,
      currentOfficerId: officerId
    });

    $.ajax({
      url: "/api/v1/data_stores/watchlists/fetch",
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
      url: "/api/v1/data_stores/watchlists/fetch",
      data: {
        id: context.props.id
      },
      method: 'GET',
      success: function(response) {
        console.log(response);

        var centers       = response.data.centers;
        var loanProducts  = response.data.loan_products;
        var officers      = response.data.officers;

        context.setState({
          isLoading: false,
          data: response,
          centers: centers,
          loan_products: loanProducts,
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
    var rows      = [];
    var records   = this.state.data.data.records;

    var totalPastDue  = 0.00;
    var totalPrincipalBalance = 0.00;
    var totalInterestBalance = 0.00;
    var x = 0;
   
    var totalCategoryAParAmount     = 0.00;
    var totalCategoryBParAmount     = 0.00;
    var totalCategoryCParAmount     = 0.00;

    for(var i = 0; i < records.length; i++) {
      if(records[i].total_balance > 0) {
	var categoryAParAmount     = 0.00;
	var categoryBParAmount     = 0.00;
	var categoryCParAmount     = 0.00;

	var numDaysPar  = parseInt(records[i].num_days_par);
      	var par         = records[i].par;
	      
	if(par > 0) { 
	   if(numDaysPar >= 1 && numDaysPar <= 30) {
	     categoryAParAmount     	= parseFloat(records[i].overall_principal_balance);
             totalCategoryAParAmount    += categoryAParAmount;

	   } else if(numDaysPar >= 31 && numDaysPar <= 365) {
	     categoryBParAmount     	= parseFloat(records[i].overall_principal_balance);
             totalCategoryBParAmount    += categoryBParAmount;

	   } else if(numDaysPar >= 365){
	     categoryCParAmount     	= parseFloat(records[i].overall_principal_balance);
             totalCategoryCParAmount    += categoryCParAmount;

	   }
	}
	totalPastDue += parseFloat(records[i].total_balance);
	totalPrincipalBalance += parseFloat(records[i].principal_balance);
	totalInterestBalance += parseFloat(records[i].interest_balance);
	x = x+1
        rows.push(
          <tr key={"member-row-" + records[i].member.id + "-" + i}>
            <td className="text-center">
	     {x}
            </td>
            <td>
              <strong>
                <a href={"/loans/" + records[i].id} target='_blank'>
                  {records[i].member.last_name}, {records[i].member.first_name} {records[i].member.middle_name}
                </a>
              </strong>
            </td>
            <td>
              {records[i].center.name}
            </td>
            <td>
              {records[i].officer.last_name}, {records[i].officer.first_name}
            </td>
            <td>
              {records[i].loan_product.name}
            </td>
	    <td className="text-end">
              {numberWithCommas(records[i].principal_balance)}
            </td>
	    <td className="text-end">
              {numberWithCommas(records[i].interest_balance)}
            </td>
	    <td className="text-end">
              {numberWithCommas(records[i].total_balance)}
	    </td>
	    <td className="text-end">
              {numberWithCommas(categoryAParAmount)}
	    </td>
	    <td className="text-end">
              {numberWithCommas(categoryBParAmount)}
	    </td>
	    <td className="text-end">
              {numberWithCommas(categoryCParAmount)}
	    </td>
          </tr>
        );
      }
    }

    rows.push(
      <tr key={"grand-total"}>
        <th>
        </th>
        <th colSpan="4">
          GRAND TOTAL ({x}) 
        </th>
        <th className="text-end">{numberWithCommas(totalPrincipalBalance)}</th>
	<th className="text-end">{numberWithCommas(totalInterestBalance)}</th>
	<th className="text-end">
          {numberWithCommas(totalPastDue)}
        </th>
	<th className="text-end">
	  <strong>
           {numberWithCommas(totalCategoryAParAmount)}
           <br/>
 	  </strong>
	</th>	
	<th className="text-end">
	  <strong>
           {numberWithCommas(totalCategoryBParAmount)}
           <br/>
 	  </strong>
	</th>	
	<th className="text-end">
	  <strong>
           {numberWithCommas(totalCategoryCParAmount)}
           <br/>
 	  </strong>
	</th>			
       </tr>
    );

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
      centerId: this.state.currentCenterId,
      loanProductId: event.target.value,
      officerId: this.state.currentOfficerId
    });
  }

  handleOfficerChanged(event) {
    this.fetch({
      centerId: this.state.currentCenterId,
      loanProductId: this.state.currentLoanProductId,
      officerId: event.target.value
    });
  }

  renderFilter() {
    var centerOptions   = [
       <option key={"center-select"} value="">
        -- SELECT --
      </option>
    ];

    for(var i = 0; i < this.state.centers.length; i++) {
      centerOptions.push(
        <option key={"center-" + i} value={this.state.centers[i].id}>
          {this.state.centers[i].name}
        </option>
      );
    }

    var loanProductOptions  = [
      <option key={"loan-product-select"} value="">
        -- SELECT --
      </option>
    ]

    for(var i = 0; i < this.state.loan_products.length; i++) {  
      loanProductOptions.push(
        <option key={"loan-product-" + i} value={this.state.loan_products[i].id}>
          {this.state.loan_products[i].name}
        </option>
      );
    }

    var officerOptions  = [
      <option key={"loan-product-select"} value="">
        -- SELECT --
      </option>
    ]

    for(var i = 0; i < this.state.officers.length; i++) {
      officerOptions.push(
        <option key={"loan-product-" + i} value={this.state.officers[i].id}>
          {this.state.officers[i].last_name}, {this.state.officers[i].first_name}
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
            <select 
              value={this.state.currentCenterId} 
              onChange={this.handleCenterChanged.bind(this)} 
              className="form-control"
            >
              {centerOptions}
            </select>
          </div>
        </div>
        <div className="col-md-4 col-xs-12">
          <div className="form-group">
            <label>
              Loan Product:
            </label>
            <select 
              value={this.state.currentLoanProductId} 
              onChange={this.handleLoanProductChanged.bind(this)} 
              className="form-control"
            >
              {loanProductOptions}
            </select>
          </div>
        </div>
        <div className="col-md-4 col-xs-12">
          <div className="form-group">
            <label>
              Officers
            </label>
            <select 
              value={this.state.currentOfficerId} 
              onChange={this.handleOfficerChanged.bind(this)} 
              className="form-control"
            >
              {officerOptions}
            </select>
          </div>
        </div>
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
          <table className="table table-sm table-bordered table-hover">
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
                  Officer
                </th>
                <th>
                  Loan Product
                </th>
		<th className="text-end">
                  Past Due Amount - Principal
                </th>
 		<th className="text-end">
                  Past Due Amount - Interest
                </th>
 
		<th className="text-end">
                  Past Due Amount - Total
		</th>
		<th className="text-end">
                  PAR 1 - 30 days
                </th>
 		<th className="text-end">
                  PAR 31 - 365 days
		</th>
		<th className="text-end">
                  PAR 365 days onwards
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
  }
}
