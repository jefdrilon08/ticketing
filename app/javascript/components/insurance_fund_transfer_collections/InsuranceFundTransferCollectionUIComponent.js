import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import SkCubeLoading from '../SkCubeLoading';
import InsuranceFundTransferCollectionUITable from './InsuranceFundTransferCollectionUITable';
import AccountingEntryPreview from '../accounting/AccountingEntryPreview';
import AddRecord from './AddRecord';
import LoadCenter from './LoadCenter';
import {numberWithCommas} from '../utils/helpers';

export default class InsuranceFundTransferCollectionUIComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      data: false
    };
  }

  componentDidMount() {
    this.fetchInsuranceFundTransferCollectionData();
  }

  fetchInsuranceFundTransferCollectionData() {
    var context = this;

    $.ajax({
      url: "/api/v1/insurance_fund_transfer_collections/fetch",
      method: 'GET',
      data: {
        id: this.props.id
      },
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching insurance fund_transfer_collection");
      }
    });
  }

  updateData(data) {
    this.setState({
      data: data
    });
  }

  handleRemoveClicked(index) {
    alert("Not implemented for this module");
  }

  saveOrNumber() {
    var context     = this;
    var data        = context.state.data;
    var newOrNumber = data.data.or_number;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/insurance_fund_transfer_collections/update_or_number",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        or_number: newOrNumber
      },
      success: function(response) {
        context.setState({
          isSaving: false
        });
      },
      error: function(response) {
        alert("Error in updating or number");
      }
    });
  }

  modifyOrNumber(event) {
    var context     = this;
    var newOrNumber = event.target.value;
    var data        = context.state.data;

    data.data.or_number  = newOrNumber;

    context.setState({
      data: data
    });
  }

  saveParticular() {
    var context       = this;
    var data          = context.state.data;
    var newParticular = data.data.particular;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/insurance_fund_transfer_collections/update_particular",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        particular: newParticular
      },
      success: function(response) {
        context.setState({
          isSaving: false
        });
      },
      error: function(response) {
        alert("Error in updating particular");
      }
    });
  }

  modifyParticular(event) {
    var context       = this;
    var newParticular = event.target.value;
    var data          = context.state.data;

    data.data.particular = newParticular;

    context.setState({
      data: data
    });
  }

  saveReferenceNumber() {
    var context            = this;
    var data               = context.state.data;
    var newReferenceNumber = data.data.reference_number;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/insurance_fund_transfer_collections/update_reference_number",
      method: 'POST',
      data: {
        id: context.state.data.id,
        authenticity_token: context.props.authenticityToken,
        reference_number: newReferenceNumber
      },
      success: function(response) {
        context.setState({
          isSaving: false
        });
      },
      error: function(response) {
        alert("Error in updating reference number");
      }
    });
  }

  modifyReferenceNumber(event) {
    var context                 = this;
    var newReferenceNumber      = event.target.value;
    var data                    = context.state.data;

    data.data.reference_number  = newReferenceNumber;

    context.setState({
      data: data
    });
  }

  renderOrNumber() {
    var orNumber  = this.state.data.data.or_number;

    if(this.state.data.status == "pending") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <input 
              value={orNumber} 
              onChange={this.modifyOrNumber.bind(this)} 
              disabled={this.state.isSaving}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isSaving}
              onClick={this.saveOrNumber.bind(this)}
            >
              <span className="bi bi-check"/>
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return this.state.data.data.or_number;
    }
  }

  renderParticular() {
    var particular  = this.state.data.data.particular;

    if(this.state.data.status == "pending") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <input 
              value={particular} 
              onChange={this.modifyParticular.bind(this)} 
              disabled={this.state.isSaving}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isSaving}
              onClick={this.saveParticular.bind(this)}
            >
              <span className="bi bi-check"/>
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return particular;
    }
  }

  renderReferenceNumber() {
    var referenceNumber  = this.state.data.data.reference_number;

    if(this.state.data.status == "pending") {
      return  (
        <div className="row">
          <div className="col-md-10">
            <input 
              value={referenceNumber} 
              onChange={this.modifyReferenceNumber.bind(this)} 
              disabled={this.state.isSaving}
              className="form-control"
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-info btn-block"
              disabled={this.state.isSaving}
              onClick={this.saveReferenceNumber.bind(this)}
            >
              <span className="bi bi-check"/>
              Save
            </button>
          </div>
        </div>
      );
    } else {
      return this.state.data.data.reference_number;
    }
  }

  render() {
    if(this.state.isLoading) {
      return (
        <div>
          <SkCubeLoading/>
        </div>
      );
    } else {

      return (
        <div>
          <table className="table table-sm table-bordered">
            <tbody>
              <tr>
                <th>
                  Total Collected:
                </th>
                <td className="text-end">
                  <strong>
                    {numberWithCommas(this.state.data.data.total_collected)}
                  </strong>
                </td>
              </tr>
              <tr>
                <th>
                  OR Number:
                </th>
                <td className="text-end">
                  {this.renderOrNumber()}
                </td>
              </tr>
              <tr>
                <th>
                  Particular:
                </th>
                <td className="text-end">
                  {this.renderParticular()}
                </td>
              </tr>
              <tr>
                <th>
                  Reference Number:
                </th>
                <td className="text-end">
                  {this.renderReferenceNumber()}
                </td>
              </tr>
            </tbody>
          </table>
          <AddRecord
            data={this.state.data}
            authenticityToken={this.props.authenticityToken}
          />
          <LoadCenter
            authenticityToken={this.props.authenticityToken}
            centers={this.props.centers}
            data={this.state.data}
          />
          <hr/>
          <InsuranceFundTransferCollectionUITable
            id={this.props.id}
            data={this.state.data}
            updateData={this.updateData.bind(this)}
            authenticityToken={this.props.authenticityToken}
          />
          <hr/>
        </div>
      );
    }
  }
}
