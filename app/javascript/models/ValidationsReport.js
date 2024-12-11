import Mustache from "mustache";
import $ from "jquery";

var $downloadBtn;
var $status;
var $startDate;
var $endDate;
var $brachSelect;
var authenticityToken;

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
      status: $status.val(),
      start_date: $startDate.val(),
      end_date: $endDate.val(),
      branch: $brachSelect.val(),
    };

    var newLocation = "/pages/validations_report?" + encodeQueryData(data);
    window.location = newLocation;
  });
};

var _cacheDom = function() {
  $downloadBtn       = $("#download-btn");
  $status            = $("#status");
  $startDate         = $("#start-date");
  $endDate           = $("#end-date");
  $brachSelect       = $("#branch-select");
};

var init = function(config) {
  authenticityToken  = config.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
