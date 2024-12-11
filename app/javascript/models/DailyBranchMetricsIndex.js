import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;
var _urlSave;
var _userId;
var _xKoinsAppAuthSecret;

var $modalNew;
var $btnNew;
var $btnConfirmNew;
var $inputAsOf;
var $selectBranch;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")

  );
  $btnNew         = $("#btn-new");
  $btnConfirmNew  = $("#btn-confirm-new");
  $inputAsOf      = $("#input-as-of");
  $selectBranch   = $("#select-branch");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
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
      authenticity_token: authenticityToken,
      user_id: _userId
    }

    $.ajax({
      url: _urlSave,
      method: 'POST',
      headers: {
        'X-KOINS-APP-AUTH-SECRET': _xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
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
          $inputAsOf.prop("disabled", false);
        }
      }
    });
  });
};

var init = function(options) {
  authenticityToken     = options.authenticityToken;
  _urlSave              = options.urlSave;
  _userId               = options.userId;
  _xKoinsAppAuthSecret  = options.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
