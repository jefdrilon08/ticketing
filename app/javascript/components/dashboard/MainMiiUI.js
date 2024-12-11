import React from 'react';
import $ from 'jquery';

import SkCubeLoading from '../SkCubeLoading';

// DASHBOARDS
import DashboardMII from './DashboardMII';
import DashboardManagementMii from './DashboardManagementMii';

export default class MainMiiUI extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isError: false,
      isLoading: true,
      roles: [],
      username: ""
    };
  }

  componentDidMount() {
    var context = this;

    $.ajax({
      url: "/api/v1/roles",
      method: 'GET',
      success: function(response) {
        context.setState({
          isLoading: false,
          roles: response.roles,
          username: response.username
        });
      },
      error: function(response) {
        console.log(response);

        context.setState({
          isError: true,
          isLoading: false,
          roles: [],
          username: ""
        });
      }
    });
  }

  renderDashboards() {
    var dashboards  = [];

    dashboards.push(
      <DashboardManagementMii
        key={"dashboard-Management-Mii"}
      />
    );

    dashboards.push(
      <DashboardMII
        key={"dashboard-MII"}
      />
    );

    return dashboards;
  }

  renderRoles() {
    var rolesDisplay  = [];

    for(var i = 0; i < this.state.roles.length; i++) {
      rolesDisplay.push(
        <span key={"role-" + i} className="badge badge-info">
          {this.state.roles[i]}
        </span>
      );
    }

    return rolesDisplay;
  }

  render() {
    var context = this;
    var state   = context.state;

    if(state.isLoading) {
      return  (
        <div>
          <SkCubeLoading/>
          <center>
            <h5>
              Initializing Dashboard
            </h5>
          </center>
        </div>
      );
    } else if(state.isError) {
      return  (
        <div>
          Dashboard ERROR
        </div>
      );
    } else {
      return  (
        <div>
          <div className="row">
            <div className="col">
              <h4>
                <span className="fa fa-user"/>
                {state.username}
              </h4>
            </div>
            <div className="col">
              <div className="text-end">
                {this.renderRoles()}
              </div>
            </div>
          </div>
          {this.renderDashboards()}
        </div>
      );
    }
  }
}
