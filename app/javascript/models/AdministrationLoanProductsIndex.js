import $ from "jquery";

var $btnUpload;
var $btnConfirmUpload;
var $modalUpload;

var $message;
var templateErrorList;

var authenticityToken;

var init  = function(config) {
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

var _cacheDom = function(config) {
  $btnUpload        = $("#btn-upload");
  $btnConfirmUpload = $("#btn-confirm-upload");
  $modalUpload      = $("#modal-upload");
}

var _bindEvents = function(config) {
  $btnUpload.on("click", function() {
    $message.html("");
    $modalUpload.show();
  });
}

export default { init: init };
