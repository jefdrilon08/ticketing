import $ from "jquery";
import * as bootstrap from "bootstrap";
import Mustache from "mustache";

var $btnUpdate;
var $btnConfirmUpdate;
var $modalUpdate;
var $modalPrint;
var $printMessage;
var $btnPrint;
var loader;
var $btnPrintPdf;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnSetRate;
var $btnConfirmSetRate;
var $modalSetRate;
var $inputPatronageInterestRate;
var $inputSavingsRate;
var $inputCbuRate;

var id;
var templateErrorList;
var authenticityToken;

var $message;

var _cacheDom = function() {
  $btnUpdate        = $("#btn-update");
  $btnConfirmUpdate = $("#btn-confirm-update");
  $modalUpdate      = $("#modal-update");
  $btnPrint         = $("#btn-print");
  $printMessage       = $(".print-message");
  $modalPrint         = $("#modal-print");
  $btnPrintPdf      =  $("#btn-print-pdf");
  
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  $modalApprove       = new bootstrap.Modal(document.getElementById("modal-approve"));

  $btnSetRate               = $("#btn-set-rate");
  $btnConfirmSetRate        = $("#btn-confirm-set-rate");
  $modalSetRate             = new bootstrap.Modal(document.getElementById("modal-set-rate"));
  $inputPatronageInterestRate  = $("#input-patronage-interest-rate");
  $inputSavingsRate         = $("#input-savings-rate");
  $inputCbuRate             = $("#input-cbu-rate");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
  loader            = $("#template-loader").html();
};

var _bindEvents = function() {
  $btnSetRate.on("click", function() {
    $message.html("");
    $modalSetRate.show();
  });


  $btnPrintPdf.on("click", function() {
    var print_icpr = $btnPrintPdf.data('id');

    $modalPrint.show();
    $printMessage.html(
      Mustache.render(
        loader,
        {}
      )
    );

    $modalPrint.hide();
    window.open("/print?id=" + print_icpr + "&type=print_pr");
  });

  $btnConfirmSetRate.on("click", function() {
    var PatronageInterestRate  = $inputPatronageInterestRate.val();
    var savingsRate         = $inputSavingsRate.val();
    var cbuRate             = $inputCbuRate.val();

    $message.html("Loading...");

    $inputPatronageInterestRate.prop("disabled", true);
    $inputSavingsRate.prop("disabled", true);
    $inputCbuRate.prop("disabled", true);
    $btnConfirmSetRate.prop("disabled", true);

    $.ajax({
      url: "/api/v1/data_stores/patronage_refund/set_rate",
      method: 'POST',
      data: {
        id: id,
        authenticity_token: authenticityToken,
        patronage_interest_rate: PatronageInterestRate,
        savings_rate: savingsRate,
        cbu_rate: cbuRate
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

          $btnConfirmSetRate.prop("disabled", false);
          $inputPatronageInterestRate.prop("disabled", false);
          $inputSavingsRate.prop("disabled", false);
          $inputCbuRate.prop("disabled", false);
        }
      }
    });
  });

  $btnApprove.on("click", function() {
    $message.html("");
    $modalApprove.show();
  });

  $btnPrint.on("click", function() {
    var print_entry = $btnPrint.data('id');

    $modalPrint.show();
    $printMessage.html(
      Mustache.render(
        loader,
        {}
      )
    );

    $modalPrint.hide();
    window.open("/print?id=" + print_entry + "&type=print_entry");
  });
  
  $btnConfirmApprove.on("click", function() {
    $btnConfirmApprove.prop("disabled", true);
    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/data_stores/patronage_refund/approve",
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

  
};

var init  = function(options) {
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init }
