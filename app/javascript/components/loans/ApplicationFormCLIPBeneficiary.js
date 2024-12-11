import React from "react";

export default class ApplicationFormCLIPBeneficiary extends React.Component {
  constructor(props) {
    super(props);
    
    this.state  = {
    }
  }

  handleFirstName(event) {
    var data  = this.props.data;

    data.data.clip_beneficiary.first_name = event.target.value;

    this.props.updateData(data);
  }

  handleMiddleName(event) {
    var data  = this.props.data;

    data.data.clip_beneficiary.middle_name = event.target.value;

    this.props.updateData(data);
  }

  handleLastName(event) {
    var data  = this.props.data;

    data.data.clip_beneficiary.last_name = event.target.value;

    this.props.updateData(data);
  }

  handleDateOfBirth(event) {
    var data  = this.props.data;

    data.data.clip_beneficiary.date_of_birth = event.target.value;

    this.props.updateData(data);
  }

  handleRelationship(event) {
    var data  = this.props.data;

    data.data.clip_beneficiary.relationship = event.target.value;

    this.props.updateData(data);
  }

  render() {
    var clip_beneficiary  = this.props.data.data.clip_beneficiary;

    return  (
      <div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>
                First Name
              </label>
              <input
                className="form-control"
                value={clip_beneficiary.first_name}
                onChange={this.handleFirstName.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Middle Name
              </label>
              <input
                className="form-control"
                value={clip_beneficiary.middle_name}
                onChange={this.handleMiddleName.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Last Name
              </label>
              <input
                className="form-control"
                value={clip_beneficiary.last_name}
                onChange={this.handleLastName.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>
                Date of Birth
              </label>
              <input
                className="form-control"
                type="date"
                value={clip_beneficiary.date_of_birth}
                onChange={this.handleDateOfBirth.bind(this)}
                disabled={this.props.disabled}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>
                Relationship
              </label>
              <select
                className="form-control"
                value={clip_beneficiary.relationship}
                onChange={this.handleRelationship.bind(this)}
                disabled={this.props.disabled}
              >
                <option value="">
                  -- SELECT --
                </option>
                <option value="ANAK">
                  ANAK
                </option>
                <option value="ASAWA">
                  ASAWA
                </option>
                <option value="MAGULANG">
                  MAGULANG
                </option>
                <option value="KAPATID">
                  KAPATID
                </option>
                <option value="LIVE IN / KINAKASAMA">
                  LIVE IN / KINAKASAMA
                </option>
                <option value="APO">
                  APO
                </option>
                <option value="TIYUHIN">
                  TIYUHIN
                </option>
                <option value="PAMANGKIN">
                  PAMANGKIN
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
