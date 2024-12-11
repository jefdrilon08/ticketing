import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;
var _id;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnDelete;
var $btnConfirmDelete;
var $modalDelete;
var $message;

var templateErrorList;

var currentMember           = "";
var currentMemberAccountId  = "";
var currentAccountSubtype   = "";
var currentAccountingCodeId = "";
var currentPostType         = "";

var _urlApprove                         = "/api/v1/adjustments/batch_moratorium_adjustments/approve";
var _urlDelete                          = "/api/v1/adjustments/batch_moratorium_adjustments/destroy";

var _cacheDom = function() {
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $modalDelete = new bootstrap.Modal(
    document.getElementById("modal-delete")
  );

  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");

  $btnDelete         = $("#btn-delete");
  $btnConfirmDelete  = $("#btn-confirm-delete");

  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnApprove.on("click", function() {
    $message.html("");
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

  $btnDelete.on("click", function() {
    $modalDelete.show();
    $message.html("");
  });
  
  $btnConfirmDelete.on("click", function() {
    $message.html("Loading...");

    $btnConfirmDelete.prop("disabled", true);

    $.ajax({
      url: _urlDelete,
      method: 'POST',
      data: {
        authenticity_token: _authenticityToken,
        id: _id
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.href="/adjustments/batch_moratorium_adjustments/";
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

          $btnConfirmDelete.prop("disabled", false);
        }
      }
    });
  });
};

var init  = function(options) {
  _authenticityToken  = options.authenticityToken; 
  _id                 = options.id;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
