import $ from "jquery";

var $btnExcel;
var $filterStartDate;
var $filterEndDate;
var $branchSelect      

var _cacheDom = function() {
  $btnExcel          = $("#btn-excel");
  $filterStartDate   = $("#filter-start-date");
  $filterEndDate     = $("#filter-end-date");
  $branchSelect      = $("#branch-select");
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
      end_date: $filterEndDate.val()
    };

    window.location = "/reports/download_excel_insurance_interest?" + encodeQueryData(data);
  });    
};

var init = function() {
  _cacheDom();
  _bindEvents();
};

export default { init: init };
