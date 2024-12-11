import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var options;
var insuranceFundTransferCollectionId;
var authenticityToken;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnFinalize;
var $btnConfirmFinalize;
var $modalFinalize;

var $btnRevert;
var $btnConfirmRevert;
var $modalRevert;

var $btnPrint;
var $modalPrint;

var $message;
var templateErrorList;

var _urlApprove       = "/api/v1/insurance_fund_transfer_collections/approve";
var _urlRevert        = "/api/v1/insurance_fund_transfer_collections/revert";
var _urlPrint         = "/api/v1/print/generate_file";
var _urlFinalize      = "/api/v1/insurance_fund_transfer_collections/finalize";

var _cacheDom = function() {
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $btnFinalize        = $("#btn-finalize");
  $btnConfirmFinalize = $("#btn-confirm-finalize");
  $modalFinalize = new bootstrap.Modal(
    document.getElementById("modal-finalize")
  );

  $btnRevert          = $("#btn-revert");
  $btnConfirmRevert   = $("#btn-confirm-revert");
  $modalRevert = new bootstrap.Modal(
    document.getElementById("modal-revert")
  );

  $btnPrint   = $("#btn-print");
  $modalPrint = new bootstrap.Modal(
    document.getElementById("modal-print")
  );

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnPrint.on("click", function() {
    $modalPrint.show();

    var type = "insurance_fund_transfer_collection";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + insuranceFundTransferCollectionId);
  });

  $btnFinalize.on("click", function() {
    $message.html("");
    $modalFinalize.show();
  });

   $btnRevert.on("click", function() {
    $message.html("");
    $modalRevert.show();
  });

  $btnConfirmFinalize.on("click", function() {
    $btnConfirmFinalize.prop("disabled", true);

    $.ajax({
      url: _urlFinalize,
      method: 'POST',
      dataType: 'json',
      data: {
        id: insuranceFundTransferCollectionId,
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

          $btnConfirmFinalize.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmRevert.on("click", function() {
    $message.html("Loading...");
    $btnConfirmRevert.prop("disabled", true);

    $.ajax({
      url: _urlRevert,
      method: 'POST',
      dataType: 'json',
      data: {
        id: insuranceFundTransferCollectionId,
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

          $btnConfirmRevert.prop("disabled", false);
        }
      }
    });
  });

  $btnApprove.on("click", function() {
    $message.html("");
    $modalApprove.show();
  });

  $btnConfirmApprove.on("click", function() {
    $message.html("Loading...");
    $btnConfirmApprove.prop("disabled", true);

    $.ajax({
      url: _urlApprove,
      method: 'POST',
      dataType: 'json',
      data: {
        id: insuranceFundTransferCollectionId,
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
};

var init  = function(options) {
  insuranceFundTransferCollectionId = options.id;
  authenticityToken   = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
