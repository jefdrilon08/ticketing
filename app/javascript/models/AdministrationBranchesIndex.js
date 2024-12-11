import $ from "jquery";
import DataTable from "datatables.net";
//DataTable($);

var $dataTable;

var init  = function() {
  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $dataTable  = $("#data-table");
};

var _bindEvents = function() {
  /*
  $dataTable.DataTable({
    fixedHeader: true
  });
  */
};

export default { init: init };
