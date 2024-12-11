import $ from "jquery";

var $downloadBtn; 
var $startDate;
var $endDate;
var $brachSelect;

var _cacheDom = function() {
  $downloadBtn       = $("#download-btn");
  $startDate         = $("#start-date");
  $endDate           = $("#end-date");
  $brachSelect       = $("#branch-select");
};

var _bindEvents = function() {
  $downloadBtn.on('click', function() {
    var data = {
      start_date: $startDate.val(),
      end_date: $endDate.val(),
      branch: $brachSelect.val(),
    };

    window.location = "/reports/collections_blip_reports?" + encodeQueryData(data);
  });
};

var encodeQueryData = function(data) {
  var ret = []
  for(var d in data) {
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  }

  return ret.join("&");
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
