import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import AccountingEntryDisplay from "./AccountingEntryDisplay";

var $parameters       = $("#parameters");
var authenticityToken = $("meta[name='csrf-token']").attr('content');
var id                = $parameters.data("id");
var memberId          = $parameters.data("member-id");

ReactDOM.render(
  <AccountingEntryDisplay
    authenticityToken={authenticityToken}
    id={id}
    memberId={memberId}
  />,
  document.getElementById('loan-accounting-entry-content')
);
