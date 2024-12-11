import Mustache from "mustache";
import $ from "jquery";

var $btnPrint;
var $inputStartDate;
var $inputEndDate;
var $selectBranch;
var $selectAccountingFund;
var $modalPrint;
var $message;
var $btndownload;
var book;
var authenticityToken;

var _urlPrint = "/api/v1/print/generate_file";
var _urlDownload = "/books/excel";
var _cacheDom = function() {
  $btnPrint               = $("#btn-print");
  $inputStartDate         = $("#input-start-date");
  $inputEndDate           = $("#input-end-date");
  $selectBranch           = $("#select-branch");
  $selectAccountingFund   = $("#select-accounting-fund");
  $modalPrint             = $("#modal-print");
  $message                = $(".message");
  $btndownload            = $("#btn-download")
};

var _bindEvents = function() {
    

  $btndownload.on("click", function() {
    var startDate         = $inputStartDate.val();
    var endDate           = $inputEndDate.val();
    var branchId          = $selectBranch.val();
    var accountingFundId  = $selectAccountingFund.val();

    if(!startDate) {
      alert("Start date required");
    }

    if(!endDate) {
      alert("End date required");
    }

    $.ajax({
      url: _urlDownload,
      method: 'GET',
      data: {
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        book: book,
        accounting_fund_id: accountingFundId,
        type: "book",
        authenticity_token: authenticityToken
      },
      dataType: 'json',
      success: function(response) {
        window.open(response.download_url, '_blank');
      },
      error: function(response) {
        $message.html("Error!");
      }
    });
  });

  $btnPrint.on("click", function() {
    var type              = "book";
    var startDate         = $inputStartDate.val();
    var endDate           = $inputEndDate.val();
    var branchId          = $selectBranch.val();
    var accountingFundId  = $selectAccountingFund.val();
    
    if(!startDate) {
      alert("Start date required");
    }

    if(!endDate) {
      alert("End date required");
    }

    $modalPrint.show();
    $message.html("Printing...");

    $modalPrint.hide();
    window.open("/print?type=" + type + "&start_date=" + startDate + "&end_date=" + endDate + "&branch_id=" + branchId + "&accounting_fund_id=" + accountingFundId + "&book=" + book);
  });

 
}

var init  = function(options) {
  authenticityToken = options.authenticityToken;
  book              = options.book;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
