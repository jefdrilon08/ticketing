import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import IndexDisplay from "./IndexDisplay";

var authenticityToken = $("meta[name='csrf-token']").attr('content');

ReactDOM.render(
  <IndexDisplay
    authenticityToken={authenticityToken}
  />,
  document.getElementById('content')
);
