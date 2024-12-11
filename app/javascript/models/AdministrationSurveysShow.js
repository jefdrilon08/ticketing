import Mustache from "mustache";
import $ from "jquery";

var $btnDelete;
var $btnConfirmDelete;
var $modalDelete;
var $message;

var $btnDeleteQuestion;
var $btnConfirmDeleteQuestion;
var $modalDeleteQuestion;

var id;
var authenticityToken;
var templateErrorList;

var surveyQuestionId  = -1;

var urlDelete = "/api/v1/administration/surveys/delete";

var _cacheDom = function() {
  $btnDelete        = $("#btn-delete");
  $btnConfirmDelete = $("#btn-confirm-delete");
  $modalDelete      = $("#modal-delete");

  $btnDeleteQuestion        = $(".btn-delete-question");
  $btnConfirmDeleteQuestion = $("#btn-confirm-delete-question");
  $modalDeleteQuestion      = $("#modal-delete-question");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnDeleteQuestion.on("click", function() {
    surveyQuestionId  = $(this).data("id");

    $modalDeleteQuestion.show();
    $message.html("");
  });

  $btnConfirmDeleteQuestion.on("click", function() {
    $btnConfirmDeleteQuestion.prop("disabled", true);
    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/administration/survey_questions/delete",
      method: 'POST',
      data: {
        id: surveyQuestionId,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
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

          $btnConfirmDeleteQuestion.prop("disabled", false);
        }
      }
    });
  });

  $btnDelete.on("click", function() {
    $modalDelete.show();
    $message.html("");
  });

  $btnConfirmDelete.on("click", function() {
    $btnConfirmDelete.prop("disabled", true);

    $.ajax({
      url: urlDelete,
      method: 'POST',
      data: {
        authenticity_token: authenticityToken,
        id: id
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href = "/administration/surveys";
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

          $btnConfirmDelete.prop("disabled", false);
        }
      }
    });
  });
};

var init  = function(options) {
  id                  = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
