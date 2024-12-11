import React from 'react';
import $ from 'jquery';
import moment from 'moment';

import SkCubeLoading from '../SkCubeLoading';
import InsuranceWithdrawalCollectionUITable from './InsuranceWithdrawalCollectionUITable';
import AccountingEntryPreview from '../accounting/AccountingEntryPreview';
import AddRecord from './AddRecord';
import {numberWithCommas} from '../utils/helpers';

export default class InsuranceWithdrawalCollectionUIComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      isSaving: false,
      data: false
    };
  }

  componentDidMount() {
    this.fetchInsuranceWithdrawalCollectionData();
  }

  fetchInsuranceWithdrawalCollectionData() {
    var context = this;

    $.ajax({
      url: "/api/v1/insurance_withdrawal_collections/fetch",
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
        alert("Error in fetching insurance withdrawal_collection");
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

  saveParticular() {
    var context       = this;
    var data          = context.state.data;
    var newParticular = data.data.particular;

    context.setState({
      isSaving: true
    });

    $.ajax({
      url: "/api/v1/insurance_withdrawal_collections/update_particular",
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
                  Particular:
                </th>
                <td className="text-end">
                  {this.renderParticular()}
                </td>
              </tr>
            </tbody>
          </table>
          <AddRecord
            data={this.state.data}
            authenticityToken={this.props.authenticityToken}
          />
          <hr/>
          <InsuranceWithdrawalCollectionUITable
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
