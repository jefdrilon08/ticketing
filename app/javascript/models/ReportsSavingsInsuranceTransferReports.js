import $ from "jquery";

var $btnExcel;
var $filterStartDate;
var $filterEndDate;
var $branchSelect;
var $savingsSubtype;
var $insuranceSubtype;
var $paymentSubtype;      

var _cacheDom = function() {
  $btnExcel          = $("#btn-excel");
  $branchSelect      = $("#branch-select");
  $savingsSubtype    = $("#savings-subtype");
  $insuranceSubtype  = $("#insurance-subtype");
  $paymentSubtype    = $("#payment-subtype");
  $filterStartDate   = $("#filter-start-date");
  $filterEndDate     = $("#filter-end-date");
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
      start_date: $filterStartDate.val(),
      end_date: $filterEndDate.val(),
      savings_subtype: $savingsSubtype.val(),
      insurance_subtype: $insuranceSubtype.val(),
      payment_subtype: $paymentSubtype.val(),
      status: $status.val()
    };

    window.location = "/reports/savings_insurance_transfer_reports_excel?" + encodeQueryData(data);
  });    
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
