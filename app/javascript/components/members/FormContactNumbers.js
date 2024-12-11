import React from "react";

export default class FormContactNumbers extends React.Component {
  constructor(props) {
    super(props);
  }

  handleHomeNumberChanged(event) {
    var data          = this.props.data;
    data.home_number  = event.target.value;

    this.props.updateData(data);
  }

  handleMobileNumberChanged(event) {
    var data            = this.props.data;
    data.mobile_number  = event.target.value;

    this.props.updateData(data);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>
                Cellphone Number
              </label>
              <input
                value={this.props.data.mobile_number}
                className="form-control"
                onChange={this.handleMobileNumberChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>
                Landline Number
              </label>
              <input
                value={this.props.data.home_number}
                className="form-control"
                onChange={this.handleHomeNumberChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
