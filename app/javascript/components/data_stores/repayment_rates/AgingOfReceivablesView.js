import React from 'react';
import {numberWithCommas} from '../../utils/helpers';

export default AgingOfReceivablesView = (props) => {
  let {
    data
  } = props;

  const renderDataRows = () => {
    var loans   = data.records;
    var rows    = [];
    var counter = 0;

    var totalCategoryAPastDueAmount = 0.00;
    var totalCategoryAParAmount     = 0.00;

    var totalCategoryBPastDueAmount = 0.00;
    var totalCategoryBParAmount     = 0.00;

    var totalCategoryCPastDueAmount = 0.00;
    var totalCategoryCParAmount     = 0.00;

    var categoryACounter  = 0;
    var categoryBCounter  = 0;
    var categoryCCounter  = 0;

    for(var i = 0; i < loans.length; i++) {
      var member      = loans[i].member;
      var center      = loans[i].center;
      var loanProduct = loans[i].loan_product;

      var dateReleased  = loans[i].date_released;

      var categoryAPastDueAmount  = 0.00;
      var categoryAParAmount      = 0.00;

      var categoryBPastDueAmount  = 0.00;
      var categoryBParAmount      = 0.00;

      var categoryCPastDueAmount  = 0.00;
      var categoryCParAmount      = 0.00;

      var numDaysPar  = parseInt(loans[i].num_days_par);
      var par         = loans[i].par;

      //if(numDaysPar > 0) {
      if(par > 0) {
        counter++;

        if(numDaysPar >= 1 && numDaysPar <= 30) {
          categoryAPastDueAmount  = parseFloat(loans[i].principal_balance);
          categoryAParAmount      = parseFloat(loans[i].overall_principal_balance);

          totalCategoryAPastDueAmount += categoryAPastDueAmount;
          totalCategoryAParAmount     += categoryAParAmount;

          categoryACounter++;
        } else if(numDaysPar >= 31 && numDaysPar <= 365) {
          categoryBPastDueAmount  = parseFloat(loans[i].principal_balance);
          categoryBParAmount      = parseFloat(loans[i].overall_principal_balance);

          totalCategoryBPastDueAmount += categoryBPastDueAmount;
          totalCategoryBParAmount     += categoryBParAmount;

          categoryBCounter++;
        } else if(numDaysPar >= 365) {
          categoryCPastDueAmount  = parseFloat(loans[i].principal_balance);
          categoryCParAmount      = parseFloat(loans[i].overall_principal_balance);

          totalCategoryCPastDueAmount += categoryCPastDueAmount;
          totalCategoryCParAmount     += categoryCParAmount;

          categoryCCounter++;
        }

        rows.push(
          <tr key={"aor-" + loans[i].id}>
            <td className="text-center">
              {counter}
            </td>
            <td>
              <a href={"/loans/" + loans[i].id} target="_blank">
                <strong>
                  {member.last_name}, {member.first_name} {member.middle_name}
                  <br/>
                  <small className="text-muted">
                    PN: {loans[i].pn_number} Center: {center.name}
                  </small>
                </strong>
              </a>
            </td>
            <td>
              {loanProduct.name}
            </td>
            <td className="">
              {dateReleased}
            </td>
            <td className="text-end">
              {numberWithCommas(categoryAPastDueAmount)}
              <br/>
              {numberWithCommas(categoryAParAmount)}
            </td>
            <td className="text-end">
              {numberWithCommas(categoryBPastDueAmount)}
              <br/>
              {numberWithCommas(categoryBParAmount)}
            </td>
            <td className="text-end">
              {numberWithCommas(categoryCPastDueAmount)}
              <br/>
              {numberWithCommas(categoryCParAmount)}
            </td>
          </tr>
        );
      }
    }

    // TOTAL
    var totalPastDueAmount  = totalCategoryAPastDueAmount + totalCategoryBPastDueAmount + totalCategoryCPastDueAmount;
    var totalParAmount      = totalCategoryAParAmount + totalCategoryBParAmount + totalCategoryCParAmount;

    rows.push(
      <tr key={"aor-total"}>
        <td className="text-center">
        </td>
        <td colSpan="2">
          <strong>
            Grand Total
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalPastDueAmount)}
            <br/>
            {numberWithCommas(totalParAmount)}
            <br/>
            {counter}
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalCategoryAPastDueAmount)}
            <br/>
            {numberWithCommas(totalCategoryAParAmount)}
            <br/>
            {categoryACounter}
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalCategoryBPastDueAmount)}
            <br/>
            {numberWithCommas(totalCategoryBParAmount)}
            <br/>
            {categoryBCounter}
          </strong>
        </td>
        <td className="text-end">
          <strong>
            {numberWithCommas(totalCategoryCPastDueAmount)}
            <br/>
            {numberWithCommas(totalCategoryCParAmount)}
            <br/>
            {categoryCCounter}
          </strong>
        </td>
      </tr>
    );
    return rows;
  }

  return  (
    <div>
      <table className="table table-sm table-hover table-bordered" style={{fontSize: "0.8em"}}>
        <thead>
          <tr>
            <th className="text-center">
            </th>
            <th>
              Name
            </th>
            <th>
              Product
            </th>
            <th>
              Total
            </th>
            <th className="text-end">
              1-30
            </th>
            <th className="text-end">
              31-365
            </th>
            <th className="text-end">
              365 onwards
            </th>
          </tr>
        </thead>
        <tbody>
          {renderDataRows()}
        </tbody>
      </table>
    </div>
  );
}
