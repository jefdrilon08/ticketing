import React from "react";
import Select from 'react-select';

export default class Controls extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state  = {
      branches: props.branches
    }
  }

  render() {
    var branchOptions = this.state.branches.map(function(o) {
                          return  {
                            value: o.id,
                            label: o.name
                          };
                        });

    var intervalOptions = [
                            { value: "daily", label: "Daily" }
                          ]

    return  <div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label>
                      Branches:
                    </label>
                    <Select
                      options={branchOptions}
                      value={this.props.currentBranches}
                      isMulti={true}
                      onChange={this.props.handleBranchesChanged}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <label>Start Date</label>
                  <input
                    type="date"
                    onChange={this.props.handleStartDateChanged}
                    className="form-control"
                    value={this.props.startDate}
                  />
                </div>
                <div className="col-md-5">
                  <label>End Date</label>
                  <input
                    type="date"
                    onChange={this.props.handleEndDateChanged}
                    className="form-control"
                    value={this.props.endDate}
                  />
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>
                      Interval:
                    </label>
                    <Select
                      options={intervalOptions}
                      value={this.props.currentInterval}
                      onChange={this.props.handleIntervalChanged}
                    />
                  </div>
                </div>
              </div>
            </div>
  }
}
