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
      currentOfficerId: ""
    };
  }

  fetch(options) {

    var context       = this;
    var centerId      = options.centerId;
    var officerId     = options.officerId;

    var data  = {
      id: this.props.id,
      center_id: centerId,
      officer_id: officerId
    }
    
    this.setState({
      currentCenterId: centerId,
      currentOfficerId: officerId
    });

    $.ajax({

      url: "/api/v1/data_stores/members_in_good_standing/fetch",
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
      url: "/api/v1/data_stores/members_in_good_standing/fetch",
      data: {
        id: context.props.id
      },

      method: 'GET',

      success: function(response) {
        console.log(response);
        var centers       = response.data.centers;
        var officers      = response.data.officers;

        context.setState({
          isLoading: false,
          data: response,
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

  handleCenterChanged(event) {
    this.fetch({
      centerId: event.target.value,
      officerId: this.state.currentOfficerId
    });
  }

  

  handleOfficerChanged(event) {
    this.fetch({
      centerId: this.state.currentCenterId,
      officerId: event.target.value
    });
  }

  renderFilter() {
    
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

    for(var i = 0; i < this.state.officers.length; i++) {
      officerOptions.push(
        <option key={"officer-" + i} value={this.state.officers[i].id}>
          {this.state.officers[i].last_name}, {this.state.officers[i].first_name}
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
renderMembersData(){
    var rows  = [];
    var member_data = this.state.data.data.records;

    for(var i = 0; i < member_data.length; i++) {
      rows.push(
        <tr key={"member_data-item-" + i}>
        <td>
            {[i+1]}
          </td>
          <td>
            <a href={"/members/" + member_data[i].id+"/display"} target='_blank'>
            {member_data[i].last_name + ", " + member_data[i].first_name + " " + member_data[i].middle_name} </a>
          </td>
          <td>
            {member_data[i].identification_number}
          </td>
          <td className="text-muted">
            {member_data[i].center.name}
          </td>
           <td className="text-muted">
            {member_data[i].officer.last_name + ", "+member_data[i].officer.first_name}
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
        Identification Number
      </th>
    );
    headers.push(
      <th key="center-header">
       Center
      </th>
    );
    headers.push(
      <th key="officer-header">
        Officer
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
       var total_new_members = this.state.data.data.num_new;
       var total_resigned_members = this.state.data.data.num_resigned;
      return  (
        <div>
          {this.renderFilter()}
          <table className="table table-sm table-bordered table-hover">
            <thead>
            <tr>
              {this.renderHeader()}
            </tr>
            </thead>
            <tbody>
             {this.renderMembersData()}
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
      );
    }
  }
}
