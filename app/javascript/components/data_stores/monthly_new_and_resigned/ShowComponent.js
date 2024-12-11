import React, { useState, useEffect } from "react";
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import Button from 'react-bootstrap/Button';


import SkCubeLoading from '../../SkCubeLoading';
import ErrorDisplay from '../../ErrorDisplay';
import {numberWithCommas} from '../../utils/helpers';
import Modal from 'react-bootstrap/Modal';
import jwtDecode from "jwt-decode";
import axios from 'axios';

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
      currentOfficerId: "",
      isModalResolutionOpen: false,
      resolutionValue: ''
      
    
  }
  this.handleAddResolution = this.handleAddResolution.bind(this);
  this.handleConfirmResolution = this.handleConfirmResolution.bind(this);
  
}
handleConfirmResolution(){
  var context = this;
  var reso = this.state.resolutionValue;
  
  if (!reso.trim()) {
    alert("Resolution number cannot be empty!");
    return;
  }
  $.ajax({
    url: "/api/v1/data_stores/monthly_new_and_resigned/resolution_update",
    data: {
      id: context.props.id,
      authenticity_token: context.props.authenticityToken,
      reso: reso
    },
    method: 'POST',

    success: function(response) {
      if (response) {
        console.log(response);
        alert("Resolution number successfully added!");
        window.location.reload();
      }
    },
    
    error: function(response) {
      console.log(response);
      alert("Something went wrong when fetching data store");
    }
    
  });
  this.setState({ isModalResolutionOpen: false });
}


  handleAddResolution() {
    this.setState({ isModalResolutionOpen: true });
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

      url: "/api/v1/data_stores/monthly_new_and_resigned/fetch",
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
      url: "/api/v1/data_stores/monthly_new_and_resigned/fetch",
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
      <>
        <Modal show={this.state.isModalResolutionOpen} onHide={() => this.setState({ isModalResolutionOpen: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Add Resolution</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="form-group">
                <label>Add Resolution:</label>
                <input type="text" className="form-control" placeholder="Enter resolution here" value={this.state.resolutionValue} onChange={(e) => this.setState({ resolutionValue: e.target.value })}/>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ isModalResolutionOpen: false })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleConfirmResolution}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
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
        <div className="row">
          <div className="col">
            <div className="form-group">
              <button onClick={this.handleAddResolution} className="btn btn-primary">Add Resolution</button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  renderNewMembers() {
    var rows  = [];
    var new_members = this.state.data.data.records.new_members;

    for(var i = 0; i < new_members.length; i++) {
      rows.push(
        <tr key={"new_members-item-" + i}>
          <td>
            <a href={"/members/" + new_members[i].id+"/display"} target='_blank'>
            {new_members[i].last_name + ", " + new_members[i].first_name + " " + new_members[i].middle_name} </a>
          </td>
          <td>
            {new_members[i].membership_date}
          </td>
          <td className="text-muted">
            {new_members[i].center.name}
          </td>
           <td className="text-muted">
            {new_members[i].officer.last_name + ", "+new_members[i].officer.first_name}
          </td>
        </tr>
      );
    }
    return rows;
  }

  renderResignedMembers() {
    var rows  = [];
    var resigned_members = this.state.data.data.records.resigned_members;

    for(var x = 0; x < resigned_members.length; x++) {
      rows.push(
        <tr key={"resigned_members-item-" + x}>
          <td>
            <a href={"/members/" + resigned_members[x].id+"/display"} target='_blank'>
            {resigned_members[x].last_name + ", " + resigned_members[x].first_name + " " + resigned_members[x].middle_name}</a>
          </td>
          <td>
            {resigned_members[x].date_resigned}
          </td>
          <td className="text-muted">
            {resigned_members[x].center.name}
          </td>
           <td className="text-muted">
            {resigned_members[x].officer.last_name + ", "+resigned_members[x].officer.first_name}
          </td>
        </tr>
      );
    }

    return rows;
  }


  renderNewMemberHeaders() {
    var headers = [];
    headers.push(
      <th key="member-header">
        Member
      </th>
    );
    headers.push(
      <th key="membership-header">
        Membership Date
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

renderResingedMemberHeaders() {
    var headers = [];
    headers.push(
      <th key="member-header">
        Member
      </th>
    );
    headers.push(
      <th key="membership-header">
       Date Resigned
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
       var reso_number = this.state.data.data.resolution_number;
      return  (
        <div>
          {this.renderFilter()}
          <h4> New Members <small className="text-muted"> Total {total_new_members} </small> </h4> <h4 className="text-muted"> Resolution number {reso_number} </h4> 
          <table className="table table-sm table-bordered table-hover">
            <thead>
            <tr>
             {this.renderNewMemberHeaders()}
            </tr>
            </thead>
            <tbody>
               {this.renderNewMembers()}
            </tbody>
            <tfoot>
            </tfoot>
          </table>
          <h4> Resigned Members <small className="text-muted"> Total {total_resigned_members} </small> </h4>
          <table className="table table-sm table-bordered table-hover">
            <thead>
            <tr>
             {this.renderResingedMemberHeaders()}
            </tr>
            </thead>
            <tbody>
                {this.renderResignedMembers()}
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
      );
    }
  }
}
