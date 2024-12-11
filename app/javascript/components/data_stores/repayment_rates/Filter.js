import React from 'react';
import "react-toggle/style.css";
import ToggleSwitch from '../../utils/ToggleSwitch';

export default Filter = (props) => {
  let {
    loanProducts,
    centers,
    officers,
    currentView,
    currentCenterId,
    currentOfficerId,
    currentLoanProductId,
    handleViewToggled,
    handleCenterChanged,
    handleOfficerChanged,
    handleLoanProductChanged
  } = props;

  const renderLoanProductOptions = () => {
    let options = [];

    options.push(
      <option value="" key={"loan-product-select"}>
        -- SELECT --
      </option>
    );

    loanProducts.forEach((o) => {
      options.push(
        <option key={`loan-product-${o.id}`} value={o.id}>
          {o.name}
        </option>
      );
    })

    return options;
  }

  const renderCenterOptions = () => {
    let options = [];

    options.push(
      <option value="" key={"center-select"}>
        -- SELECT --
      </option>
    );

    centers.forEach((o) => {
      options.push(
        <option value={o.id} key={`center-${o.id}`}>
          {o.name}
        </option>
      );
    })

    return options;
  }

  const renderOfficerOptions = () => {
    var options = [];

    options.push(
      <option value="" key={"officer-select"}>
        -- SELECT --
      </option>
    );

    officers.forEach((o) => {
      options.push(
        <option value={o.id} key={`officer-${o.id}`}>
          {o.last_name}, {o.first_name}
        </option>
      );
    })

    return options;
  }

  return  (
    <div className="row">
      <div className="col-md-3 col-xs-12">
        <div className="form-group">
          <div className="row">
            <div className="col">
              <ToggleSwitch
                name={`current-view-rr`}
                key={`current-view-rr`}
                checked={currentView == "RR"}
                defaultChecked={currentView == "RR"}
                onChange={() => {
                  handleViewToggled("RR")
                }}
              />
              <br/>
              <label>
                RR
              </label>
            </div>
            <div className="col">
              <ToggleSwitch
                name={`current-view-aor`}
                key={`current-view-aor`}
                checked={currentView == "AOR"}
                defaultChecked={currentView == "AOR"}
                onChange={() => {
                  handleViewToggled("AOR")
                }}
              />
              <br/>
              <label>
                AoR
              </label>
            </div>
            <div className="col">
              <ToggleSwitch
                name={`current-view-ml`}
                key={`current-view-ml`}
                checked={currentView == "ML"}
                defaultChecked={currentView == "ML"}
                onChange={() => {
                  handleViewToggled("ML")
                }}
              />
              <br/>
              <label>
                ML
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-xs-12">
        <div className="form-group">
          <label>
            Center
          </label>
          <select
            className="form-control"
            value={currentCenterId}
            onChange={handleCenterChanged}
          >
            {renderCenterOptions()}
          </select>
        </div>
      </div>
      <div className="col-md-3 col-xs-12">
        <div className="form-group">
          <label>
            Loan Products
          </label>
          <select
            className="form-control"
            value={currentLoanProductId}
            onChange={handleLoanProductChanged}
          >
            {renderLoanProductOptions()}
          </select>
        </div>
      </div>
      <div className="col-md-3 col-xs-12">
        <div className="form-group">
          <label>
            Officers
          </label>
          <select
            className="form-control"
            value={currentOfficerId}
            onChange={handleOfficerChanged}
          >
            {renderOfficerOptions()}
          </select>
        </div>
      </div>
    </div>
  );
}
