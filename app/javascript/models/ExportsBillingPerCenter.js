import $ from "jquery";
var $center;
var $btnDownload;

var urlExportBillingPerCenter = "/exports/billing_per_center";

var encodeQueryData = function(data) {
  var ret = []
  for(var d in data) {
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  }

  return ret.join("&");
};

var init  = function() {
  $center       = $("#select-center");
  $btnDownload  = $("#download-btn");

  $btnDownload.on('click', function() {
    var params    = {
      center_id: $center.val()
    }

    window.location = urlExportBillingPerCenter + "?" + encodeQueryData(params);
  });
};

export default { init: init };
