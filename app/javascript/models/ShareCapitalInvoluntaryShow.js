import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;
var $modalDetails;
var $modalSecond;
var $btnSecondLetter;
var $btnConfirmSecondLetter;
var $selectDate;
var $btnDetails;
var $btnPrintList;
var $modalPrintlist;
var $btnConfirm;
var $member_name;
var $currentMember = "";
var $currentMemberId= "";
let $loan_records = [];
let $savings_account = [];
let $equity_accounts = [];
let $insurance_accounts = [];
var errors;
var id;
var _cacheDom = function() {
  $modalDetails = new bootstrap.Modal(
    document.getElementById("modal-details")
  );
  
  $modalSecond = new bootstrap.Modal(
    document.getElementById("modal-second")
  );
  $selectDate = $("#as-of");
  $btnPrint = $(".btn-print-letter");
  $btnSecondLetter = $(".btn-second-letter");
  $btnConfirmSecondLetter = $(".btn-confirm-print-second");
  $member_name = $(".display-member");
  $btnConfirm = $(".btn-confirm");
  $btnPrintList  = $("#btn-print-list");
  $modalPrintlist = $("#modal-print");
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
  $printMessage       = $(".print-message");
  loader            = $("#template-loader").html();
  var id = _id;
}

var _bindEvents = function() {
  $btnSecondLetter.on("click",function(){
    $currentMember = $(this).data("member-name");
    $currentMemberId = $(this).data("member-id");
    $savings_account= $(this).data("savings-accounts");
    $loan_records = $(this).data("loan-records");
    $insurance_accounts = $(this).data("insurance-accounts");
    $equity_accounts = $(this).data("equity-accounts");
    $member_name.html($currentMember);
    $modalSecond.show();
  });

  $btnConfirmSecondLetter.on("click",function(){
      var data = {
      id: _id,
      member_id: $currentMemberId,
      savings_accounts: $savings_account,
      loan_records: $loan_records,
      insurance_accounts: $insurance_accounts,
      equity_accounts: $equity_accounts,
      as_of: $selectDate.val(),
      authenticity_token: authenticityToken
      }
      console.log(data);
      const dataStr = JSON.stringify(data);
      console.log(dataStr);
      $modalDetails.hide();
      window.open("/print?data="+ encodeURIComponent(dataStr) + "&type=print_second_share_capital_involuntary_letter");
  });


  $btnPrintList.on("click", function(){
    var print_list_id = $btnPrintList.data('id');
    console.log(print_list_id);
    $modalPrintlist.show();
    $printMessage.html(
      Mustache.render(
        loader,
        {}
      )
    );

    $modalPrintlist.hide();
    window.open("/print?id=" + print_list_id + "&type=share_capital_involuntary_letter_list");
    
  });

	$btnPrint.on("click", function() {
    $currentMember = $(this).data("member-name");
    $currentMemberId = $(this).data("member-id");
    $savings_account= $(this).data("savings-accounts");
    $loan_records = $(this).data("loan-records");
    $insurance_accounts = $(this).data("insurance-accounts");
    $equity_accounts = $(this).data("equity-accounts");
    $member_name.html($currentMember);
    $modalDetails.show();
	});

  $btnConfirm.on("click", function() {
   
    var data = {
      id: _id,
      member_id: $currentMemberId,
      savings_accounts: $savings_account,
      loan_records: $loan_records,
      insurance_accounts: $insurance_accounts,
      equity_accounts: $equity_accounts,
      authenticity_token: authenticityToken
    }
    const dataStr = JSON.stringify(data);
    console.log(dataStr);
    $modalDetails.hide();
    window.open("/print?data="+ encodeURIComponent(dataStr) + "&type=print_share_capital_involuntary_letter");


  })






 
}

var init  = function(config) {
  authenticityToken = config.authenticityToken;
  _id = config.id;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
