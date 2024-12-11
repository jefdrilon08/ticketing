import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";


var _authenticityToken;
var _id;

var $btnPrint;


var $message;
var $modalPrint;
var loader;

var _urlPrint = "/api/v1/repayment_rates/print"

var _cacheDom = function() {

$btnPrint         = $("#btn-print");
}

var _bindEvents = function () {
$btnPrint.on("click", function() {
  var data_store = $btnPrint.data('id');
  alert("sample");
  
    
  }); 
}

var init  = function(config) {
  _authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };