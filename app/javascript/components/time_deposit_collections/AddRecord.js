import React from 'react';
import ErrorDisplay from '../ErrorDisplay';
import $ from "jquery";

export default class AddRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      members: [],
      memberId: "",
      lockInPeriod: 90,
      amount: 0.00,
      message: "Loading...",
      isLoading: true,
      errors: false
    }
  }

  componentDidMount() {
    var context = this;

    $.ajax({
      url: "/api/v1/time_deposit_collections/fetch_members",
      method: 'GET',
      data: {
        id: context.props.data.id
      },
      success: function(response) {
        context.setState({
          members: response.members,
          isLoading: false,
          message: ""
        });
      },
      error: function(response) {
        console.log(response);
        context.setState({
          isLoading: false,
          message: "Error!"
        });
      }
    });
  }

  handleMemberChanged(event) {
    this.setState({
      memberId: event.target.value
    });
  }

  handleAmountChanged(event) {
    this.setState({
      amount: event.target.value
    });
  }

  handleLockInPeriodChanged(event) {
    this.setState({
      lockInPeriod: event.target.value
    });
  }

  handleClick() {
    var context = this;

    this.setState({
      errors: false,
      isLoading: true,
      message: "Loading..."
    });

    if(this.state.memberId) {
      $.ajax({
        url: "/api/v1/time_deposit_collections/add_member",
        method: 'POST',
        data: {
          authenticity_token: context.props.authenticityToken,
          member_id: context.state.memberId,
          amount: context.state.amount,
          lock_in_period: context.state.lockInPeriod,
          id: context.props.data.id
        },
        success: function(response) {
          context.setState({
            errors: false,
            message: "Success! Redirecting..."
          });

          window.location.reload();
        },
        error: function(response) { 
          try {
            context.setState({
              errors: JSON.parse(response.responseText),
              isLoading: false,
              message: ""
            });
          } catch(err) {
            alert("Something went wrong");
            context.setState({
              errors: false,
              message: "Error!",
              isLoading: false
            });
          }
        }
      });
    } else {
      this.setState({
        isLoading: false,
        message: "Member not selected"
      });
    }
  }

  renderLockInPeriodOptions() {
    var records = [];

    records.push(
      <option key={"lock-in-90"} value={90}>
        90 Days / 3 Months
      </option>
    );

    records.push(
      <option key={"lock-in-180"} value={180}>
        180 Days / 6 Months
      </option>
    );

    records.push(
      <option key={"lock-in-270"} value={270}>
        270 Days / 9 Months
      </option>
    );

    records.push(
      <option key={"lock-in-360"} value={360}>
        360 Days / 12 Months
      </option>
    );

    return records;
  }

  renderOptions() {
    var records = [];
    var members = this.state.members;

    records.push(
      <option key="null">
        -- SELECT --
      </option>
    );

    for(var i = 0; i < members.length; i++) {
      records.push(
        <option key={"member-" + i} value={members[i].id}>
          {members[i].name} ({members[i].center.name})
        </option>
      );
    }

    return  records;
  }

  renderErrorDisplay() {
    if(this.state.errors) {
      return  (
        <ErrorDisplay
          errors={this.state.errors}
        />
      );
    } else {
      return  (
        <div>
        </div>
      );
    }
  }

  render() {
    if(this.props.data.status == "pending") {
      return  (
        <div>
          <h5>
            Add Transaction
          </h5>
          <div className="card">
            <div className="card-body">
              {this.renderErrorDisplay()}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Member
                    </label>
                    <select
                      className="form-control"
                      onChange={this.handleMemberChanged.bind(this)}
                      value={this.state.memberId}
                      disabled={this.state.isLoading}
                    >
                      {this.renderOptions()}
                    </select>
                    <div>
                      {this.state.message}
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>
                      Amount
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={this.state.amount}
                      onChange={this.handleAmountChanged.bind(this)}
                      disabled={this.state.isLoading}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>
                      Lock-in Period
                    </label>
                    <select
                      className="form-control"
                      onChange={this.handleLockInPeriodChanged.bind(this)}
                      value={this.state.lockInPeriod}
                      disabled={this.state.isLoading}
                    >
                      {this.renderLockInPeriodOptions()}
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>
                      Actions
                    </label>
                    <div className="form-group">
                      <div className="btn-group">
                        <button
                          className="btn btn-primary btn-block"
                          disabled={this.state.isLoading}
                          onClick={this.handleClick.bind(this)}
                        >
                          <span className="fa fa-plus" />
                          Add Transaction
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return  (
        <div>
        </div>
      );
    }
  }
}
