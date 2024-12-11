import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $btnConfirmNew;
var $selectBranch;
var $selectMonth;
var $selectYear;
var $modalNew;

var $message;
var $xFormControl;
var templateErrorList;
var templateSuccessMessage;

var _urlCreate;
var _userId;
var _xKoinsAppAuthSecret;

var _cacheDom = function() {
  $btnNew         = $("#btn-new");
  $btnConfirmNew  = $("#btn-confirm-new");
  $selectBranch   = $("#select-branch");
  $selectMonth    = $("#select-month");
  $selectYear     = $("#select-year");
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  )

  $message                = $(".message");
  $xFormControl           = $(".x-form-control");
  templateErrorList       = $("#template-error-list").html();
  templateSuccessMessage  = $("#template-success-message").html();
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var branchId  = $selectBranch.val();
    var month     = $selectMonth.val();
    var year      = $selectYear.val();

    var data = {
      branch_id: branchId,
      month: month,
      year: year,
      user_id: _userId
    };

    $xFormControl.prop("disabled", true);

    $message.html("Loading...");

    $.ajax({
      url: _urlCreate,
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
        $message.html(
          Mustache.render(
            templateSuccessMessage,
            { message: "Success! You may now close this window" }
          )
        );

        $xFormControl.prop("disabled", false);
      },
      error: function(response) {
        console.log(response.response);
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

          $xFormControl.prop("disabled", false);
        }
      }
    });
  });
};

var init = function(options) {
  _urlCreate            = options.urlCreate;
  _userId               = options.userId;
  _xKoinsAppAuthSecret  = options.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
};

export default { init: init }
