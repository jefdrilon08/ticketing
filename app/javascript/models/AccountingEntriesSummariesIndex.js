import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;

var $selectBranch;
var $selectBook;
var $inputStartDate;
var $inputEndDate;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $btnNew        = $("#btn-new");
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")
  );
  $btnConfirmNew = $("#btn-confirm-new");

  $selectBranch   = $("#select-branch");
  $selectBook     = $("#select-book");
  $inputStartDate = $("#input-start-date");
  $inputEndDate   = $("#input-end-date");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var startDate = $inputStartDate.val();
    var endDate   = $inputEndDate.val();
    var branchId  = $selectBranch.val();
    var book      = $selectBook.val();

    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectBook.prop("disabled", true);
    $inputStartDate.prop("disabled", true);
    $inputEndDate.prop("disabled", true);

    var data  = {
      start_date: startDate,
      end_date: endDate,
      branch_id: branchId,
      book: book,
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: "/api/v1/data_stores/accounting_entries_summaries/queue",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/data_stores/accounting_entries_summaries";
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

          $btnConfirmNew.prop("disabled", false);
          $selectBranch.prop("disabled", false);
          $selectBook.prop("disabled", false);
          $inputStartDate.prop("disabled", false);
          $inputEndDate.prop("disabled", false);
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
