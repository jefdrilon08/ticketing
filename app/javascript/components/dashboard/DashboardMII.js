import React from 'react';
import $ from 'jquery';
import Select from 'react-select';
import Modal from 'react-modal';

import SkCubeLoading from '../SkCubeLoading';
import {numberAsPercent, numberWithCommas} from '../utils/helpers';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    height                : '50%',
    overlfow              : 'scroll'
  }
};

//Modal.setAppElement('#dashboard-content');

export default class DashboardMII extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      currentBranch: {
        id: "",
        name: ""
      },
      branches: [],
      data: {
      },
      currentMemberList: [],
      isLoading: true,
      modalCycleCountSummaryIsOpen: false
    }
  }

  componentDidMount() {
    var context = this;
    $.ajax({
      url: '/api/v1/dashboard_mii',
      success: function(response) {
        var currentBranch = {
          id: "",
          name: "",
          centers: []
        };

        if(response.branches.length > 0) {
          currentBranch = response.branches[0]; 
        }

        context.setState({
          branches: response.branches,
          currentBranch: currentBranch,
          data: {
            member_counts: response.member_counts
          },
          isLoading: false
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching branches!");
      }
    });
  }

  handleBranchChanged(o) {
    var currentBranch = this.state.currentBranch;

    for(var i = 0; i < this.state.branches.length; i++) {
      if(this.state.branches[i].id == o.value) {
        currentBranch = this.state.branches[i];
      }
    }

    this.setState({
      currentBranch: currentBranch
    });
  }

  handleSyncClicked() {
    var context       = this;
    var currentBranch = this.state.currentBranch;

    context.setState({
      isLoading: true
    });

    $.ajax({
      url: '/api/v1/dashboard_mii',
      method: 'GET',
      data: {
        branch_id: currentBranch.id
      },
      success: function(response) {
        context.setState({
          data: {
            member_counts: response.member_counts
          },
          isLoading: false
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching data!");
      }
    });
  }

  renderControls() {
    var state = this.state;

    var branch  = {
      value: state.currentBranch.id,
      label: state.currentBranch.name
    };

    var branchOptions = []

    for(var i = 0; i < this.state.branches.length; i++) {
      branchOptions.push({
        value: this.state.branches[i].id,
        label: this.state.branches[i].name
      });
    }

    return  (
      <div className="row">
        <div className="col-md-10">
          <div className="form-group">
            <label>
              Branch
            </label>
            <Select
              options={branchOptions}
              onChange={this.handleBranchChanged.bind(this)}
              value={branch}
              disabled={this.state.isLoading}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>
              Actions
            </label>
            <br/>
            <button
              className="btn btn-primary btn-block"
              onClick={this.handleSyncClicked.bind(this)}
              disabled={this.state.isLoading}
            >
              <span className="fa fa-sync"/>
              Sync
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderMemberTypeCounts(memberTypeCounts) {
    return (
      <div className="row">
        {
          memberTypeCounts.map((o) => (
              <div className='col' key={"mem-type-" + o.member_type}>
                <label>{o.member_type}:&nbsp;</label>
                <span className="text-muted">
                  {o.count}
                </span>
              </div>
            )
          )
        }
      </div>
    );
  }

  renderMemberCounts() {
    var o = this.state.data.member_counts;

    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else if(!o) {
      return  (
        <p>
          No data found for member counts MII.
        </p>
      );
    } else {
      return  (
        <div>
          <h5>
            <a href={"/data_stores/member_counts/" + o.id} target='_blank'>
              Member Counts as of {o.meta.as_of}
            </a>
          </h5>
          {this.renderMemberTypeCounts(o.data.member_type_counts)}
          <table className="table table-bordered table-sm table-hover">
            <thead>
              <tr style={{backgroundColor: "#797979", color: "#fff"}}>
                <th>
                </th>
                <th className="text-center">
                  Male
                </th>
                <th className="text-center">
                  Female
                </th>
                <th className="text-center">
                  Others
                </th>
                <th className="text-center">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  Active Members
                </th>
                <td className="text-center">
                  {o.data.counts.active_members.male}
                </td>
                <td className="text-center">
                  {o.data.counts.active_members.female}
                </td>
                <td className="text-center">
                  {o.data.counts.active_members.others}
                </td>
                <td className="text-center">
                  {o.data.counts.active_members.total}
                </td>
              </tr>
              <tr>
                <th>
                  GRAND TOTAL
                </th>
                <th className="text-center">
                  {o.data.counts.active_members.male}
                </th>
                <th className="text-center">
                  {o.data.counts.active_members.female}
                </th>
                <th className="text-center">
                  {o.data.counts.active_members.others}
                </th>
                <th className="text-center">
                  {o.data.counts.active_members.total}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  render() {
    return  (
      <div>
        {this.renderControls()} 
        {this.renderMemberCounts()}
      </div>
    );
  }
}

