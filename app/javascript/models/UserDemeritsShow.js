import Mustache from "mustache";
import $ from "jquery";

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $message;
var templateErrorList;

var _options;
var _id;
var _authenticityToken;

var _urlApprove = "/api/v1/administration/user_demerits/approve";

var _cacheDom = function() {
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  $modalApprove       = $("#modal-approve");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnApprove.on("click", function() {
    $modalApprove.show();
  });

  $btnConfirmApprove.on("click", function() {
    $message.html("Loading...");

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken
    };

    $btnConfirmApprove.prop("disabled", true);

    $.ajax({
      url: _urlApprove,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");

        window.location.reload();
      },
      error: function(response) {
        var errors  = ["Something went wrong"];

        try {
          errors  = JSON.parse(response.responseText).errors;
          console.log(response);
        } catch(e) {
          console.log(response);
        } finally {
          $btnConfirmApprove.prop("disabled", false);

          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );
        }
      }
    });
  });
};

var init  = function(options) {
  _options            = options; 
  _id                 = options.id
  _authenticityToken  = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
