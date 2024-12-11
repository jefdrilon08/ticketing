import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";

import SurveyQuestionUIDisplay from "./SurveyQuestionUIDisplay";

var authenticityToken = $("meta[name='csrf-token']").attr('content');
var id                = $("#parameters").data("id");
var surveyId          = $("#parameters").data("survey-id");

ReactDOM.render(
  <SurveyQuestionUIDisplay
    authenticityToken={authenticityToken}
    id={id}
    surveyId={surveyId}
  />,
  document.getElementById('survey-question-content')
);
