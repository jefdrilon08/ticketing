import $ from "jquery";

var $btnExcel;
var $StartDate;
var $EndDate;
var $ApprovalDateFrom;
var $ApprovalDateTo;
var status;
var $branchSelect;

var _cacheDom = function() {
  $btnExcel          = $("#btn-excel");
  $branchSelect      = $("#branch-select");
  $StartDate         = $("#start-date");
  $EndDate           = $("#end-date");
  $ApprovalDateFrom  = $("#approval-date-from");
  $ApprovalDateTo    = $("#approval-date-to");
  $status            = $("#status");
}

var encodeQueryData = function(data) {
  var ret = []
  for(var d in data) {
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  }

  return ret.join("&");
};

var _bindEvents = function() {
  $btnExcel.on('click', function() {
    var data = {
      branch_id: $branchSelect.val(),
      start_date: $StartDate.val(),
      end_date: $EndDate.val(),
      approval_date_from: $ApprovalDateFrom.val(),
      approval_date_to: $ApprovalDateTo.val(),
      status: $status.val()
    };

    console.log($StartDate)

    window.location = "/reports/insurance_loan_bundle_reports_excel?" + encodeQueryData(data);
  });    
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
