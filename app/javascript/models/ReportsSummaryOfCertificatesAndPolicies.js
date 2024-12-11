import Mustache from "mustache";
import $ from "jquery";

var $searchBtn;
var $downloadBtn;
var $memberReportsSection;
var $memberReportsTemplate;
var $planType;
var branchId;
var $branchSelect;
var $data;
var $asOf;
var $summaryOfCertificatesAndPoliciesSection;
var $summaryOfCertificatesAndPoliciesTemplate;
var summaryOfCertificatesAndPoliciesUrl  = "/api/v1/reports/summary_of_certificates_and_policies";

var _cacheDom = function() {
  $searchBtn                                = $("#search-btn");
  $downloadBtn                              = $("#download-btn");
  $summaryOfCertificatesAndPoliciesSection  = $("#reports-summary-of-certificates-and-policies-section");
  $summaryOfCertificatesAndPoliciesTemplate = $("#reports-summary-of-certificates-and-policies-template").html();
  $planType                                 = $("#plan-type-select");
  $branchSelect                             = $("#branch-select");
  $asOf                                     = $("#as-of");
}

var _bindEvents = function() {
  $searchBtn.on('click', function() {
    $searchBtn.addClass('loading');  
    
    var branchId  = $branchSelect.val();
    var planType  = $planType.val();
    var asOf      = $asOf.val();

    var params = {
      branch_id: branchId,
      plan_type: planType,
      as_of: asOf
    };

    $.ajax({
      url: summaryOfCertificatesAndPoliciesUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $summaryOfCertificatesAndPoliciesSection.html(Mustache.render($summaryOfCertificatesAndPoliciesTemplate, data));

        $summaryOfCertificatesAndPoliciesSection.find(".curr").each(function() {
          $(this).html(numberWithCommas($(this).html()));
        });

        toastr.info("Generating Summary Of Certificates And Policies");
        $searchBtn.removeClass('loading');

        // Make sticky
        $(".sticky").stickyTableHeaders();
      },
      error: function(data) {
        toastr.error("Error in generating report for Summary Of Certificates And Policies");
        $searchBtn.removeClass('loading');
      }
    });
  });
}

var init = function() {
  _cacheDom();
  _bindEvents();
}

export default { init: init };
