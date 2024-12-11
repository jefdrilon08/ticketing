import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import FormResignationComponent from "./FormResignationComponent";

var authenticityToken       = $("meta[name='csrf-token']").attr('content');
var $parameters             = $("#parameters");
var memberResignationTypes  = $parameters.data("member-resignation-types")
var id                      = $parameters.data("id");

ReactDOM.render(
  <FormResignationComponent
    authenticityToken={authenticityToken}
    memberResignationTypes={memberResignationTypes}
    id={id}
  />,
  document.getElementById('content')
);
