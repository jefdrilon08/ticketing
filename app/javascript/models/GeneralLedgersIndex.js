import Mustache from "mustache";
import $ from "jquery";

var $modalNew;
var $inputStartDate;
var $inputEndDate;
var $selectBranch;
var $selectAccountingFund;
var $btnNew;
var $btnConfirmNew;
var $message;
var templateErrorList;
var _authenticityToken;
var _xKoinsAppAuthSecret;
var _urlCreate;
var _userId;

var init  = function(options) {
  _authenticityToken    = options.authenticityToken;
  _xKoinsAppAuthSecret  = options.xKoinsAppAuthSecret;
  _urlCreate            = options.urlCreate;
  _userId               = options.userId;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $modalNew             = $("#modal-new");
  $inputStartDate       = $("#input-start-date");
  $inputEndDate         = $("#input-end-date");
  $selectBranch         = $("#select-branch");
  $selectAccountingFund = $("#select-accounting-fund");
  $btnNew               = $("#btn-new");
  $btnConfirmNew        = $("#btn-confirm-new");
  $message              = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
  });

  $btnConfirmNew.on("click", function() {
    var startDate         = $inputStartDate.val();
    var endDate           = $inputEndDate.val();
    var branchId          = $selectBranch.val();
    var accountingFundId  = $selectAccountingFund.val();

    $message.html("Loading...");

    $inputStartDate.prop("disabled", true);
    $inputEndDate.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectAccountingFund.prop("disabled", true);
    $btnConfirmNew.prop("disabled", true);

    $.ajax({
      url: _urlCreate,
      method: "POST",
      headers: {
        'X-KOINS-APP-AUTH-SECRET': _xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      data: {
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        accounting_fund_id: accountingFundId,
        authenticity_token: _authenticityToken,
        user_id: _userId
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        var errors  = [];

        console.log("ERROR");
        console.log(response);

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $inputStartDate.prop("disabled", false);
          $inputEndDate.prop("disabled", false);
          $selectBranch.prop("disabled", false);
          $selectAccountingFund.prop("disabled", false);
          $btnConfirmNew.prop("disabled", false);
        }
      }
    });
  });
};

export default { init: init };
