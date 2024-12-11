import $ from "jquery";

var $downloadBtn;
var $branchSelect;

var _cacheDom = function() {
  $downloadBtn       = $("#download-btn");
  $branchSelect      = $("#branch-select");
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
      branch: $branchSelect.val(),
    };

    window.location = "/reports/reclassified_report_excel?" + encodeQueryData(data);
  });
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
