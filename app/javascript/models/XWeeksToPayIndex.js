import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;

var $selectBranch;
var $selectX;
var $inputAsOf;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")

  );
  $btnNew        = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");

  $selectBranch   = $("#select-branch");
  $inputAsOf      = $("#input-as-of");
  $selectX        = $("#select-x");

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
    var x         = $selectX.val();

    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $inputAsOf.prop("disabled", true);
    $selectX.prop("disabled", true);

    var data  = {
      as_of: asOf,
      branch_id: branchId,
      x: x,
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: "/api/v1/data_stores/x_weeks_to_pay/queue",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/data_stores/x_weeks_to_pay";
      },
      error: function(response) {
        $message.html("Something went wrong...");
        $btnConfirmNew.prop("disabled", false);
        $selectBranch.prop("disabled", false);
        $inputAsOf.prop("disabled", false);
        $selectX.prop("disabled", false);
      }
    });
  });
}

var init  = function(config) {
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
