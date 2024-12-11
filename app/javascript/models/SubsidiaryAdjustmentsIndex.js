import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;

var $btnNew;
var $btnConfirmNew;
var $selectBranch;
var $modalNew;

var $message;

var templateErrorList;

var _urlNew = "/api/v1/adjustments/subsidiary_adjustments/create";

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  );

  $btnNew         = $("#btn-new");
  $btnConfirmNew  = $("#btn-confirm-new");
  $selectBranch   = $("#select-branch");

  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });
  
  $btnConfirmNew.on("click", function() {
    var branchId  = $selectBranch.val();

    $message.html("Loading...");

    $selectBranch.prop("disabled", true);
    $btnConfirmNew.prop("disabled", true);

    $.ajax({
      url: _urlNew,
      method: 'POST',
      data: {
        authenticity_token: _authenticityToken,
        branch_id: branchId
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.href="/adjustments/subsidiary_adjustments/" + response.id;
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
