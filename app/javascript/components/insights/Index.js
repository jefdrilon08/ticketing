import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery"; 
import IndexComponent from "./IndexComponent";

var authenticityToken = $("meta[name='csrf-token']").attr('content');
var $parameters       = $("#parameters");
var settings          = $parameters.data('settings');
var branches          = $parameters.data('branches');
var startDate         = $parameters.data('start-date');
var endDate           = $parameters.data('end-date');

ReactDOM.render(
  <IndexComponent
    authenticityToken={authenticityToken}
    settings={settings}
    branches={branches}
    startDate={startDate}
    endDate={endDate}
  />,
  document.getElementById('content')
);
