import $ from "jquery";

var $providerCode; 
var $downloadBtn;     
var $startDate;      
var $endDate;        

var _cacheDom = function() {
  $providerCode      = $("#provider-code");
  $downloadBtn       = $("#download-btn");
  $startDate         = $("#start-date");
  $endDate           = $("#end-date");
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
      start_date: $startDate.val(),
      end_date: $endDate.val(),
      provider_code: $providerCode.val(),
    };

    window.location = "/reports/cic_reports?" + encodeQueryData(data);
  });
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };