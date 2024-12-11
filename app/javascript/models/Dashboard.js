import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnGenerateAccountingReport;
var $btnGenerateDailyReport;
var $btnConfirmGenerateDailyReport;
var $btnConfirmGenerateAccountingReport;
var $modalGenerateDailyReport;
var $modalGenerateAccountingReport;
var $selectBranch;
var $inputAsOf;
var $selectAccReportBranch;
var $selectAccReportAccountingFund;
var $inputAccReportStartDate;
var $inputAccReportEndDate;
var $xFormControl;

var $message;
var templateErrorList;
var templateSuccessMessage;

var _urlGenerateDailyReport;
var _urlGenerateAccountingReport;
var _userId;
var _xKoinsAppAuthSecret;

var _cacheDom = function() {
  $modalGenerateDailyReport = new bootstrap.Modal(
    document.getElementById("modal-generate-daily-report")
  );

  $modalGenerateAccountingReport = new bootstrap.Modal(
    document.getElementById("modal-generate-accounting-report")
  );

  $btnGenerateDailyReport             = $("#btn-generate-daily-report");
  $btnGenerateAccountingReport        = $("#btn-generate-accounting-report");
  $btnConfirmGenerateDailyReport      = $("#btn-confirm-generate-daily-report");
  $btnConfirmGenerateAccountingReport = $("#btn-confirm-generate-accounting-report");

  $selectBranch                       = $("#select-branch");
  $inputAsOf                          = $("#input-as-of");
  $selectAccReportBranch              = $("#select-acc-report-branch");
  $selectAccReportAccountingFund      = $("#select-acc-report-accounting-fund");
  $inputAccReportStartDate            = $("#input-acc-report-start-date");
  $inputAccReportEndDate              = $("#input-acc-report-end-date");
  $xFormControl                       = $(".x-form-control");

  $message                = $(".message");
  templateErrorList       = $("#template-error-list").html();
  templateSuccessMessage  = $("#template-success-message").html();
};

var _bindEvents = function() {
  $btnGenerateAccountingReport.on("click", function() {
    $message.html("");
    $modalGenerateAccountingReport.show();
  });

  $btnConfirmGenerateAccountingReport.on("click", function() {
    var accountingFundId  = $selectAccReportAccountingFund.val();
    var branchId          = $selectAccReportBranch.val();
    var startDate         = $inputAccReportStartDate.val();
    var endDate           = $inputAccReportEndDate.val();

    var data = {
      start_date: startDate,
      end_date: endDate,
      branch_id: branchId,
      accounting_fund_id: accountingFundId,
      user_id: _userId
    }

    $xFormControl.prop("disabled", true);
    $message.html("Loading...");

    $.ajax({
      url: _urlGenerateAccountingReport,
      method: 'POST',
      headers: {
        'X-KOINS-APP-AUTH-SECRET': _xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      data: data,
      success: function(response) {
        $message.html(
          Mustache.render(
            templateSuccessMessage,
            { message: "Success! You may now close this window" }
          )
        );


        $xFormControl.prop("disabled", false);
        $selectAccReportBranch.val("");
      },
      error: function(response) {
        console.log(response.responseText);
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          console.log(err);
          errors  = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $xFormControl.prop("disabled", false);
        }
      }
    });
  });

  $btnGenerateDailyReport.on("click", function() {
    $message.html("");
    $modalGenerateDailyReport.show();
  });

  $btnConfirmGenerateDailyReport.on("click", function() {
    var asOf      = $inputAsOf.val();
    var branchId  = $selectBranch.val();

    var data = {
      as_of: asOf,
      branch_id: branchId,
      user_id: _userId
    }

    $xFormControl.prop("disabled", true);
    $message.html("Loading...");

    $.ajax({
      url: _urlGenerateDailyReport,
      method: 'POST',
      headers: {
        'X-KOINS-APP-AUTH-SECRET': _xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      data: data,
      success: function(response) {
        $message.html(
          Mustache.render(
            templateSuccessMessage,
            { message: "Success! You may now close this window" }
          )
        );


        $xFormControl.prop("disabled", false);
        $selectBranch.val("");
      },
      error: function(response) {
        console.log(response.responseText);
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          console.log(err);
          errors  = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $xFormControl.prop("disabled", false);
        }
      }
    });
  });
};

var init = function(config) {
  _urlGenerateDailyReport       = config.urlGenerateDailyReport;
  _urlGenerateAccountingReport  = config.urlGenerateAccountingReport;
  _userId                       = config.userId;
  _xKoinsAppAuthSecret          = config.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
