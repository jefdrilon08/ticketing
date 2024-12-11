import React from "react";

export default class FormRecruit extends React.Component {
  constructor(props) {
    super(props);
  }

  handleRecruitChanged(event) {
    var data               = this.props.data;
    data.data.recruited_by  = event.target.value ? event.target.value.toUpperCase() : "";

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
                Pangalan ng nag recruit
              </label>
              <input
                value={this.props.data.data.recruited_by}
                className="form-control"
                onChange={this.handleRecruitChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
