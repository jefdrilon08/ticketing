import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;

var $selectBranch;
var $inputAsOf;
var $selectMemberStatus;

var $modalGenerateAll;
var $btnGenerateAll;
var $btnConfirmGenerateAll;

var $inputAsOfGenerateAll;

var $message;
var templateErrorList;

var _urlQueue;
var _urlQueueBulk;
var _userId;
var _xKoinsAppAuthSecret;

var _cacheDom = function() {
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")

  );

  $btnNew        = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");

  $selectBranch = $("#select-branch");
  $inputAsOf    = $("#input-as-of");
  $selectMemberStatus = $("#select-member-status");
  
    
  $modalGenerateAll     = new bootstrap.Modal(
    document.getElementById("modal-generate-all")

  );
  $btnGenerateAll        = $("#btn-generate-all");
  $btnConfirmGenerateAll = $("#btn-confirm-generate-all");

  $inputAsOfGenerateAll    = $("#input-as-of-generate-all");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var asOf      = $inputAsOf.val();
    var branchId  = $selectBranch.val();
    var memberStatus = $selectMemberStatus.val();

    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectMemberStatus.prop("disabled", true);
    $inputAsOf.prop("disabled", true);

    var data  = {
      as_of: asOf,
      branch_id: branchId,
      member_status: memberStatus,
      authenticity_token: authenticityToken,
      user_id: _userId
    }

    $.ajax({
      url: _urlQueue,
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
        window.location.href="/data_stores/insurance_personal_funds";
      },
      error: function(response) {
        var errors  = [];

        try {
          console.log(response);
          errors  = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors  = ["Something went wrong"]
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmNew.prop("disabled", false);
          $selectBranch.prop("disabled", false);
          $selectMemberStatus.prop("disabled", false);
          $inputAsOf.prop("disabled", false);
        }
      }
    });
  });

  $btnGenerateAll.on("click", function() {
    $modalGenerateAll.show();
    $message.html("");
  });

  $btnConfirmGenerateAll.on("click", function() {
    var asOfGenerateAll     = $inputAsOfGenerateAll.val();

    $message.html("Loading...");
    $btnConfirmGenerateAll.prop("disabled", true);
    $inputAsOfGenerateAll.prop("disabled", true);

    var data  = {
      as_of: asOfGenerateAll,
      user_id: _userId
    }

    $.ajax({
      url: _urlQueueBulk,
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
        window.location.href="/data_stores/insurance_personal_funds";
      },
      error: function(response) {
        var errors  = [];

        try {
          console.log(response);
          errors  = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors  = ["Something went wrong"]
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmGenerateAll.prop("disabled", false);
          $inputAsOfGenerateAll.prop("disabled", false);
        }
      }
    });
  });
}

var init  = function(config) {
  authenticityToken     = config.authenticityToken;
  _urlQueue             = config.urlQueue;
  _urlQueueBulk         = config.urlQueueBulk;
  _userId               = config.userId;
  _xKoinsAppAuthSecret  = config.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
