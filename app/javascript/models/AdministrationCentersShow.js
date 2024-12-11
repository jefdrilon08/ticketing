import Mustache from "mustache";
import $ from "jquery";

var $selectOfficer;
var $modalAssignOfficer;
var $btnAssignOfficer;
var $btnConfirmAssignOfficer;

var $message;
var templateErrorList;

var _id;
var _authenticityToken;

var _cacheDom = function() {
  $btnAssignOfficer         = $("#btn-assign-officer");
  $btnConfirmAssignOfficer  = $("#btn-confirm-assign-officer");
  $modalAssignOfficer       = $("#modal-assign-officer");
  $selectOfficer            = $("#select-officer");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnAssignOfficer.on("click", function() {
    $modalAssignOfficer.show();
  });

  $btnConfirmAssignOfficer.on("click", function() {
    var officerId = $selectOfficer.val();

    $btnConfirmAssignOfficer.prop("disabled", true);
    $selectOfficer.prop("disabled", true);

    $.ajax({
      url: "/api/v1/centers/assign_officer",
      method: "POST",
      data: {
        id: _id,
        officer_id: officerId,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Success! Reloading...");
        window.location.reload();
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

          $btnConfirmAssignOfficer.prop("disabled", false);
          $selectOfficer.prop("disabled", false);
        }
      }
    });
  });
};

var init = function(options) {
  _id                 = options.id;
  _authenticityToken  = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
