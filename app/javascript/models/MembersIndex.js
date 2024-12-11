import Mustache from "mustache";
import * as bootstrap from "bootstrap";
import $ from 'jquery';
//import DataTable from "datatables.net";
//DataTable($);

var $branchSelect;
var $centerSelect;

var templateCenterOptions;

var _cacheDom = function() {
  $branchSelect = $("#branch-select");
  $centerSelect = $("#center-select");

  templateCenterOptions = $("#template-center-options").html();
};

var _bindEvents = function() {
  var branchId  = $branchSelect.val();
  if(branchId) {
    $.ajax({
      url: "/api/v1/branches/fetch_centers",
      method: 'GET',
      data: {
        id: branchId
      },
      success: function(response) {
        $centerSelect.html(
          Mustache.render(
            templateCenterOptions,
            response
          )
        );
      },
      error: function(response) {
        alert("Error in fetching centers");
      }
    });
  }

  $branchSelect.on("change", function() {
    var branchId  = $(this).val();

    if(branchId) {
      $.ajax({
        url: "/api/v1/branches/fetch_centers",
        method: 'GET',
        data: {
          id: branchId
        },
        success: function(response) {
          $centerSelect.html(
            Mustache.render(
              templateCenterOptions,
              response
            )
          );
        },
        error: function(response) {
          alert("Error in fetching centers");
        }
      });
    }
  });
};

var init  = function(options) {
  _cacheDom();
  _bindEvents();
};

export default { init: init }
