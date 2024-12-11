import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import MainMiiUI from "./MainMiiUI";

var $parameters       = $("#parameters");
var authenticityToken = $("meta[name='csrf-token']").attr('content');

ReactDOM.render(
  <MainMiiUI
    authenticityToken={authenticityToken}
  />,
  document.getElementById('dashboard-content')
);
