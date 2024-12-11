import React from "react";

export default class FormSpouse extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFirstNameChanged(event) {
    var data                    = this.props.data;
    data.data.spouse.first_name = event.target.value.toUpperCase();

    this.props.updateData(data);
  }

  handleMiddleNameChanged(event) {
    var data                      = this.props.data;
    data.data.spouse.middle_name  = event.target.value.toUpperCase();

    this.props.updateData(data);
  }

  handleLastNameChanged(event) {
    var data                    = this.props.data;
    data.data.spouse.last_name  = event.target.value.toUpperCase();

    this.props.updateData(data);
  }

  handleDateOfBirthChanged(event) {
    var data                        = this.props.data;
    data.data.spouse.date_of_birth  = event.target.value;

    this.props.updateData(data);
  }

  handleOccupationChanged(event) {
    var data                    = this.props.data;
    data.data.spouse.occupation = event.target.value.toUpperCase();

    this.props.updateData(data);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>
                Pangalan
              </label>
              <input
                value={this.props.data.data.spouse.first_name}
                className="form-control"
                onChange={this.handleFirstNameChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
            <div className="form-group">
              <label>
                Gitnang Pangalan
              </label>
              <input
                value={this.props.data.data.spouse.middle_name}
                className="form-control"
                onChange={this.handleMiddleNameChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
            <div className="form-group">
              <label>
                Apelyido
              </label>
              <input
                value={this.props.data.data.spouse.last_name}
                className="form-control"
                onChange={this.handleLastNameChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>
                Kapanganakan
              </label>
              <input
                value={this.props.data.data.spouse.date_of_birth}
                className="form-control"
                onChange={this.handleDateOfBirthChanged.bind(this)}
                disabled={this.props.formDisabled}
                type="date"
              />
            </div>
            <div className="form-group">
              <label>
                Trabaho
              </label>
              <input
                value={this.props.data.data.spouse.occupation}
                className="form-control"
                onChange={this.handleOccupationChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
