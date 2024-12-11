import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import ShowDisplay from "./ShowDisplay";

var $parameters       = $("#parameters");
var authenticityToken = $("meta[name='csrf-token']").attr('content');
var id                = $parameters.data("id");

ReactDOM.render(
  <ShowDisplay
    authenticityToken={authenticityToken}
    id={id}
  />,
  document.getElementById('content')
);
