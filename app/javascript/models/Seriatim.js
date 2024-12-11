import Mustache from "mustache";
import $ from "jquery";

var $downloadBtn;
var $asOf;
var $brachSelect;

var authenticityToken;

var _cacheDom = function() {
  $downloadBtn       = $("#download-btn");
  $asOf              = $("#as-of");
  $brachSelect       = $("#branch-select");
};

var encodeQueryData = function(data) {
  var ret = []
  for(var d in data) {
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  }

  return ret.join("&");
};

var _bindEvents = function() {
  $downloadBtn.on('click', function() {
    var data = {
      authenticity_token: authenticityToken,
      as_of: $asOf.val(),
      branch: $brachSelect.val(),
    };

    window.location = "/pages/seriatim_report?" + encodeQueryData(data);
  });
};

var init = function(config) {
  authenticityToken  = config.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
