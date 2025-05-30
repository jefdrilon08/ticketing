import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNewTransaction;
var $btnConfirmNewTransaction;
var $modalNewTransaction;
var $selectBranch;
var $selectCenter;
var $inputCollectionDate;
         
var $message;
var templateErrorList;

var _options;
var _authenticityToken;

var _urlFetchCenters  = "/api/v1/branches/fetch_centers";
var _urlSave          = "/api/v1/insurance_loan_bundle_enrollments/save";

var _cacheDom = function() {
  $btnNewTransaction        = $("#btn-new-transaction");
  $btnConfirmNewTransaction = $("#btn-confirm-new-transaction");
  $selectBranch             = $("#select-branch");
  $selectCenter             = $("#select-center");
  $inputCollectionDate      = $("#input-collection-date");
  $message                  = $(".message");
  templateErrorList         = $("#template-error-list").html();

  //$modalNewTransaction      = $("#modal-new-transaction");
  $modalNewTransaction = new bootstrap.Modal(
    document.getElementById("modal-new-transaction")
  )
};

var _bindEvents = function() {
  $btnConfirmNewTransaction.on("click", function() {
    var branchId          = $selectBranch.val();
    var centerId          = $selectCenter.val();
    var collectionDate    = $inputCollectionDate.val();

    $btnConfirmNewTransaction.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);
    $inputCollectionDate.prop("disabled", true);
    

    var data  = {
      branch_id: branchId,
      center_id: centerId,
      collection_date: collectionDate,
      authenticity_token: _authenticityToken
    };

    $.ajax({
      url: _urlSave,
      method: 'POST',
      data: data,
      success: function(response) {
        window.location.href = "/insurance_loan_bundle_enrollments/" + response.id;
      },
      error: function(response) {
        var errors  = [];

        try {
          console.log(response);
          errors = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          console.log(err);
          errors = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmNewTransaction.prop("disabled", false);
          $selectBranch.prop("disabled", false);
          $selectCenter.prop("disabled", false);
          $inputCollectionDate.prop("disabled", false);
          }
      }
    });
  });

  $btnNewTransaction.on("click", function() {
    $modalNewTransaction.show();
    $message.html("");
  });

  $selectBranch.on("change", function() {
    var branchId  = $(this).val();

    $.ajax({
      method: 'GET',
      url: _urlFetchCenters,
      data: {
        id: branchId
      },
      success: function(response) {
        var centers = response.centers; 
        
        $selectCenter.html("");
        for(var i = 0; i < centers.length; i++) {
          $selectCenter.append("<option value='" + centers[i].id + "'>" + centers[i].name + "</option>");
        }
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching centers");
      }
    });
  });
};

var init  = function(options) {
  _options            = options;
  _authenticityToken  = _options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };