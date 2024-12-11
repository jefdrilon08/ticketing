import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import EquityWithdrawalCollectionUIDisplay from "./EquityWithdrawalCollectionUIDisplay";

var authenticityToken = $("meta[name='csrf-token']").attr('content');
var id                = $("#parameters").data("id");

ReactDOM.render(
  <EquityWithdrawalCollectionUIDisplay
    authenticityToken={authenticityToken}
    id={id}
  />,
  document.getElementById('equity-withdrawal-collection-content')
);
