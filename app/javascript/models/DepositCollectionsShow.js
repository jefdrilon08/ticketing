import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var options;
var depositCollectionId;
var authenticityToken;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnFinalize;
var $btnConfirmFinalize;
var $modalFinalize;


var $btnPrint;
var $btnPrintAccountingEntry;
var $modalPrint;

var $btnPrintThermal;

var $selectCashManagementTemplate;
var $btnConfirmBook;

var $selectBook;
var $btnConfirmCashManagementTemplate;

var $btnLoadBranch;
var $btnConfirmLoadBranch;
var $modalLoadBranch;

var $btnLoadCenter;
var $btnConfirmLoadCenter;
var $modalLoadCenter;
var $selectCenter;

var $message;
var templateErrorList;

var _urlApprove                       = "/api/v1/deposit_collections/approve";
var _urlFinalize                      = "/api/v1/deposit_collections/finalize";
var _urlPrint                         = "/api/v1/print/generate_file";
var _urlModifyCashManagementTemplate  = "/api/v1/deposit_collections/modify_cash_management_template";
var _urlModifyBook                    = "/api/v1/deposit_collections/modify_book";
var _urlLoadBranch                    = "/api/v1/deposit_collections/load_branch";
var _urlLoadCenter                    = "/api/v1/deposit_collections/load_center";

var _cacheDom = function() {
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $modalFinalize = new bootstrap.Modal(
    document.getElementById("modal-finalize")
  );

  $modalPrint = new bootstrap.Modal(
    document.getElementById("modal-print")
  );

  $modalLoadBranch = new bootstrap.Modal(
    document.getElementById("modal-load-branch")
  );

  $modalLoadCenter = new bootstrap.Modal(
    document.getElementById("modal-load-center")
  );

  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  
  $btnFinalize        = $("#btn-finalize");
  $btnConfirmFinalize = $("#btn-confirm-finalize");

  $btnPrint                  = $("#btn-print");
  $btnPrintAccountingEntry   = $("#btn-print-accounting-entry");

  $btnPrintThermal            = $("#btn-thermal");

  $selectBook     = $("#select-book");
  $btnConfirmBook = $("#btn-confirm-book");

  $selectCashManagementTemplate     = $("#select-cash-management-template");
  $btnConfirmCashManagementTemplate = $("#btn-confirm-cash-management-template");

  $btnLoadBranch        = $("#btn-load-branch");
  $btnConfirmLoadBranch = $("#btn-confirm-load-branch");

  $btnLoadCenter        = $("#btn-load-center");
  $btnConfirmLoadCenter = $("#btn-confirm-load-center");
  $selectCenter         = $("#select-center");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {

  $btnPrintThermal.on("click", function(){
    $modalPrint.show();

    var type = "deposit_collection_thermal";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + depositCollectionId);

  });

  $btnLoadCenter.on("click", function() {
    $modalLoadCenter.show();
  });

  $btnConfirmLoadCenter.on("click", function() {
    var centerId  = $selectCenter.val();

    $message.html("Loading....");
    $btnConfirmLoadBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);

    $.ajax({
      url: _urlLoadCenter,
      method: 'POST',
      data: { 
        id: depositCollectionId,
        center_id: centerId,
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

          $btnConfirmLoadCenter.prop("disabled", false);
          $selectCenter.prop("disabled", false);
        }
      }
    });
  });

  $btnLoadBranch.on("click", function() {
    $modalLoadBranch.show();
  });
  $btnPrintThermal.on("click", function(){
    alert("tanginamo")
  });
  $btnConfirmLoadBranch.on("click", function() {
    $message.html("Loading....");
    $btnConfirmLoadBranch.prop("disabled", true);

    $.ajax({
      url: _urlLoadBranch,
      method: 'POST',
      data: { 
        id: depositCollectionId,
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

          $btnConfirmLoadBranch.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmBook.on("click", function() {
    var book  = $selectBook.val();

    $message.html("Loading...");

    $selectBook.prop("disabled", true);
    $btnConfirmBook.prop("disabled", true);

    $.ajax({
      url: _urlModifyBook,
      method: 'POST',
      data: { 
        id: depositCollectionId,
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
        id: depositCollectionId,
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

  $btnPrint.on("click", function() {
    $modalPrint.show();

    var type = "deposit_collection";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + depositCollectionId);
  });

  $btnPrintAccountingEntry.on("click", function() {
    $modalPrint.show();

    var type = "deposit_collection_accounting_entry";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + depositCollectionId);
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
        id: depositCollectionId,
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

  $btnFinalize.on("click", function() {
    $message.html("");
    $modalFinalize.show();
  });

  $btnConfirmFinalize.on("click", function() {
    $message.html("Loading...");
    $btnConfirmFinalize.prop("disabled", true);

    $.ajax({
      url: _urlFinalize,
      method: 'POST',
      dataType: 'json',
      data: {
        id: depositCollectionId,
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
};

var init  = function(options) {
  depositCollectionId = options.id;
  authenticityToken   = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
