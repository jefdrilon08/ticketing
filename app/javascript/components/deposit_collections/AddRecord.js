import React from 'react';
import ErrorDisplay from '../ErrorDisplay';
import Select from 'react-select';
import $ from "jquery";

export default class AddRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      members: [],
      memberId: "",
      message: "Loading...",
      isLoading: true,
      errors: false
    }
  }

  componentDidMount() {
    var context = this;

    $.ajax({
      url: "/api/v1/deposit_collections/fetch_members",
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

  handleMemberChanged(o) {
    this.setState({
      memberId: o.value,
      currentMember: o
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
        url: "/api/v1/deposit_collections/add_member",
        method: 'POST',
        data: {
          authenticity_token: context.props.authenticityToken,
          member_id: context.state.memberId,
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
      var members       = this.state.members;
      var memberOptions = [];

      for(var i = 0; i < members.length; i++) {
        memberOptions.push(
          { value: members[i].id, label: members[i].name + " " + members[i].center.name }
        );
      }

      return  (
        <div>
          <h5>
            Add Transaction
          </h5>
          <div className="card">
            <div className="card-body">
              {this.renderErrorDisplay()}
              <div className="row">
                <div className="col-md-10">
                  <Select
                    value={this.state.currentMember}
                    onChange={this.handleMemberChanged.bind(this)}
                    options={memberOptions}
                  />
                  <div>
                    {this.state.message}
                  </div>
                </div>
                <div className="col-md-2">
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
      );
    } else {
      return  (
        <div>
        </div>
      );
    }
  }
}
