import React from 'react';
import ErrorDisplay from '../ErrorDisplay';
import Select from 'react-select';
import $ from 'jquery';

export default class LoadCenter extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      centers: props.centers,
      message: "",
      isLoading: false,
      errors: false,
      currentCenterId: props.centers[0].id
    }
  }

  componentDidMount() {
    var context = this;
  }

  handleCenterChanged(event) {
    this.setState({
      currentCenterId: event.target.value
    });
  }

  handleClick() {
    var context = this;

    this.setState({
      errors: false,
      isLoading: true,
      message: "Loading..."
    });

    $.ajax({
      url: "/api/v1/insurance_fund_transfer_collections/load_center",
      method: 'POST',
      data: {
        authenticity_token: context.props.authenticityToken,
        center_id: context.state.currentCenterId,
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
  }

  renderCenterOptions() {
    var records = [];
    var centers = this.state.centers;

    for(var i = 0; i < centers.length; i++) {
      records.push(
        <option key={"center-" + centers[i].id} value={centers[i].id}>
          {centers[i].name}
        </option>
      );
    }

    return records;
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
            Load Center
          </h5>
          <div className="card">
            <div className="card-body">
              {this.renderErrorDisplay()}
              <div className="row">
                <div className="col-md-10">
                  <select 
                    value={this.state.currentCenterId}
                    className="form-control"
                    onChange={this.handleCenterChanged.bind(this)}
                    disabled={this.state.isLoading}
                  >
                    {this.renderCenterOptions()}
                  </select>
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
                    <span className="fa fa-upload" />
                    Load Center
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
