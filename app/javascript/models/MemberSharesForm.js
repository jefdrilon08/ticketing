import Mustache from "mustache";
import $ from "jquery";

var options;
var memberSharesId;
var recognitionDate;
var identificationNumber;
var authenticityToken;

var $certificateFor;
var $certificateNumber;
var $dateOfIssue;

var _cacheDom = function() {
  $certificateFor                  = $("#certificate-for");
  $certificateNumber               = $("#certificate-number");
  $dateOfIssue                     = $("#date-of-issue");

};

var _bindEvents = function() {
  $certificateFor.on('change', function() { 
    var cFor = $certificateFor.val();
    if (cFor == "KMBA"){
      $('#certificate-number').val(identificationNumber);
      $('#date-of-issue').val(recognitionDate);
    } else{
      $('#certificate-number').val('');
      $('#date-of-issue').val('');
    }
  }); 
}

var init = function(options) {
  authenticityToken    = options.authenticityToken;
  memberSharesId       = options.id;
  identificationNumber = options.identificationNumber
  recognitionDate      = options.recognitionDate

  _cacheDom();
  _bindEvents();
}

export default { init: init };
