import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import "pdfmake/build/pdfmake"
const pdfMake = window["pdfMake"];
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import MembershipApplicationFormDocumentBuilder from './MembershipApplicationFormDocumentBuilder.js';
import { func } from "prop-types";

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
var $inputReason;
var _centers = [];

var $btnForReview;
var $btnConfirmForReview;
var $btnReject;
var $modalForReview;

var $btnForApprove;
var $modalForApprove;
var $btnConfirmForApprove;
var $modalReject;

var $btnApprove;

var $btnAmount;
var $modalEditAmount;
var $txtAmount;
var $btnConfirmAmount;
var _amount;
var _ltag;
var $btnConfirmReject;

var $btnRejectChecking;
var $modalRejectChecking;
var $txtInputReasonChecking;
var $btnConfirmRejectCheckingReason;

var $btnDecline;
var $modalDecline;
var $btnConfirmDecline;
var $InputReasonDecline;

var $btnCheck;
var $modalCheck;
var $btnConfirmCheck;

var $btnRejectApprove;
var $modalRejectApprove;
var $btnConfirmRejectApproveReason;
var $txtInputReasonApprove;

var $btnLoanTag;
var $modalEditltag;
var $btnConfirmLoanTag;
var $selectLoanTag;

var $btnSyncmb;
var $ModalMb;
var $btnConfirmb;
var $mb;

var _cacheDom = function() {

  $modalVerify = new bootstrap.Modal(
    document.getElementById("modal-verify")
  )
  $modalForReview = new bootstrap.Modal(
    document.getElementById("modal-for-review")
  )
  $modalForApprove = new bootstrap.Modal(
    document.getElementById("modal-for-approve")
  )
  
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  )
  $ModalMb = new bootstrap.Modal(
    document.getElementById("modal-maintaining")
  )
  $modalEditAmount = new bootstrap.Modal(
    document.getElementById("modal-edit-amount")
  )
  
  $modalReject = new bootstrap.Modal(
    document.getElementById("modal-reject")
  )
  
  $modalRejectChecking = new bootstrap.Modal(
    document.getElementById("modal-reject-for-checking")
  )
  
  $modalRejectApprove = new bootstrap.Modal(
    document.getElementById("modal-reject-for-approve")
  )
  
  $modalDecline =  new bootstrap.Modal(
    document.getElementById("modal-decline-for-approve")
  )
  $modalCheck = new bootstrap.Modal(
    document.getElementById("modal-check")
  )
  
  $modalEditltag = new bootstrap.Modal(
    document.getElementById("modal-loan-tag")
  )

  $btnRejectChecking = $("#btn-reject-checking")
  $txtInputReasonChecking = $("#input-reason-checking")
  $btnConfirmRejectCheckingReason = $("#confirm-reject-checking-reason") 

  $btnRejectApprove = $("#btn-reject-approve")
  $btnDecline = $("#btn-decline")
  
  $btnConfirmRejectApproveReason = $("#confirm-reject-approve-reason_test")
  $InputReasonDecline = $("#input-decline-approve")
  $txtInputReasonApprove = $("#input-reason-approve")

  $btnVerify                          = $("#btn-verify");
  $btnConfirmVerify                   = $("#btn-confirm-verify");
 
  $btnForReview                       = $("#btn-for-review");
  $btnConfirmForReview                = $("#btn-confirm-for-review");
  $btnReject                          = $("#btn-reject");
  $btnConfirmReject                  = $("#btn-confirm-reject");

  $btnForApprove                      = $("#btn-for-approve");
  $btnConfirmForApprove               = $("#btn-confirm-for-approve");

  $btnApprove                      = $("#btn-approve");
  $btnConfirmApprove                = $("#btn-confirm-approve");
  
  $btnAmount                       = $(".undo");
  $txtAmount                       = $("#bookId");
  $btnConfirmAmount               = $("#btn-confirm-edit-amount");

  $btnLoanTag                     = $(".ltag");
  $btnConfirmLoanTag              = $("#btn-confirm-loan-tag");
  $selectLoanTag                  = $("#select-loan-tag");

  $btnDownloadForm     = $("#btn-download-form");

  $btnConfirmDecline = $("#confirm-decline");
  $btnCheck = $("#btn-check");
  $btnConfirmCheck = $("#confirm-check");
  
  $btnSyncmb = $("#btn-sync-maitaining-balance");
  $btnConfirmb = $("#btn-confirm-sync-maintaining-balance");
  $mb = $("#maintaining-balance");

}

