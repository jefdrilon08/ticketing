import $ from "jquery";
import * as bootstrap from "bootstrap";
import Mustache from "mustache";

var $modalUpdate;
var $modalPrint;
var $modalApprove;
var $modalSetRate;

var $btnUpdate;
var $btnConfirmUpdate;
var $printMessage;
var $btnPrintPdf;

var $btnApprove;
var $btnConfirmApprove;
var $btnPrint;
var loader;
var $btnSetRate;
var $btnConfirmSetRate;
var $inputEquityInterestRate;
var $inputSavingsRate;
var $inputCbuRate;

var id;
var templateErrorList;
var authenticityToken;

var $message;

var _cacheDom = function() {
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $modalSetRate = new bootstrap.Modal(
    document.getElementById("modal-set-rate")
  );

  $btnUpdate        = $("#btn-update");
  $btnConfirmUpdate = $("#btn-confirm-update");
  $btnPrint         = $("#btn-print");
  $printMessage       = $(".print-message");
  $btnPrintPdf      =  $("#btn-print-pdf");
  $modalPrint       = $("#modal-print")
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");

  $btnSetRate               = $("#btn-set-rate");
  $btnConfirmSetRate        = $("#btn-confirm-set-rate");
  $inputEquityInterestRate  = $("#input-equity-interest-rate");
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
    //var print_icpr = $btnPrintPdf.data('id');
    var print_icpr = document.getElementById("btn-print-pdf").getAttribute('data-id');
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
    var equityInterestRate  = $inputEquityInterestRate.val();
    var savingsRate         = $inputSavingsRate.val();
    var cbuRate             = $inputCbuRate.val();

    $message.html("Loading...");

    $inputEquityInterestRate.prop("disabled", true);
    $inputSavingsRate.prop("disabled", true);
    $inputCbuRate.prop("disabled", true);
    $btnConfirmSetRate.prop("disabled", true);

    $.ajax({
      url: "/api/v1/data_stores/icpr/set_rate",
      method: 'POST',
      data: {
        id: id,
        authenticity_token: authenticityToken,
        equity_interest_rate: equityInterestRate,
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
          $inputEquityInterestRate.prop("disabled", false);
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
      url: "/api/v1/data_stores/icpr/approve",
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
      url: "/api/v1/monthly_closing_collections/update",
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

export default { init: init }
