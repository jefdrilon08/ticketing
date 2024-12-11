import React from "react";
import Select from 'react-select';

export default class FormApplicationHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  handleMembershipTypeChanged(o) {
    if(o) {
      this.props.updateCurrentMembershipType(o);
    }
  }

  handleMembershipArrangementChanged(o) {
    if(o) {
      this.props.updateCurrentMembershipArrangement(o);
    }
  }

  handleBranchChanged(o) {
    if(o) {
      this.props.updateCurrentBranch(o);
    }
  }

  handleCenterChanged(o) {
    if(o) {
      this.props.updateCurrentCenter(o);
    }
  }

  handleMemberTypeChanged(event) {
    this.props.updateCurrentMemberType(event.target.value);
  }

  render() {
    var branchOptions                 = [];
    var centerOptions                 = [];
    var memberTypeOptions             = [];
    var membershipArrangementOptions  = [];
    var membershipTypeOptions         = [];

    for(var i = 0; i < this.props.memberTypes.length; i++) {
      memberTypeOptions.push(
        <option key={"member-type-" + i} value={this.props.memberTypes[i]}>
          {this.props.memberTypes[i]}
        </option>
      );
    }

    for(var i = 0; i < this.props.membershipArrangements.length; i++) {
      membershipArrangementOptions.push({
        value: this.props.membershipArrangements[i].id,
        label: this.props.membershipArrangements[i].name
      });
    }

    for(var i = 0; i < this.props.membershipTypes.length; i++) {
      membershipTypeOptions.push({
        value: this.props.membershipTypes[i].id,
        label: this.props.membershipTypes[i].name
      });
    }

    for(var i = 0; i < this.props.branches.length; i++) {
      if(this.props.branches[i].id == this.props.currentBranch.value) {
        for(var j = 0; j < this.props.branches[i].centers.length; j++) {
          centerOptions.push({
            value: this.props.branches[i].centers[j].id,
            label: this.props.branches[i].centers[j].name
          });
        }
      }

      branchOptions.push({
        value: this.props.branches[i].id,
        label: this.props.branches[i].name
      });
    }

    return  (
      <div className="card">
        <div className="card-header">
          Application for Membership
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 col-xs-12">
              <div className="form-group">
                <label>Branch</label>
                <Select
                  value={this.props.currentBranch}
                  options={branchOptions}
                  onChange={this.handleBranchChanged.bind(this)}
                  disabled={this.props.formDisabled}
                />
                <br/>
              </div>
            </div>
            <div className="col-md-3 col-xs-12">
              <div className="form-group">
                <label>Center</label>
                <Select
                  value={this.props.currentCenter}
                  options={centerOptions}
                  onChange={this.handleCenterChanged.bind(this)}
                  disabled={this.props.formDisabled}
                />
                <br/>
              </div>
            </div>
            <div className="col-md-3 col-xs-12">
              <div className="form-group">
                <label>Member Type</label>
                <Select
                  value={this.props.currentMembershipType}
                  options={membershipTypeOptions}
                  onChange={this.handleMembershipTypeChanged.bind(this)}
                  disabled={this.props.formDisabled}
                />
                <br/>
              </div>
            </div>
            <div className="col-md-3 col-xs-12">
              <div className="form-group">
                <label>
                  Arrangement
                </label>
                <Select
                  value={this.props.currentMembershipArrangement}
                  options={membershipArrangementOptions}
                  onChange={this.handleMembershipArrangementChanged.bind(this)}
                  disabled={this.props.formDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
