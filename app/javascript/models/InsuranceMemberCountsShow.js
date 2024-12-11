import Mustache from "mustache";
import $ from "jquery";

var id;
var authenticityToken;

var $dataTable;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $dataTable  = $(".data-table");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $dataTable.dataTable({
    fixedHeader: true
  });
}

var init  = function(config) {
  id                = config.id;
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
