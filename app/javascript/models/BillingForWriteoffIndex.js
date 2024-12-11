import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;
var errors;
var $selectYear;
var $selectBranch;
var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  );

  $btnNew           = $("#btn-new");
  $btnConfirmNew    = $("#btn-confirm-new");
  $selectYear       = $("#select-year");
  $selectBranch     = $("#select-branch");
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var year      = $selectYear.val();
    var branchId  = $selectBranch.val();

    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectYear.prop("disabled", true);
    $selectBranch.prop("disabled", true);

    var data  = {
      year: year,
      branch_id: branchId,
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: "/api/v1/billing_for_writeoff/create",
      method: 'POST',
      data: data,
      success: function(response) {
        window.location.href="/billing_for_writeoff";
      },
      error: function(response) {
        errors = [];

        try {
          errors = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors.push("Something went wrong");
          console.log(response);
        }

        $message.html(
          Mustache.render(
            templateErrorList,
            { errors: errors }
          )
        );

        $btnConfirmNew.prop("disabled", false);
        $selectBranch.prop("disabled", false);
        $selectYear.prop("disabled", false);
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