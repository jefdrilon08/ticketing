import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var authenticityToken;
var id;

var $message;

var templateErrorList;

var _urlApprove = "/api/v1/data_stores/year_end_closings/approve";

var init  = function(options) {
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  $modalApprove       = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnApprove.on("click", function() {
    $modalApprove.show();
  });

  $btnConfirmApprove.on("click", function() {
    $btnConfirmApprove.prop("disabled", true);

    $message.html(
      "Loading..."
    );

    $.ajax({
      url: _urlApprove,
      method: 'POST',
      data: {
        authenticity_token: authenticityToken,
        id: id
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"]
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmApprove.prop("disabled", false);
        }
      }
    });
  });
};

export default { init: init };
