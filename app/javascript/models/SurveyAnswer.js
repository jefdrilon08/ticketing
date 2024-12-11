import Mustache from "mustache";
import $ from "jquery";

var $modalDeleteSurveyAnswer;
var $btnDeleteSurveyAnswer;
var $btnConfirmDeleteSurveyAnswer;
var $message;

var templateErrorList;

var _urlDeleteSurveyAnswer  = "/api/v1/members/delete_survey_answer";
var _id;
var _memberId;
var _authenticityToken;

var _cacheDom = function() {
  $modalDeleteSurveyAnswer      = $("#modal-delete-survey-answer");
  $btnDeleteSurveyAnswer        = $("#btn-delete-survey-answer");
  $btnConfirmDeleteSurveyAnswer = $("#btn-confirm-delete-survey-answer");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnDeleteSurveyAnswer.on("click", function() {
    $message.html("");
    $modalDeleteSurveyAnswer.show();
  });

  $btnConfirmDeleteSurveyAnswer.on("click", function() {
    $message.html("");

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken
    }

    $btnConfirmDeleteSurveyAnswer.prop("disabled", true);

    $.ajax({
      url: _urlDeleteSurveyAnswer,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/members/" + _memberId + "/display";
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmDeleteSurveyAnswer.prop("disabled", false);
        }
      }
    });
  });
}

var init  = function(options) {
  _id                 = options.id;
  _memberId           = options.memberId;
  _authenticityToken  = options.authenticityToken
  _cacheDom();
  _bindEvents();
}

export default { init: init };
