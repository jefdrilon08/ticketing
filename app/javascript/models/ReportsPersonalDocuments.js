import $ from "jquery";

var $downloadBtn; 
var $startDate;       
var $endDate;         
var $branchSelect;
var $insuranceStatusSelect;

var _cacheDom = function() {
  $downloadBtn            = $("#download-btn");
  $startDate              = $("#start-date");
  $endDate                = $("#end-date");
  $branchSelect           = $("#branch-select");
  $insuranceStatusSelect  = $("#insurance-status-select");

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
      end_date: $endDate.val(),
      start_date: $startDate.val(),
      branch: $branchSelect.val(),
      insurance_status: $insuranceStatusSelect.val(),
    };

    window.location = "/reports/personal_document_reports?" + encodeQueryData(data);
  });
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
