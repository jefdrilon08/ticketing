import Mustache from "mustache";
import $ from "jquery";

var memberSharesId;
var forMba;
var forCoop;

var $btnPrint;
var $modalPrint;
var $message;

var authenticityToken;

var _cacheDom = function() {
  $btnPrint   = $("#btn-print");
  $modalPrint = $("#modal-print");

  $message   = $(".message");
};

var _bindEvents = function() {
  $btnPrint.on("click", function() {
    $modalPrint.show();

    var id    = $(this).data("id");
    
    if (forCoop == true){
      var type  = "member_share";
    } else if(forMba == true){
      var type  = "member_share_for_mba"
    }

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + id);
  });
};

var init  = function(options) {
  authenticityToken = options.authenticityToken;
  memberSharesId    = options.id;
  forMba            = options.forMba
  forCoop           = options.forCoop
  _cacheDom();
  _bindEvents();
};

export default { init: init };
