import Mustache from "mustache";
import $ from "jquery";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;
var $btnGenMidas;

var $selectBranch;
var $reportDate;
var $inputAsOf;
var $midasType;

var $message;
var templateErrorList;

var _urlQueue;
var _userId;
var _xKoinsAppAuthSecret;
var _urlGenerate        = "/api/v1/midas/generate";


var _cacheDom = function() {
  $modalNew      = $("#modal-new");
  $btnNew        = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");
  $btnGenMidas   = $("#btn-gen-midas");

  $selectBranch = $("#select-branch");
  $reportDate	= $("#report-date");	
  $inputAsOf    = $("#input-as-of");
  $midasType	= $("#midas-type");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}
var encodeQueryData = function(data) {
  var ret = []
  for(var d in data) {
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  }

  return ret.join("&");
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

   $btnGenMidas.on("click", function() {
	var branchId   = $selectBranch.val();
	var reportDate = $reportDate.val();
	var midasType  = $midasType.val();
	
	var data = {
		branchId: branchId,
		reportDate: reportDate,
		midasType: midasType
	}	
	window.location = "/excel_reports/excel_report?" + encodeQueryData(data);

  });


}

var init  = function(config) {
  authenticityToken = config.authenticityToken;
  _urlQueue             = config.urlQueue;
  _userId               = config.userId;
  _xKoinsAppAuthSecret  = config.xKoinsAppAuthSecret;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
