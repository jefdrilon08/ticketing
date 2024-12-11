import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

import SkCubeLoading from '../SkCubeLoading';
import ErrorDisplay from '../ErrorDisplay';
import {numberWithCommas} from '../utils/helpers';

export default class ShowComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false,
      errors: false
    };
  }

  fetch(options) {
    var context = this;
    var data = {
      id: this.props.id
    }

    $.ajax({
      url: "/api/v1/transfer_savings/fetch",
      data: data,
      method: "GET",

      success: function(response){
        alert(response);
        context.setState({
          isLoading: false,
          data: response
        });

      },
      error: function(response){
        alert("Something went wrong");
      }
    });
  }

  componentDidMount() {
    var context = this;
    $.ajax({
      url: "/api/v1/transfer_savings/fetch",
      data: {id: context.props.id},
      method: "GET",

      success: function(response){
        console.log(response);
        context.setState({
          isLoading: false,
          data: response
        });

      },
      error: function(response){
        alert("Something went wrong");
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

  renderMembersData(){
      var rows  = [];
      var member_data = this.state.data.data.member_records;
      console.log(member_data);
      for(var i = 0; i < member_data.length; i++) {
        rows.push(
          <tr key={"member_data-item-" + i}>
          <td>
              {[i+1]}
            </td>
            <td>
              <a href={"/members/" + member_data[i].member_id+"/display"} target='_blank'>
              {member_data[i].member_name} </a>
            </td>
            <td>
              {member_data[i].member_status}
            </td>
            <td className="text-muted">
              {member_data[i].center.center_name}
            </td>
             <td className="text-muted text-end">
              {member_data[i].psa_balance}
            </td>
          </tr>
         
        );
      }
      return rows;
  }
 renderHeader() {
    var headers = [];
    headers.push(
      <th key="index">
        
      </th>
    );
    headers.push(
      <th key="member-header">
        Member
      </th>
    );
    headers.push(
      <th key="membership-header">
        Member Status
      </th>
    );
    headers.push(
      <th key="center-header">
       Center
      </th>
    );
    headers.push(
      <th key="officer-header">
        Personal Savings Account Balance
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
         
          <table className="table table-sm table-bordered table-hover">
            <thead>
            <tr>
              {this.renderHeader()}
            </tr>
            </thead>
            <tbody>
              {this.renderMembersData()}
              <tr> 
                <th colSpan="4">
                  Total
                </th>
                 <th className="text-end">
                  {numberWithCommas(this.state.data.data.total_psa)}
                </th>
              </tr>
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
      );
    }
  }
}
