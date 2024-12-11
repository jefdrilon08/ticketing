import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Select from 'react-select';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

import SkCubeLoading from '../../SkCubeLoading';
import ErrorDisplay from '../../ErrorDisplay';
import {numberWithCommas} from '../../utils/helpers';

export default class ShowComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      isLoading: true,
      data: false,
      errors: false,
      centers: [],
      currentOfficerId: "",
      currentCenterId: ""
    };
  }

  componentDidMount() {
    var context = this;

    $.ajax({
      url: "/api/v1/data_stores/patronage_refund/fetch",
      method: 'GET',
      data: {
        id: this.props.id
      },
      success: function(response) {
        context.setState({
          isLoading: false,
          data: response.data
        });
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching patronage_refund");
      }
    });
  }

  renderMonths(o) {
    return  o.months.map(function(x) {
              return  <td key={o.id + '-month-' + x.month_index} className="text-end">
                        {numberWithCommas(x.amount)}
                      </td>
            });
  }

  renderRows() {
    var context = this;

    console.log(context.state.data);

    return  context.state.data.records.map(function(o, i) {
              return  <tr key={o.id}>
                        <td className="text-center">{i + 1}</td>
                        <td>
                          <a href={"/members/" + o.id + "/display"} target="_blank">
                            <strong>
                              {o.last_name}, {o.first_name} {o.middle_name}
                            </strong>
                          </a>
                        </td>
                        <td>
                          {o.identification_number}
                        </td>
                        <td>
                          {o.center.name}
                        </td>
                        {context.renderMonths(o)}
                        <td className="text-end">
                          {numberWithCommas(o.total_interest_paid_amount)} 
                        </td>
                        <td className="text-end">
                          {numberWithCommas(o.ave_interest)} 
                        </td>
                        <td className="text-end">
                          {numberWithCommas(o.patronage_interest_amount)} 
                        </td>
                        <td className="text-end">
                          {numberWithCommas(o.savings_distribute)} 
                        </td>
                        <td className="text-end">
                          {numberWithCommas(o.cbu_distribute)}
                        </td>
                      </tr>
            });
  }

  render() {
    if(this.state.isLoading) {
      return <SkCubeLoading />;
    } else {
      return  (
        <div>
          <table className="table table-sm table-bordered table-responsive">
            <thead>
              <tr>
                <th>
                </th>
                <th>
                  Member
                </th>
                <th>
                  Identification Number
                </th>
                <th>
                  Center
                </th>
                <th className="text-end">
                  Jan
                </th>
                <th className="text-end">
                  Feb
                </th>
                <th className="text-end">
                  Mar
                </th>
                <th className="text-end">
                  Apr
                </th>
                <th className="text-end">
                  May
                </th>
                <th className="text-end">
                  Jun
                </th>
                <th className="text-end">
                  Jul
                </th>
                <th className="text-end">
                  Aug
                </th>
                <th className="text-end">
                  Sep
                </th>
                <th className="text-end">
                  Oct
                </th>
                <th className="text-end">
                  Nov
                </th>
                <th className="text-end">
                  Dec
                </th>
                <th className="text-end">
                  Total Interest
                </th>
                <th className="text-end">
                  Average Interest
                </th>
                <th className="text-end">
                  Patronage Refund Interest
                </th>
                <th className="text-end">
                  Savings Distribute
                </th>
                <th className="text-end">
                  CBU Distribute
                </th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
              <tr>
                <th colSpan="18">
                  Total
                </th>
                <th className="text-end">
                  {numberWithCommas(this.state.data.patronage_interest_amount)}
                </th>
                <th className="text-end">
                  {numberWithCommas(this.state.data.total_savings_distribute)}
                </th>
                <th className="text-end">
                  {numberWithCommas(this.state.data.total_cbu_distribute)}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
}
