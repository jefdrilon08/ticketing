import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import "pdfmake/build/pdfmake"
const pdfMake = window["pdfMake"];
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import MembershipApplicationFormDocumentBuilder from './MembershipApplicationFormDocumentBuilder.js';

var _id;
var _authenticityToken;
var _data;

var $modalProcess;
var $modalReject;
var $modalVerify;
var $modalAssignBranch;
var $btnVerify;
var $btnConfirmVerify;
var $btnProcess;
var $btnConfirmProcess;
var $btnReject;
var $btnConfirmReject;
var $btnDownloadForm;
var $btnAssignBranch;
var $btnConfirmAssignBranch;
var $message;
var templateErrorList;
var templateCenterOptions;
var $selectBranch;
var $selectVerifyBranch;
var $selectAssignBranch;
var $selectAssignCenter;
var $selectAssignMembershipArrangement;
var $selectAssignMembershipType;
var $selectCenter;
var $inputReason;
var _centers = [];

var _cacheDom = function() {
  $modalProcess = new bootstrap.Modal(
    document.getElementById("modal-process")
  )

  $modalReject = new bootstrap.Modal(
    document.getElementById("modal-reject")
  )

  $modalVerify = new bootstrap.Modal(
    document.getElementById("modal-verify")
  )

  $modalAssignBranch = new bootstrap.Modal(
    document.getElementById("modal-assign-branch")
  )

  $btnProcess                         = $("#btn-process");
  $btnConfirmProcess                  = $("#btn-confirm-process");
  $btnReject                          = $("#btn-reject");
  $btnConfirmReject                   = $("#btn-confirm-reject");
  $btnVerify                          = $("#btn-verify");
  $btnConfirmVerify                   = $("#btn-confirm-verify");
  $btnDownloadForm                    = $("#btn-download-form");
  $btnAssignBranch                    = $("#btn-assign-branch");
  $btnConfirmAssignBranch             = $("#btn-confirm-assign-branch");
  $inputReason                        = $("#input-reason");
  $selectBranch                       = $("#select-branch");
  $selectVerifyBranch                 = $("#select-verify-branch");
  $selectCenter                       = $("#select-center");
  $selectAssignBranch                 = $("#select-assign-branch");
  $selectAssignCenter                 = $("#select-assign-center");
  $selectAssignMembershipArrangement  = $("#select-assign-membership-arrangement");
  $selectAssignMembershipType         = $("#select-assign-membership-type");
  $message                            = $(".message");
  templateErrorList                   = $("#template-error-list").html();
  templateCenterOptions               = $("#template-center-options").html();
}

var _bindEvents = function() {
  $btnAssignBranch.on("click", function() {
    $modalAssignBranch.show();
  });

  $btnConfirmAssignBranch.on("click", function() {
    var branchId                = $selectAssignBranch.val();

    $btnConfirmAssignBranch.prop("disabled", true);
    $selectAssignBranch.prop("disabled", true);
    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/online_applications/assign_branch",
      method: "POST",
      data: {
        id: _id,
        branch_id: branchId,
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

          $btnConfirmAssignBranch.prop("disabled", false);
          $selectAssignBranch.prop("disabled", false);
        }
      }
    });
  });

  $btnDownloadForm.on("click", function() {
    console.log(_data);
    var docDefinition = MembershipApplicationFormDocumentBuilder.execute(_data);

    pdfMake.createPdf(docDefinition).open();
  });

  $btnVerify.on("click", function() {
    $modalVerify.show();
  });

  $btnConfirmVerify.on("click", function() {
    var membershipTypeId        = $selectAssignMembershipType.val();
    var membershipArrangementId = $selectAssignMembershipArrangement.val();
    var centerId                = $selectAssignCenter.val();

    $selectAssignMembershipType.prop("disabled", true);
    $selectAssignMembershipArrangement.prop("disabled", true);
    $btnConfirmVerify.prop("disabled", true); 

    $.ajax({
      url: "/api/v1/online_applications/verify",
      method: "POST",
      data: {
        id: _id,
        membership_type_id: membershipTypeId,
        membership_arrangement_id: membershipArrangementId,
        center_id: centerId,
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

          $btnConfirmVerify.prop("disabled", false);
          $selectAssignMembershipType.prop("disabled", false);
          $selectAssignMembershipArrangement.prop("disabled", false);
        }
      }
    });
  });

  if($selectBranch.val()) {
    $.ajax({
      url: "/api/v1/branches/fetch_centers",
      data: {
        id: $selectBranch.val()
      },
      success: function(response) {
        $selectCenter.html(
          Mustache.render(
            templateCenterOptions,
            response
          )
        )
      },
      error: function(response) {
        alert("Cannot fetch centers");
      }
    });
  }

  $btnReject.on("click", function() {
    $modalReject.show();
  });

  $btnConfirmReject.on("click", function() {
    var reason  = $inputReason.val();

    $btnConfirmReject.prop("disabled", true);
    $inputReason.prop("disabled", true);

    $message.html("");

    $.ajax({
      url: "/api/v1/online_applications/reject",
      method: 'POST',
      data: {
        id: _id,
        reason: reason
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

          $inputReason.prop("disabled", false);
          $btnConfirmReject.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmProcess.on("click", function() {
    var branchId  = $selectBranch.val();
    var centerId  = $selectCenter.val();

    $message.html("");

    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);
    $btnConfirmProcess.prop("disabled", true);

    $.ajax({
      url: "/api/v1/online_applications/process",
      method: 'POST',
      data: {
        id: _id,
        branch_id: branchId,
        center_id: centerId
      },
      success: function(response) {
        $message.html("Success! Redirecting..."); 
        window.location.href = "/online_applications";
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).errors;
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

          $selectBranch.prop("disabled", false);
          $selectCenter.prop("disabled", false);
          $btnConfirmProcess.prop("disabled", false);
        }
      }
    });
  });

  $btnProcess.on("click", function() {
    $modalProcess.show();
  });

  $selectBranch.on("change", function() {
    var branchId = $(this).val();

    if(branchId) {
      $.ajax({
        url: "/api/v1/branches/fetch_centers",
        data: {
          id: branchId
        },
        success: function(response) {
          $selectCenter.html(
            Mustache.render(
              templateCenterOptions,
              response
            )
          )
        },
        error: function(response) {
          alert("Cannot fetch centers");
        }
      });
    }
  });
}

var init = function(options) {
  _id                 = options.id;
  _authenticityToken  = options.authenticityToken;
  _data               = options.data;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
