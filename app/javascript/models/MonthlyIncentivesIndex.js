import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;

var $selectBranch;
var $inputAsOf;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")

  );
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
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: "/api/v1/data_stores/monthly_incentives/queue",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/data_stores/monthly_incentives";
      },
      error: function(response) {
        var errors = ["Something went wrong"];
        console.log(response);

        try {
          errors  = JSON.parse(response.responseText).errors.full_messages;
        } catch(e) {
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmNew.prop("disabled", false);
          $selectBranch.prop("disabled", false);
          $inputAsOf.prop("disabled", false);
        }
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
