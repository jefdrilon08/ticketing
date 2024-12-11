import Mustache from "mustache";
import $ from "jquery";

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
  $printMessage       = $(".print-message");
  $btnPrintPdf      =  $("#btn-print-pdf");

  $modalPrint         = $("#modal-print");


  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
  loader            = $("#template-loader").html();
};

var _bindEvents = function() {

  
 $btnPrintPdf.on("click", function() {
    var print_mi = $btnPrintPdf.data('id');

    $modalPrint.show();
    $printMessage.html(
      Mustache.render(
        loader,
        {}
      )
    );

    $modalPrint.hide();
    window.open("/print?id=" + print_mi + "&type=print_monthly_incentives");
  });


};

var init  = function(options) {
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init }
