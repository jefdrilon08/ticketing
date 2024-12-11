import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $btnConfirmNew;
var $modalNew;

var $selectCategory;
var $inputStartDate;
var $inputEndDate;

var $message;
var templateErrorList;

var authenticityToken;

var _cacheDom = function() {
  $btnNew         = $("#btn-new");
  $btnConfirmNew  = $("#btn-confirm-new");
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  );
  $inputStartDate     = $("#input-start-date");
  $inputEndDate       = $("#input-end-date");
  $selectCategory     = $("#select-category");
  
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var category  = $selectCategory.val();
    var startDate = $inputStartDate.val();
    var endDate   = $inputEndDate.val();

    $selectCategory.prop("disabled", true);
    $inputStartDate.prop("disabled", true);
    $inputEndDate.prop("disabled", true);

    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/commission_collections",
      method: 'POST',
      data: {
        category: category,
        start_date: startDate,
        end_date: endDate,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href = "/commission_collections/" + response.id;
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

          $selectCategory.prop("disabled", false);
          $inputStartDate.prop("disabled", false);
          $inputEndDate.prop("disabled", false);
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
