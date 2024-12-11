import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import "pdfmake/build/pdfmake"
const pdfMake = window["pdfMake"];
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import LoanFormDocumentBuilder from './LoanFormDocumentBuilder.js';

var _data;

var $message;

var templateErrorList;

var $btnApproveReverseLoan;
var $btnDeleteReverseLoan;
var $btnAddParticular;
var $txtReverseReason;
var $modalApproveReverseLoan;
var $btnConfirmReverseLoan;
//var $btnConfirmReverseLoan;
//var $modalReverseLoan;

//var _urlApproveReverse               = "/api/v1/loans/reage";
var _urlReverse               = "/api/v1/loans/reverse_loan_reason";
var _urlConfirmReverse        = "/api/v1/loans/reverse_approve_loan_reason";

var _id;
var _authenticityToken;

var _cacheDom = function() {
  $message          = $(".message");

  $btnApproveReverseLoan  = $("#btn-approve-reverse-loan");
  $btnDeleteReverseLoan   = $("#btn-delete-reverse-loan");
  $btnAddParticular       = $("#btn-add-particular");
  $txtReverseReason       = $("#reverse-reason");

  
  $modalApproveReverseLoan = new bootstrap.Modal(document.getElementById("modal-approve-reverse-loan"));
  $btnConfirmReverseLoan = $("#btn-confirm-approve-reverse-loan");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  
  $btnApproveReverseLoan.on("click", function() {
    //alert("jayson");
    $modalApproveReverseLoan.show();
   // $txtReverseReason.val();
  });
  
  $btnConfirmReverseLoan.on("click", function(){
  
    _id =  $(this).data("loan-id");
    $.ajax({
      url: _urlConfirmReverse,
      method: 'POST',
      data: {
        id: _id,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href = "/loans/" + _id;
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).errors.full_messages;
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

        }
      }
    });
    
  });

  $btnAddParticular.on("click", function() {
    
    _id =  $(this).data("loan-id");
    $.ajax({
      url: _urlReverse,
      method: 'POST',
      data: {
        id: _id,
        reason_details: $txtReverseReason.val(),
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).errors.full_messages;
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

        }
      }
    });
  });


  

  








};

var init  = function(config) {
  _id                 = config.id;
  _authenticityToken  = config.authenticityToken;
  _data               = config.data;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
