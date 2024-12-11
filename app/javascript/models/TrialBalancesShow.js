import Mustache from "mustache";
import $ from "jquery";

var $modalDelete;
var $btnDelete;
var $btnConfirmDelete;
var $message;
var templateErrorList;
var _authenticityToken;

var _urlDelete;
var _id;
var _xKoinsAppAuthSecret;
var _userId;

var init  = function(options) {
  _id                   = options.id;
  _authenticityToken    = options.authenticityToken;
  _urlDelete            = options.urlDelete;
  _userId               = options.userId;
  _xKoinsAppAuthSecret  = options.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
}

var _cacheDom = function() {
  $modalDelete      = $("#modal-delete");
  $btnDelete        = $("#btn-delete");
  $btnConfirmDelete = $("#btn-confirm-delete");
  $message          = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnDelete.on("click", function() {
    $modalDelete.show();
  });

  $btnConfirmDelete.on("click", function() {
    $btnConfirmDelete.prop("disabled", true);

    $.ajax({
      url: _urlDelete,
      method: "POST",
      headers: {
        'X-KOINS-APP-AUTH-SECRET': _xKoinsAppAuthSecret,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      },
      data: {
        id: _id,
        authenticity_token: _authenticityToken,
        user_id: _userId
      },
      success: function(response) {
        $message.html("Success!");
        window.location.href = "/accounting/trial_balances";
      },
      error: function(response) {
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmDelete.prop("disabled", false);
        }
      }
    });
  });
};

export default { init: init };
