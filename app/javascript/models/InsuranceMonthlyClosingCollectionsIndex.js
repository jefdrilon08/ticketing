import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $btnConfirmNew;
var $modalNew;

var $selectBranch;
var $selectAccountSubtype;
var $inputClosingDate;

var $message;
var templateErrorList;

var authenticityToken;

var cable;
var event;

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  );

  $btnNew         = $("#btn-new");
  $btnConfirmNew  = $("#btn-confirm-new");

  $selectBranch         = $("#select-branch");
  $selectAccountSubtype = $("#select-account-subtype");
  $inputClosingDate     = $("#input-closing-date");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var branchId        = $selectBranch.val();
    var accountSubtype  = $selectAccountSubtype.val();
    var closingDate     = $inputClosingDate.val();

    $selectBranch.prop("disabled", true);
    $inputClosingDate.prop("disabled", true);
    $btnConfirmNew.prop("disabled", true);

    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/insurance_monthly_closing_collections",
      method: 'POST',
      data: {
        branch_id: branchId,
        account_subtype: accountSubtype,
        closing_date: closingDate,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href = "/insurance_monthly_closing_collections/" + response.id;
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

          $selectBranch.prop("disabled", false);
          $inputClosingDate.prop("disabled", false);
          $btnConfirmNew.prop("disabled", false);
        }
      }
    });
  });
}

var init  = function(options) {
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
