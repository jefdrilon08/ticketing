import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import WithdrawalCollectionUIDisplay from "./WithdrawalCollectionUIDisplay";

var authenticityToken = $("meta[name='csrf-token']").attr('content');
var id                = $("#parameters").data("id");

ReactDOM.render(
  <WithdrawalCollectionUIDisplay
    authenticityToken={authenticityToken}
    id={id}
  />,
  document.getElementById('withdrawal-collection-content')
);
