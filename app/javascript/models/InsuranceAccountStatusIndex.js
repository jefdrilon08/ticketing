import Mustache from "mustache";
import $ from "jquery";

var $downloadBtn;
var $branchSelect;
var $insuranceStatusSelect;
var $generateBtn;

var insuranceAccountStatusReportUrl  = "/api/v1/pages/insurance_account_status_reports";
var branch;
var $insuranceAccountStatusReportTemplate;
var $insuranceAccountStatusReportSection;

var _cacheDom = function() {
  $generateBtn = $("#generate-btn");
  $downloadBtn = $("#download-btn");
  $insuranceAccountStatusReportTemplate = $("#insurance-account-status-report-template").html();
  $insuranceAccountStatusReportSection   = $("#insurance-account-status-report-section");
  $branchSelect = $("#branch-select");
  $insuranceStatusSelect = $("#insurance-status-select");
}

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
      insurance_status: $insuranceStatusSelect.val(),
    };

    window.location = "/pages/daily_report_insurance_account_status_excel?" + encodeQueryData(data);
  });

  $generateBtn.on('click', function() {
    $generateBtn.addClass('loading');
    branch = $branchSelect.val();

    var params = {
      branch: branch,
      insurance_status: $insuranceStatusSelect.val(),
    };

    $.ajax({
      url: insuranceAccountStatusReportUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $insuranceAccountStatusReportSection.html(Mustache.render($insuranceAccountStatusReportTemplate, data));

        $insuranceAccountStatusReportSection.find(".curr").each(function() {
          $(this).html(numberWithCommas($(this).html()));
        });

        $generateBtn.removeClass('loading');
      },
      error: function(data) {
        $generateBtn.removeClass('loading');
      }
    });
  });
};


var init = function(config) {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
