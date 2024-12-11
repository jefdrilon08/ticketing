import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $btnConfirmNew;
var $modalNew;

var $selectBranch;
var $selectMonth;
var $selectYear;

var authenticityToken;

var $message;

var templateErrorList;

var _urlCreate  = "/api/v1/data_stores/balance_sheets/queue";

var init  = function(options) {
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  )
  

  $btnNew         = $("#btn-new");
  $btnConfirmNew  = $("#btn-confirm-new");
  $selectBranch   = $("#select-branch");
  $selectMonth    = $("#select-month");
  $selectYear     = $("#select-year");

  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
  });

  $btnConfirmNew.on("click", function() {
    var branchId  = $selectBranch.val();
    var month     = $selectMonth.val();
    var year      = $selectYear.val();

    $message.html(
      "Loading..."
    );

    $selectBranch.prop("disabled", true);
    $selectMonth.prop("disabled", true);
    $selectYear.prop("disabled", true);
    $btnConfirmNew.prop("disabled", true);

    $.ajax({
      url: _urlCreate,
      method: 'POST',
      data: {
        authenticity_token: authenticityToken,
        month: month,
        branch_id: branchId,
        year: year
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
          $selectMonth.prop("disabled", false);
          $selectYear.prop("disabled", false);
          $btnConfirmNew.prop("disabled", false);
        }
      }
    });
  });
};

export default { init: init };
