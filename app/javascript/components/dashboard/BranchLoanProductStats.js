import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import BranchLoanProductStatsUI from "./BranchLoanProductStatsUI";

var authenticityToken = $("meta[name='csrf-token']").attr('content');

ReactDOM.render(
  <BranchLoanProductStatsUI
    authenticityToken={authenticityToken}
  />,
  document.getElementById('branch-loan-product-stats-content')
);
