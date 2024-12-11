import React from "react";

export default class FormNumChildren extends React.Component {
  constructor(props) {
    super(props);
  }

  handleNumChildrenChanged(event) {
    var data                = this.props.data;
    data.data.num_children  = event.target.value;

    this.props.updateData(data);
  }

  handleNumChildrenElementaryChanged(event) {
    var data                          = this.props.data;
    data.data.num_children_elementary = event.target.value;

    this.props.updateData(data);
  }

  handleNumChildrenHighSchoolChanged(event) {
    var data                            = this.props.data;
    data.data.num_children_high_school  = event.target.value;

    this.props.updateData(data);
  }

  handleNumChildrenCollegeChanged(event) {
    var data                        = this.props.data;
    data.data.num_children_college  = event.target.value;

    this.props.updateData(data);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label>
                Bilang ng Anak
              </label>
              <input
                value={this.props.data.data.num_children}
                className="form-control"
                type="number"
                onChange={this.handleNumChildrenChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>
                Ilan ang Nag-aaral (Elementary)
              </label>
              <input
                value={this.props.data.data.num_children_elementary}
                className="form-control"
                type="number"
                onChange={this.handleNumChildrenElementaryChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>
                (High School)
              </label>
              <input
                value={this.props.data.data.num_children_high_school}
                className="form-control"
                type="number"
                onChange={this.handleNumChildrenHighSchoolChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>
                (College Vocational)
              </label>
              <input
                value={this.props.data.data.num_children_college}
                className="form-control"
                type="number"
                onChange={this.handleNumChildrenCollegeChanged.bind(this)}
                disabled={this.props.formDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
