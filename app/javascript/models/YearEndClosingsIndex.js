import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $btnConfirmNew;
var $modalNew;

var $selectBranch;
var $inputClosingDate;

var authenticityToken;

var $message;

var templateErrorList;

var _urlCreate  = "/api/v1/data_stores/year_end_closings/queue";

var init  = function(options) {
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  )
  $btnNew           = $("#btn-new");
  $btnConfirmNew    = $("#btn-confirm-new");
  $selectBranch     = $("#select-branch");
  $inputClosingDate = $("#input-closing-date");

  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
  });

  $btnConfirmNew.on("click", function() {
    var branchId    = $selectBranch.val();
    var closingDate = $inputClosingDate.val();

    $message.html(
      "Loading..."
    );

    $selectBranch.prop("disabled", true);
    $inputClosingDate.prop("disabled", true);
    $btnConfirmNew.prop("disabled", true);

    $.ajax({
      url: _urlCreate,
      method: 'POST',
      data: {
        authenticity_token: authenticityToken,
        branch_id: branchId,
        closing_date: closingDate
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"]
        } finally {
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
};

export default { init: init }
