import React from "react";
import Select from 'react-select';

export default class FormReferrals extends React.Component {
  constructor(props) {
    super(props);
  }

  handleReferrerChanged(o) {
    if(o) {
      this.props.updateCurrentReferrer(o);
    }
  }

  handleCoordinatorChanged(o) {
    if(o) {
      this.props.updateCurrentCoordinator(o);
    }
  }

  render() {
    var referrerOptions  = [];
    var coordinatorOptions  = [];

    for(var i = 0; i < this.props.referrers.length; i++) {
      referrerOptions.push({
        value: this.props.referrers[i].id,
        label: this.props.referrers[i].name
      });
    }

    for(var i = 0; i < this.props.coordinators.length; i++) {
      coordinatorOptions.push({
        value: this.props.coordinators[i].id,
        label: this.props.coordinators[i].name
      });
    }    

    return  (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <div className="form-group">
                <label>
                  Refer by:
                </label>
                <Select
                  value={this.props.currentReferrer}
                  options={referrerOptions}
                  onChange={this.handleReferrerChanged.bind(this)}
                  disabled={this.props.formDisabled}
                />
              </div>
            </div>
            <div className="col-md-6 col-xs-12">
              <div className="form-group">
                <label>
                  Insurance Coordinator:
                </label>
                <Select
                  value={this.props.currentCoordinator}
                  options={coordinatorOptions}
                  onChange={this.handleCoordinatorChanged.bind(this)}
                  disabled={this.props.formDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
