import $ from "jquery";

var $btnPrint;
var $btnDownloadCsv;
var $filterStartDate;
var $filterEndDate;
var $filterLoanStatus;
var $branchSelect;

var _cacheDom = function() {
  $btnPrint          = $("#btn-print");
  $btnDownloadCsv    = $("#btn-download-csv") 
  $filterStartDate   = $("#filter-start-date");
  $filterEndDate     = $("#filter-end-date");
  $filterLoanStatus  = $("#filter-loan-status");
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
  $btnPrint.on('click', function() {
    var data = {
      start_date: $filterStartDate.val(),
      end_date: $filterEndDate.val(),
      branch_id: $branchSelect.val(),
      loan_status: $filterLoanStatus.val(),
    };

    window.location = "/reports/print_insured_loans?" + encodeQueryData(data);
  });
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
