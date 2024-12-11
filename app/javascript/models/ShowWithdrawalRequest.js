import Mustache from "mustache";
import $ from "jquery";

var $btnPrintWithdrawalRequest;
var $modalPrint;

var id;
var templateErrorList;
var authenticityToken;

var $message;

var init  = function(options) {
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $btnPrintWithdrawalRequest  = $("#btn-print-withdrawal-request");
  $modalPrint                 = $("#modal-print");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnPrintWithdrawalRequest.on("click", function() {
    $message.html("");

    $modalPrint.show();

    var type = "withdrawal_request";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + id);
  });
};

export default { init: init }
