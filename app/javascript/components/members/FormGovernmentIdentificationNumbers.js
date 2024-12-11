import React from "react";

export default class FormGovernmentIdentificationNumbers extends React.Component {
  constructor(props) {
    super(props);

    console.log("In FormGovernmentIdentificationNumbers");
    console.log(props);
  }

  handleSssNumberChanged(event) {
    var data                                                = this.props.data;
    data.data.government_identification_numbers.sss_number  = event.target.value;

    this.props.updateData(data);
  }

  handlePagIbigNumberChanged(event) {
    var data                                                    = this.props.data;
    data.data.government_identification_numbers.pag_ibig_number = event.target.value;
    
    this.props.updateData(data);
  }

  handlePhilHealthNumberChanged(event) {
    var data                                                        = this.props.data;
    data.data.government_identification_numbers.phil_health_number  = event.target.value;

    this.props.updateData(data);
  }

  handleTinNumberChanged(event) {
    var data                                                = this.props.data;
    data.data.government_identification_numbers.tin_number  = event.target.value;

    this.props.updateData(data);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label>
                SSS / GSIS #
              </label>
              <input
                value={this.props.data.data.government_identification_numbers.sss_number}
                className="form-control"
                onChange={this.handleSssNumberChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>
                Pag-ibig #
              </label>
              <input
                value={this.props.data.data.government_identification_numbers.pag_ibig_number}
                className="form-control"
                onChange={this.handlePagIbigNumberChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>
                Philhealth #
              </label>
              <input
                value={this.props.data.data.government_identification_numbers.phil_health_number}
                className="form-control"
                onChange={this.handlePhilHealthNumberChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>
                Tin #
              </label>
              <input
                value={this.props.data.data.government_identification_numbers.tin_number}
                className="form-control"
                onChange={this.handleTinNumberChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
