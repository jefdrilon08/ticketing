import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

import SkCubeLoading from '../SkCubeLoading';
import ErrorDisplay from '../ErrorDisplay';
import {numberWithCommas} from '../utils/helpers';

export default class ShowComponents extends React.Component {
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
      url: "/api/v1/data_stores/share_capital_summary/fetch",
      method: 'GET',
      data: {
        id: this.props.id
      },


      success: function(response) {
        context.setState({
          isLoading: false,
          data: response.data
        });
       
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching share capital");
      }
    });
  }

  componentDidMount(){
    var context = this;
    $.ajax({
      url: "/api/v1/data_stores/share_capital_summary/fetch",
      method: 'GET',
      data: {
        id: this.props.id
      },
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response.data
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching share capital");
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
    var rows = [];
    var member_data  = this.state.data.records;
    console.log(member_data);
    for (var i = 0; i < member_data.length; i++){
    rows.push(
      <tr key={"member_data-item-" + i}>
      <td>
       {[i+1]}
       </td>
       <td>
       <a href={"/members/" + member_data[i].id+"/display"} target='_blank'>
        {member_data[i].name}</a>
       </td>
      <td className="text-muted">
        {member_data[i].center}
      </td>
      <td className="text-muted text-end">
        {member_data[i].balance}
      </td>
      </tr>
      );

    }
    return rows;
  }

  renderHeader(){
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
      <th key="center-header">
      Center
      </th>
    );
    headers.push(
      <th key="officer-header">
      Share Capital Balance
      </th>
    );
    return headers
  }

  render(){
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
      return(
        <div>

          <table className="table table-sm table-bordered table-responsive">
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
      );
    }
  }
}