var _bindEvents = function() {
  $btnRejectApprove.on("click", function(){
    
    _id = $(this).data('id');
    $modalRejectApprove.show();
  

  });
  $btnSyncmb.on("click", function(){
    _id = $(this).data('id');
    $ModalMb.show();
  });
  $btnConfirmb.on("click", function(){
    var mb = $mb.val();
    
    $.ajax({
      url: "/api/v1/online_loan_applications/mb_save",
      method: "POST",
      data: {
        id:_id,
        maintaining_balance:mb,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.reload();
      }
    });
  })
  $btnCheck.on("click", function(){
    //alert("jay");
    

    $modalCheck.show();
  })
  $btnConfirmCheck.on("click", function(){
    var id = $btnCheck.val();
    $.ajax({
      url: "/api/v1/online_loan_applications/check",
      method: "POST",
      data: {
        id:id,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        window.location.reload();
      }
    });
  })

  $btnDecline.on("click", function(){
    // alert("jay");
    _id = $(this).data('id');
  

    $modalDecline.show();

  });
  $btnConfirmDecline.on("click", function(){
    var reason = $('#input-decline-approve').val();

    if(reason.trim() == ''){
      $('.message').text('Please provide a reason.');
      return false;
    }
    $.ajax({
      url: "/api/v1/online_loan_applications/decline",
      method: "POST",
      data: {
        id: _id,
        reason_reject: $InputReasonDecline.val(), 
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.href = "/online_loan_applications";
      }

    });

  })
  
  $btnConfirmRejectApproveReason.on("click", function(){
    var reason = $('#input-reason-approve').val();

    if(reason.trim() == ''){
      $('.message').text('Please provide a reason.');
      return false;
    }
    $.ajax({
      url: "/api/v1/online_loan_applications/reject_approve",
      method: "POST",
      data: {
        id: _id,
        reason_reject: $txtInputReasonApprove.val(), 
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.href = "/online_loan_applications";
      }
    });

  });
  
  $btnRejectChecking.on("click", function(){
    
    _id = $(this).data('id');
    $modalRejectChecking.show();

  });
  
  $btnConfirmRejectCheckingReason.on("click", function(){
    var reason = $('#input-reason-checking').val();
    
    if(reason.trim() == ''){
      $('.message').text('Please provide a reason.');
      return false;
    }
    $.ajax({
      url: "/api/v1/online_loan_applications/reject_checking",
      method: "POST",
      data: {
        id: _id,
        reason_reject: $txtInputReasonChecking.val(), 
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.href = "/online_loan_applications";
      }
    });

  });
  $btnReject.on("click", function() { 
   
    _id = $(this).data('id');
    $modalReject .show();


  });

  $btnDownloadForm.on("click", function(){
    var id = $(this).data('id');  
   
    var type = "print_online_loan_application"

    window.open("/print?type=" + type + "&id=" + id);
    // alert(id);
  });

  $btnConfirmReject.on("click", function(){

    
    $.ajax({
      url: "/api/v1/online_loan_applications/reject",
      method: "POST",
      data: {
        id: _id,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.href = "/online_loan_applications";
      }
    });

  });
  
  $btnLoanTag.on("click", function() {
    _id = $(this).data('id');
    _ltag = $(this).data('ltag');

    //$txtAmount.val(_amount);
    $modalEditltag.show();
  });

  $btnConfirmLoanTag.on("click", function(){
    var loanTagId = $selectLoanTag.val()
    
    $.ajax({
      url: "/api/v1/online_loan_applications/change_loan_tag",
      method: "POST",
      data: {
        id: _id,
        loan_tag: loanTagId,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.reload();
      }
    });

  })


  $btnAmount.on("click", function() {
    _id = $(this).data('id');
    _amount = $(this).data('amount');

    $txtAmount.val(_amount);
    $modalEditAmount.show();
  });

  $btnConfirmAmount.on("click", function(){
    $.ajax({
      url: "/api/v1/online_loan_applications/change_amount",
      method: "POST",
      data: {
        id: _id,
        amount: $txtAmount.val(),
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success!"); 
        window.location.reload();
      }
    });

  })
  
  $btnApprove.on("click", function() {
    _id = $(this).data('id');
    $modalApprove.show();
  });
  
  $btnConfirmApprove.on("click", function() {
  
  
    $btnConfirmForReview.prop("disabled", true); 
    $.ajax({
      url: "/api/v1/online_loan_applications/approve_loan",
      method: "POST",
      data: {
        id: _id,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success! Reloading..."); 
        window.location.href = "/online_loan_applications";
      }
    });
  });

  $btnForApprove.on("click", function() {
    _id = $(this).data('id');
    $modalForApprove.show();
  });

  $btnConfirmForApprove.on("click", function() {
    $btnConfirmForReview.prop("disabled", true); 
    $.ajax({
      url: "/api/v1/online_loan_applications/for_approve",
      method: "POST",
      data: {
        id: _id,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success! Reloading..."); 
        window.location.href = "/online_loan_applications";
      }
    });
  });

  $btnForReview.on("click", function() {
    _id = $(this).data('id');
    $modalForReview.show();
  });



  $btnVerify.on("click", function() {
    _id = $(this).data('id');
    $modalVerify.show();
  });
  
  $btnConfirmForReview.on("click", function() {
  
  
    $btnConfirmForReview.prop("disabled", true); 
    $.ajax({
      url: "/api/v1/online_loan_applications/for_review",
      method: "POST",
      data: {
        id: _id,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success! Reloading..."); 
        window.location.reload();

      }
    });
  });
  
  $btnConfirmVerify.on("click", function() {
  
    $btnConfirmVerify.prop("disabled", true); 
    $.ajax({
      url: "/api/v1/online_loan_applications/verify",
      method: "POST",
      data: {
        id: _id,
        authenticity_token: _authenticityToken

      },
      success: function(response) {
        alert("Success! Reloading..."); 
        window.location.reload();
      }
    });
  });
}

var init = function(options) {
  //_id                 = options.id;
  _authenticityToken  = options.authenticityToken;
  //_data               = options.data;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
