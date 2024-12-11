import React from 'react';
import {numberWithCommas, numberAsPercent} from '../../utils/helpers';

export default class ParOfficer extends React.Component {
  constructor(props) {
    super(props);
  }

  renderCenters() {
    var centers       = this.props.data.centers;
    var centerObjects = [];

    for(var i = 0; i < centers.length; i++) {
      for(var j = 0; j < centers[i].loans.length; j++) {
        centerObjects.push(
          <tr key={"center-" + i + "-loan-" + j}>
            <td width="10%">
              {centers[i].loans[j].member.last_name + ", " + centers[i].loans[j].member.first_name}
            </td>
            <td width="4%">
              {centers[i].loans[j].date_released}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].principal)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].principal_paid)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].principal_balance)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].interest)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].interest_paid)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].interest_balance)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].total_paid)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].principal_due)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].total_due)}
            </td>
            <td className="text-end" width="7%">
              {numberWithCommas(centers[i].loans[j].total_balance)}
            </td>
            <td className="text-end" width="7%">
              {numberAsPercent(centers[i].loans[j].principal_rr)}
            </td>
          </tr>
        );
      }

      centerObjects.push(
        <tr key={"center-" + i}>
          <th width="10%">
            {centers[i].center.name}
          </th>
          <th width="4%">
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].principal)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].principal_paid)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].principal_balance)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].interest)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].interest_paid)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].interest_balance)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].total_paid)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].principal_due)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].total_due)}
          </th>
          <th className="text-end">
            {numberWithCommas(centers[i].total_balance)}
          </th>
          <th className="text-end">
            {numberAsPercent(centers[i].principal_rr)}
          </th>
        </tr>
      );
    }

    return centerObjects;
  }

  renderHeaders() {
    var parBinHeaders = this.props.parBinHeaders;
    console.log(parBinHeaders);

    var headers = [];

    for(var i = 0; i < parBinHeaders.length; i++) {
      if(i != (parBinHeaders.length - 1)) {
        headers.push(
          <th key={"h-" + i} className="text-center">
            {"" + parBinHeaders[i].min_days + "-" + parBinHeaders[i].max_days}
          </th>
        );
      } else {
        headers.push(
          <th key={"h-" + i} className="text-center">
            {"> " + parBinHeaders[i].min_days}
          </th>
        );
      }
    }

    return headers;
  }

  render() {
    var data      = this.props.data;
    var fullName  = data.officer.first_name + " " + data.officer.last_name;
    return  (
      <div>
        <h5>
          {fullName}
        </h5>

        <table className="table table-bordered table-sm" style={{fontSize: "0.8em"}}>
          <tbody>
            <tr>
              <th>
                Name
              </th>
              <th>
                Total
              </th>
              {this.renderHeaders()}
            </tr>
            <tr>
              <th>
                Total for {fullName}
              </th>
              <th>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
