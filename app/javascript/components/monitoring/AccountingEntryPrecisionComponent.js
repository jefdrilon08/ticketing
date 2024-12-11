import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import SkCubeLoading from '../SkCubeLoading';
import {numberWithCommas} from '../utils/helpers';

export default class AccountingEntryPrecisionComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: false,
      data: false,
      branches: props.branches,
      currentBranchId: "",
      startDate: "",
      endDate: ""
    };
  }

  componentDidMount() {
    if(this.state.branches.length > 0) {
      this.setState({
        currentBranchId: this.state.branches[0].id
      });
    }
  }

  handleBranchChanged(event) {
    this.setState({
      currentBranchId: event.target.value
    });
  }

  handleStartDateChanged(event) {
    this.setState({
      startDate: event.target.value
    });
  }

  handleEndDateChanged(event) {
    this.setState({
      endDate: event.target.value
    });
  }

  handleGenerateClicked() {
    var context = this;

    var params  = {
      branch_id: this.state.currentBranchId,
      start_date: this.state.startDate,
      end_date: this.state.endDate
    }

    this.setState({
      isLoading: true,
      data: false
    });

    $.ajax({
      url: "/api/v1/monitoring/accounting_entry_precision",
      data: params,
      method: 'GET',
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response
        });
      },
      error: function(response) {
        alert("Error in fetching monitoring report...");
        context.setState({
          isLoading: false,
          data: false
        });
      }
    });
  }

  renderRows() {
    var rows            = [];
    var journalEntries  = this.state.data.journal_entries;

    for(var i = 0; i < journalEntries.length; i++) {
      rows.push(
        <tr key={"je-" + i}>
          <td>
            <strong>
              <a href={"/accounting/accounting_entries/" + journalEntries[i].accounting_entry.id}>
                {journalEntries[i].accounting_code.code} - {journalEntries[i].accounting_code.name}
              </a>
            </strong>
          </td>
          <td>
            {journalEntries[i].accounting_entry.particular}
          </td>
          <td>
            {journalEntries[i].accounting_entry.date_posted}
          </td>
          <td className="text-end">
            {journalEntries[i].amount}
          </td>
        </tr>
      );
    }

    return rows;
  }

  renderResult() {
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else if(this.state.data) {
      if(this.state.data.journal_entries.length > 0) {
        return  (
          <div>
            <h5>
              Journal Entries (this.state.data.journal_entries.length)
            </h5>
            <table className="table table-bordered table-hover table-sm">
              <thead>
                <tr>
                  <th>
                    Accounting Entry
                  </th>
                  <th>
                    Particular
                  </th>
                  <th>
                    Date Posted
                  </th>
                  <th className="text-end">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.renderRows()}
              </tbody>
            </table>
          </div>
        );
      } else {
        return  (
          <p>
            No records found. All ok.
          </p>
        );
      }
    } else {
      return  (
        <p>
          No data found.
        </p>
      );
    }
  }

  renderBranchOptions() {
    var options   = [];
    var branches  = this.state.branches;

    for(var i = 0; i < branches.length; i++) {
      options.push(
        <option value={branches[i].id} key={"branch-" + i}>
          {branches[i].name}
        </option>
      );
    }

    return options;
  }

  renderFilter() {
    return  (
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label>
              <strong>
                Branch:
              </strong>
            </label>
            <select
              value={this.state.currentBranchId}
              className="form-control"
              onChange={this.handleBranchChanged.bind(this)}
              disabled={this.state.isLoading}
            >
              {this.renderBranchOptions()}
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>
              Start Date
            </label>
            <input
              type="date"
              value={this.state.start_date}
              onChange={this.handleStartDateChanged.bind(this)}
              className="form-control"
              disabled={this.state.isLoading}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>
              End Date
            </label>
            <input
              type="date"
              value={this.state.end_date}
              onChange={this.handleEndDateChanged.bind(this)}
              className="form-control"
              disabled={this.state.isLoading}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>
              <strong>
                Actions:
              </strong>
            </label>
            <button
              className="btn btn-info btn-block"
              onClick={this.handleGenerateClicked.bind(this)}
              disabled={this.state.isLoading}
            >
              <span className="fa fa-sync"/>
              Generate
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return  (
      <div>
        {this.renderFilter()}
        <hr/>
        {this.renderResult()}
      </div>
    );
  }
}
