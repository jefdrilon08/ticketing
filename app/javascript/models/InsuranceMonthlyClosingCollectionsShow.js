import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnUpdate;
var $btnConfirmUpdate;
var $modalUpdate;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var id;
var templateErrorList;
var authenticityToken;

var $message;

var _cacheDom = function() {
  $btnUpdate        = $("#btn-update");
  $btnConfirmUpdate = $("#btn-confirm-update");
  $modalUpdate      = $("#modal-update");
  
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  
  $modalApprove         = new bootstrap.Modal( 
    document.getElementById("modal-approve")
  );
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnApprove.on("click", function() {
    $message.html("");
    $modalApprove.show();
  });

  $btnConfirmApprove.on("click", function() {
    $btnConfirmApprove.prop("disabled", true);
    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/insurance_monthly_closing_collections/approve",
      method: 'POST',
      data: {
        id: id,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
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

          $btnConfirmApprove.prop("disabled", false);
        }
      }
    });
  });

  $btnUpdate.on("click", function() {
    $message.html("");
    $modalUpdate.show();
  });

  $btnConfirmUpdate.on("click", function() {
    $btnConfirmUpdate.prop("disabled", true);

    $.ajax({
      url: "/api/v1/insurance_monthly_closing_collections/update",
      method: 'POST',
      data: {
        id: id,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
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

          $btnConfirmUpdate.prop("disabled", false);
        }
      }
    });
  });
};

var init  = function(options) {
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
