import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

import SkCubeLoading from '../../SkCubeLoading';
import ErrorDisplay from '../../ErrorDisplay';

import RepaymentRateDisplay from './RepaymentRateDisplay';
import ParDisplay from './ParDisplay';

export default class ShowDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false,
      errors: false,
      display: "rr"
    };
  }

  componentDidMount() {
    var context = this;

    var data  = {
      id: this.props.id
    }

    $.ajax({
      url: "/api/v1/data_stores/branch_repayment_reports/fetch",
      data: data,
      method: 'GET',
      success: function(response) {
        console.log(response);
        context.setState({
          isLoading: false,
          data: response
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

  buildOfficerOptions() {
    var officerOptions  = [];

    return officerOptions;
  }

  buildCenterOptions() {
    var centerOptions = [];

    return centerOptions;
  }

  buildOptions() {
    var loanProductOptions  = [];

    return loanProductOptions;
  }

  handleToggledRR() {
    if(this.state.display == "rr") {
      this.setState({
        display: "par"
      });
    } else {
      this.setState({
        display: "rr"
      });
    }
  }

  handleToggledPar() {
    if(this.state.display == "par") {
      this.setState({
        display: "rr"
      });
    } else {
      this.setState({
        display: "par"
      });
    }
  }

  renderDisplay() {
    if(this.state.display == "rr") {
      return  (
        <RepaymentRateDisplay
          data={this.state.data}
        />
      );
    } else if(this.state.display == "par") {
      return  (
        <ParDisplay
          data={this.state.data}
        />
      );
    } else {
      return  (
        <div>
          <p>
            Display not found
          </p>
        </div>
      );
    }
  }

  render() {
    if(this.state.isLoading) {
      return  (
        <SkCubeLoading/>
      );
    } else {
      return  (
        <div>
          <div className="row">
            <div className="col">
              <Toggle
                checked={this.state.display == "rr"}
                onChange={this.handleToggledRR.bind(this)}
                className="btn"
              />
              &nbsp;
              <label>
                Repayment Rate Display
              </label>
            </div>
            <div className="col">
              <Toggle
                checked={this.state.display == "par"}
                onChange={this.handleToggledPar.bind(this)}
                className="btn"
              />
              &nbsp;
              <label>
                PAR Display
              </label>
            </div>
          </div>
          <hr/>
          {this.renderDisplay()}
        </div>
      );
    }
  }
}
