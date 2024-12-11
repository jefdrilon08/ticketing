import Mustache from "mustache";
import $ from "jquery";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;

var $selectBranch;
var $inputAsOf;

var $message;
var templateErrorList;

var _urlQueue;
var _userId;
var _xKoinsAppAuthSecret;

var _cacheDom = function() {
  $modalNew      = $("#modal-new");
  $btnNew        = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");

  $selectBranch = $("#select-branch");
  $inputAsOf      = $("#input-as-of");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var asOf      = $inputAsOf.val();
    var branchId  = $selectBranch.val();

    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $inputAsOf.prop("disabled", true);

    var data  = {
      as_of: asOf,
      branch_id: branchId,
      user_id: _userId,
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: _urlQueue,
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
        $message.html("Success! Redirecting...");
        window.location.href="/data_stores/member_counts";
      },
      error: function(response) {
        $message.html("Something went wrong...");
        $btnConfirmNew.prop("disabled", false);
        $selectBranch.prop("disabled", false);
        $inputAsOf.prop("disabled", false);
      }
    });
  });
}

var init  = function(config) {
  authenticityToken = config.authenticityToken;
  _urlQueue             = config.urlQueue;
  _userId               = config.userId;
  _xKoinsAppAuthSecret  = config.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
