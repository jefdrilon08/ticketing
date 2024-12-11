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

var $startDate;
var $endDate;
var $selectBranch2;
var $midasType2;
var $btnGenMidasClosing;

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

  $selectBranch2        = $("#branch-select");
  $startDate            = $("#start-date");
  $endDate              = $("#end-date");
  $midasType2           = $("#midas-type-closing");
  $btnGenMidasClosing   = $("#c-btn-gen-midas");

  $selectBranch = $("#select-branch");
  $reportDate	  = $("#report-date");	
  $inputAsOf    = $("#input-as-of");
  $midasType	  = $("#midas-type");

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
  $btnGenMidasClosing.on("click",function(){
    var select_branch = $selectBranch2.val();
    var start_date = $startDate.val();
    var end_date = $endDate.val();
    var midas_type = $midasType2.val();

    var data = {
      branch: select_branch,
      start_date: start_date,
      end_date: end_date,
      midas_type: midas_type
    }

   console.log(data);

   window.location = "/excel_reports/midas_closing_report?" + encodeQueryData(data);


  });



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
