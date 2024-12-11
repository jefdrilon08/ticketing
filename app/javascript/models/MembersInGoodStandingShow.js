import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
var $modalPrint;
var $printMessage;
var $btnPrintPdf;


var $btnPrint;
var loader;

var id;
var templateErrorList;
var authenticityToken;

var $message;

var _cacheDom = function() {

  $btnPrint         = $("#btn-print");
  $printMessage     = $(".print-message");
  $btnPrintPdf      =  $("#btn-print-pdf");

  
  //$modalPrint      = new bootstrap.Modal(
  //  document.getElementById("modal-print")

  //);


  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
  loader            = $("#template-loader").html();
};

var _bindEvents = function() {

  
 $btnPrintPdf.on("click", function() {
    var print_icpr = $btnPrintPdf.data('id');

    //$modalPrint.show();
    //$printMessage.html(
    //  Mustache.render(
    //    loader,
    //    {}
    //  )
    //);

    //$modalPrint.hide();
    window.open("/print?id=" + print_icpr + "&type=print_migs");
  });


};

var init  = function(options) {
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init }
