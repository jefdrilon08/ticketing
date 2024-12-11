import React from "react";

export default class FormExperience extends React.Component {
  constructor(props) {
    super(props);
  }

  handleReasonChanged(event) {
    var data                      = this.props.data;
    data.data.reason_for_joining  = event.target.value;

    this.props.updateData(data);
  }

  handleIsExperiencedChanged(event) {
    var data  = this.props.data;

    if(event.target.value == "yes") {
      data.data.is_experienced_with_microfinance  = true;
    } else {
      data.data.is_experienced_with_microfinance  = false;
    }
    this.props.updateData(data);
  }

  handlePreviousMfiExperience(event) {
    var data  = this.props.data;

    data.data.previous_mfi_experience = event.target.value.toUpperCase();

    this.props.updateData(data);
  }

  render() {
    var data  = this.props.data;

    return (
      <div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>
                Dahilan ng pagsali sa K-Coop
              </label>
              <input
                value={this.props.data.data.reason_for_joining}
                className="form-control"
                onChange={this.handleReasonChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>
                Karanasan sa Kooperatiba / MFI
              </label>
              <br/>
              <input 
                type="radio"
                value={"no"}
                checked={!data.data.is_experienced_with_microfinance}
                onChange={this.handleIsExperiencedChanged.bind(this)}
              /> 
              Wala
              <input 
                type="radio"
                value={"yes"}
                checked={data.data.is_experienced_with_microfinance}
                onChange={this.handleIsExperiencedChanged.bind(this)}
              /> 
              Meron, ano ito?
              <input
                type="text"
                className="form-control"
                value={data.data.previous_mfi_experience}
                onChange={this.handlePreviousMfiExperience.bind(this)}
                disabled={!data.data.is_experienced_with_microfinance}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
