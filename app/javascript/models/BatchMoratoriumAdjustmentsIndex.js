import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;

var $btnNew;
var $btnConfirmNew;
var $selectBranch;
var $selectCenter;
var $inputNumberOfDays;
var $inputReason;
var $inputDateInitialized;
var $modalNew;

var $message;

var templateErrorList;

var _urlNew = "/api/v1/adjustments/batch_moratorium_adjustments/create";

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  )

  $btnNew               = $("#btn-new");
  $btnConfirmNew        = $("#btn-confirm-new");
  $inputNumberOfDays    = $("#input-number-of-days");
  $inputReason          = $("#input-reason");
  $inputDateInitialized = $("#input-date-initialized");
  $selectBranch         = $("#select-branch");
  $selectCenter         = $("#select-center");

  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $selectBranch.on("change", function() {
    var id  = $(this).val();

    $.ajax({
      url: "/api/v1/branches/fetch_centers",
      method: 'GET',
      data: {
        id: id
      },
      success: function(response) {
        $selectCenter.html("");

        $selectCenter.append(
          "<option value=''>-- SELECT --</option>"
        );

        for(var i = 0; i < response.centers.length; i++) {
          var center  = response.centers[i];
          $selectCenter.append(
            "<option value='" + center.id + "'>" + center.name + "</option>"
          );
        }
      },
      error: function(response) {
        alert("Error in fetching centers");
      }
    });
  });

  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });
  
  $btnConfirmNew.on("click", function() {
    var branchId        = $selectBranch.val();
    var centerId        = $selectCenter.val();
    var numberOfDays    = $inputNumberOfDays.val();
    var dateInitialized = $inputDateInitialized.val();
    var reason          = $inputReason.val();

    $message.html("Loading...");

    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);
    $inputNumberOfDays.prop("disabled", true);
    $inputDateInitialized.prop("disabled", true)
    $inputReason.prop("disabled", true);
    $btnConfirmNew.prop("disabled", true);

    $.ajax({
      url: _urlNew,
      method: 'POST',
      data: {
        authenticity_token: _authenticityToken,
        branch_id: branchId,
        center_id: centerId,
        number_of_days: numberOfDays,
        date_initialized: dateInitialized,
        reason: reason
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.href="/adjustments/batch_moratorium_adjustments/" + response.id;
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
          $selectCenter.prop("disabled", false);
          $inputNumberOfDays.prop("disabled", false);
          $inputDateInitialized.prop("disabled", false)
          $inputReason.prop("disabled", false);
          $btnConfirmNew.prop("disabled", false);
        }
      }
    });
  });
};

var init  = function(options) {
  _authenticityToken  = options.authenticityToken; 

  _cacheDom();
  _bindEvents();
};

export default { init: init };
