import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnPrint;
var $modalPrint;
var $printMessage;
var loader;

var _cacheDom = function() {
  $btnPrint           = $('#btn-print-sc');
  $modalPrint         = $("#modal-print");
  $printMessage       = $(".print-message");
  loader            = $("#template-loader").html();
};

var _bindEvents = function() {
  $btnPrint.on("click", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const branchId = urlParams.get('branch_id');
    const centerId = urlParams.get('center_id');
    const startDate = urlParams.get('start_date');
    const endDate = urlParams.get('end_date');

    window.open("/print?type=print_share_certificate&branch_id="+branchId+"&center_id="+centerId+"&start_date="+startDate+"&end_date="+endDate);

    // wait to load the page
    window.onload = function() {
      // Your code here
      // var adjustment_record = $btnPrint.data('id');
      $modalPrint.show();
      $printMessage.html(
        Mustache.render(
          loader,
          {}
        )
      );

      $modalPrint.hide();
      };
  });
};

var init  = function(options) {
  _authenticityToken  = options.authenticityToken; 
  _id                 = options.id;

  _cacheDom();
  _bindEvents();
};

export default { init: init };