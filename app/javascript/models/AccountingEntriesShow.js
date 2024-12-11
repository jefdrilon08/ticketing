import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnApprove;
var $btnConfirmApprove;
var $btnPrint;
var $modalApprove;
var $modalPrint;
var $message;
var $printMessage;

var $btnAdjustDatePosted;
var $btnConfirmAdjustDatePosted;
var $modalAdjustDatePosted;
var $inputAdjustDatePosted;

var templateErrorList;
var loader;

var _authenticityToken;

var accountingEntryId;

var _cacheDom = function() {
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  )
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  $btnPrint           = $("#btn-print");
  $modalPrint         = $("#modal-print");
  $message            = $(".message");
  $printMessage       = $(".print-message");

  $btnAdjustDatePosted        = $("#btn-adjust-date-posted");
  $btnConfirmAdjustDatePosted = $("#btn-confirm-adjust-date-posted");
  $modalAdjustDatePosted      = new bootstrap.Modal(
    document.getElementById("modal-adjust-date-posted")
  )
  $inputAdjustDatePosted      = $("#input-adjust-date-posted");

  templateErrorList = $("#template-error-list").html();
  loader            = $("#template-loader").html();
};

var _bindEvents = function() {
  $btnAdjustDatePosted.on("click", function() {
    accountingEntryId = $(this).data('id');
    $modalAdjustDatePosted.show();
  });

  $btnConfirmAdjustDatePosted.on("click", function() {
    var datePosted  = $inputAdjustDatePosted.val();

    $btnConfirmAdjustDatePosted.prop("disabled", true);
    $inputAdjustDatePosted.prop("disabled", true);

    $.ajax({
      url: "/api/v1/accounting_entries/modify_date_posted",
      method: 'POST',
      data: {
        id: accountingEntryId,
        date_posted: datePosted,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Success! Reloading...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).errors.full_messages;
        } catch(e) {
          errors  = ["Something went wrong"];
        }

        $message.html(
          Mustache.render(
            templateErrorList,
            { errors: errors }
          )
        );

        $btnConfirmAdjustDatePosted.prop("disabled", false);
        $inputAdjustDatePosted.prop("disabled", false);
      }
    });
  });

  $btnPrint.on("click", function() {
    var accountingEntryId = $btnPrint.data('id');

    $modalPrint.show();
    $printMessage.html(
      Mustache.render(
        loader,
        {}
      )
    );

    $modalPrint.hide();
    window.open("/print?id=" + accountingEntryId + "&type=accounting_entry");
  });

  $btnApprove.on("click", function() {
    accountingEntryId  = $(this).data("id");
    $modalApprove.show();
  });

  $btnConfirmApprove.on("click", function() {
    $btnConfirmApprove.prop("disabled", true);

    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/accounting_entries/approve",
      method: "POST",
      dataType: 'json',
      data: {
        id: accountingEntryId,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        window.location.reload();
        $message.html(
          Mustache.render(
            templateErrorList,
            { errors: errors }
          )
        );
      },
      error: function(response) {
        console.log(response);
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).errors.full_messages;
        } catch(e) {
          errors  = ["Something went wrong"];
        }

        $message.html(
          Mustache.render(
            templateErrorList,
            { errors: errors }
          )
        );

        $btnConfirmApprove.prop("disabled", false);
      }
    });
  });
};

var init  = function(config) {
  _authenticityToken  = config.authenticityToken;
  
  _cacheDom();
  _bindEvents();
};

export default { init: init };
