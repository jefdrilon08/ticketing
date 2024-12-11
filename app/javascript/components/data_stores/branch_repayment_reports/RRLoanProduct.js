import React from 'react';
import {numberWithCommas, numberAsPercent} from '../../utils/helpers';

import Officer from './Officer';

export default class LoanProduct extends React.Component {
  constructor(props) {
    super(props);
  }

  renderOfficers() {
    var officers        = this.props.data.officers;
    var officerObjects  = [];

    for(var i = 0; i < officers.length; i++) {
      officerObjects.push(
        <Officer
          key={"officer-lp-" + this.props.data.loan_product.id + "-" + i}
          data={officers[i]}
        />
      );
    }

    return  officerObjects;
  }

  render() {
    var data  = this.props.data;

    return  (
      <div>
        <div className="badge bg-success">
          {data.loan_product.name}
        </div>

        {this.renderOfficers()}

        <table className="table table-bordered table-sm" style={{fontSize: "0.8em"}}>
          <tbody>
            <tr>
              <th width="10%">
                Total for {data.loan_product.name}
              </th>
              <th width="4%">
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.principal)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.principal_paid)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.overall_principal_balance)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.interest)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.interest_paid)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.overall_interest_balance)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.total_paid)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.principal_due)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.total_balance)}
              </th>
              <th className="text-end" width="7%">
                {numberWithCommas(data.total_due)}
              </th>
              <th className="text-end" width="7%">
                {numberAsPercent(data.principal_rr)}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
