import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var options;
var timeDepositCollectionId;
var authenticityToken;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnPrint;
var $modalPrint;

var $btnPrintThermal;

var $selectCashManagementTemplate;
var $btnConfirmBook;

var $selectBook;
var $btnConfirmCashManagementTemplate;

var $message;
var templateErrorList;

var _urlApprove                       = "/api/v1/time_deposit_collections/approve";
var _urlPrint                         = "/api/v1/print/generate_file";
var _urlModifyCashManagementTemplate  = "/api/v1/time_deposit_collections/modify_cash_management_template";
var _urlModifyBook                    = "/api/v1/time_deposit_collections/modify_book";

var _cacheDom = function() {
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $modalPrint = new bootstrap.Modal(
    document.getElementById("modal-print")
  );

  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");

  $btnPrint   = $("#btn-print");

  $btnPrintThermal = $("#btn-thermal");

  $selectBook     = $("#select-book");
  $btnConfirmBook = $("#btn-confirm-book");

  $selectCashManagementTemplate     = $("#select-cash-management-template");
  $btnConfirmCashManagementTemplate = $("#btn-confirm-cash-management-template");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnConfirmBook.on("click", function() {
    var book  = $selectBook.val();

    $message.html("Loading...");

    $selectBook.prop("disabled", true);
    $btnConfirmBook.prop("disabled", true);

    $.ajax({
      url: _urlModifyBook,
      method: 'POST',
      data: { 
        id: timeDepositCollectionId,
        book: book,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $selectBook.prop("disabled", false);
          $btnConfirmBook.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmCashManagementTemplate.on("click", function() {
    var template  = $selectCashManagementTemplate.val();

    $message.html("Loading...");

    $selectCashManagementTemplate.prop("disabled", true);
    $btnConfirmCashManagementTemplate.prop("disabled", true);

    $.ajax({
      url: _urlModifyCashManagementTemplate,
      method: 'POST',
      data: { 
        id: timeDepositCollectionId,
        template: template,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $selectCashManagementTemplate.prop("disabled", false);
          $btnConfirmCashManagementTemplate.prop("disabled", false);
        }
      }
    });
  });
  $btnPrintThermal.on("click", function() {   
    var type = "time_deposit_collection_thermal";
 
    window.open("/print?type=" + type + "&id=" + timeDepositCollectionId);
 
   });
  $btnPrint.on("click", function() {
    $modalPrint.show();

    var type = "time_deposit_collection";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + timeDepositCollectionId);
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
        id: timeDepositCollectionId,
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
  timeDepositCollectionId = options.id;
  authenticityToken       = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
