import Mustache from "mustache";
import $ from "jquery";

var id;
var authenticityToken;

var $modalUpdate;
var $btnUpdate;
var $btnConfirmUpdate;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalUpdate      = $("#modal-update");
  $btnUpdate        = $("#btn-update");
  $btnConfirmUpdate = $("#btn-confirm-update");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnUpdate.on("click", function() {
    $modalUpdate.show();
    $message.html("");
  });

  $btnConfirmUpdate.on("click", function() {
    $message.html("Loading...");
    $btnConfirmUpdate.prop("disabled", true);

    var data  = {
      id: id,
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: "/api/v1/data_stores/insurance_personal_funds/queue",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/data_stores/insurance_personal_funds";
      },
      error: function(response) {
        $message.html("Something went wrong...");
        $btnConfirmUpdate.prop("disabled", false);
      }
    });
  });
}

var init  = function(config) {
  id                = config.id;
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
