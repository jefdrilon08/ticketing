import React from 'react';
import $ from 'jquery';

import SkCubeLoading from '../../SkCubeLoading';
import ErrorDisplay from '../../ErrorDisplay';

import Modal from 'react-modal';

import ResignationDisplay from './ResignationDisplay';

const customStyles  = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

export default class ShowComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      modalIsOpen: false,
      members: [],
      isLoading: true,
      data: false,
      meta: false,
      errors: false
    };
  }

  componentDidMount() {
    var context = this;

    var data  = {
      id: this.props.id
    }

    $.ajax({
      url: "/api/v1/data_stores/branch_resignations/fetch",
      data: data,
      method: 'GET',
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response.data,
          meta: response.meta
        });
      },
      error: function(response) {
        alert("Something went wrong when fetching data store");
      }
    });
  }

  handleCloseClicked() {
    this.setState({
      modalIsOpen: false,
      members: []
    });
  }

  handleDetailsClicked(members) {
    console.log(members);
    this.setState({
      modalIsOpen: true,
      members: members
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

  renderMembers() {
    var members = this.state.members;
    var rows    = [];

    for(var i = 0; i < members.length; i++) {
      rows.push(
        <tr key={"member-" + members[i].id}>
          <td>
            {i + 1}
          </td>
          <td>
            <a href={"/members/" + members[i].id + "/display"}>
              {members[i].identification_number}
            </a>
          </td>
          <td>
            <a href={"/members/" + members[i].id + "/display"}>
              {members[i].last_name}, {members[i].first_name}
            </a>
          </td>
        </tr>
      );
    }

    if(members.length > 0) {
      return (
        <div style={{ overflowY: "scroll", maxHeight: "500px" }}>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th>
                </th>
                <th>
                  Identification Number
                </th>
                <th>
                  Member
                </th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <p>
          No members found.
        </p>
      );
    }
  }

  renderRecords() {
    var data    = this.state.data;
    var records = [];

    for(var i = 0; i < data.records.length; i++) {
      records.push(
        <ResignationDisplay 
          index={i}
          key={"category-" + i}
          data={data.records[i]}
          handleDetailsClicked={this.handleDetailsClicked.bind(this)}
        />
      );
    }

    return records;
  };

  render() {
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
      return  (
        <div>
          <Modal 
            isOpen={this.state.modalIsOpen}
            style={customStyles}
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <h5>
                    Members
                  </h5>
                  {this.renderMembers()}
                  <hr/>
                  <button
                    onClick={this.handleCloseClicked.bind(this)}
                    className="btn btn-danger"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <h2>
            {this.state.meta.branch_name} Resignations 
          </h2>
          <small className="text-muted">
            {this.state.meta.start_date} to {this.state.meta.end_date}
          </small>
          {this.renderRecords()}
        </div>
      );
    }
  }
}
