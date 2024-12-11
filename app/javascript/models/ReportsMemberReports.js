import Mustache from "mustache";
import $ from "jquery";

var $generateBtn;
var $downloadBtn;
var $memberReportsSection;
var $memberReportsTemplate;
var $memberStatus;
var $insuranceStatus;
var $memberType;
var branchId;
var $branchSelect;
var accountClass;
var $data;
var $startDate;
var $endDate;
var $message;

var memberReportsUrl  = "/api/v1/reports/member_reports";

var _cacheDom = function() {
  $generateBtn            = $("#generate-btn");
  $downloadBtn            = $("#download-btn");
  $memberReportsSection   = $("#reports-members-section");
  $memberReportsTemplate  = $("#reports-members-template").html();
  $memberStatus           = $("#member-status-select");
  $insuranceStatus        = $("#insurance-status-select");
  $memberType             = $("#member-type-select");
  $branchSelect           = $("#branch-select");
  $startDate              = $("#start-date");
  $endDate                = $("#end-date");
  $message                = $(".message");
}

var _loadDefaults = function() {
}

var _bindEvents = function() {

  $downloadBtn.on('click', function() {
    $downloadBtn.addClass('loading');
    $message.html("Loading...");

    branchId = $branchSelect.val();
    memberStatus = $memberStatus.val();
    insuranceStatus = $insuranceStatus.val();
    memberType = $memberType.val();
    var startDate  = $startDate.val();
    var endDate = $endDate.val();

    var params = {
      branch_id: branchId,
      status: memberStatus,
      insurance_status: insuranceStatus,
      member_type: memberType,
      start_date: startDate,
      end_date: endDate
    };

    $.ajax({
      url: memberReportsUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $message.html("Success!");
        $memberReportsSection.html(Mustache.render($memberReportsTemplate, data));
        
        $downloadBtn.removeClass('loading');

        tempUrl = data.download_url;
        window.open(tempUrl, '_blank');

        // Make sticky
        // $(".sticky").stickyTableHeaders();
      },
      error: function(data) {
        $message.html("Error...");
        toastr.error("Error in generating report for members");
        $downloadBtn.removeClass('loading');
      }
    });
  });

  $generateBtn.on('click', function() {
    $generateBtn.addClass('loading');
    $message.html("Loading...");
    
    var branchId        = $branchSelect.val();
    var memberStatus    = $memberStatus.val();
    var insuranceStatus = $insuranceStatus.val();
    var memberType      = $memberType.val();
    var startDate       = $startDate.val();
    var endDate         = $endDate.val();

    var params = {
      status: memberStatus,
      branch_id: branchId,
      insurance_status: insuranceStatus,
      member_type: memberType,
      start_date: startDate,
      end_date: endDate
    };

    $.ajax({
      url: memberReportsUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $message.html("Success!");
        $memberReportsSection.html(Mustache.render($memberReportsTemplate, data));

        $memberReportsSection.find(".curr").each(function() {
          $(this).html(numberWithCommas($(this).html()));
        });

        $generateBtn.removeClass('loading');

        // Make sticky
        // $(".sticky").stickyTableHeaders();
      },
      error: function(data) {
        $message.html("Error...");
        $generateBtn.removeClass('loading');
      }
    });
  });
}

var init = function() {
  _cacheDom();
  _loadDefaults();
  _bindEvents();
}

export default { init: init };
