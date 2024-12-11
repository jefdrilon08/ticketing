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

var branches  = [];

var urlBranches           = "/api/v1/branches";
var urlCreateTransaction  = "/api/v1/member_account_validations/generate_transaction";

var _authenticityToken;

var _cacheDom = function() {
  $btnNewTransaction        = $("#btn-new-transaction");
  $btnConfirmNewTransaction = $("#btn-generate-insurance-account-validation");
  //$modalNewTransaction      = $("#modal-new-transaction");
  $modalNewTransaction = new bootstrap.Modal(
    document.getElementById("modal-new-transaction")
  );

  $selectBranch         = $("#select-branch");
  $selectCenter         = $("#select-center");
  $inputCollectionDate  = $("#input-collection-date");

  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnNewTransaction.on("click", function() {
    $modalNewTransaction.show();
  });

  $btnConfirmNewTransaction.on("click", function() {
    var collectionDate  = $inputCollectionDate.val();
    var branchId        = $selectBranch.val();
    var centerId        = $selectCenter.val();

    $message.html(
      "Loading..."
    );

    $btnConfirmNewTransaction.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);
    $inputCollectionDate.prop("disabled", true);

    $.ajax({
      url: urlCreateTransaction,
      method: 'POST',
      data: {
        authenticity_token: _authenticityToken,
        date_prepared: collectionDate,
        branch_id: branchId,
        center_id: centerId
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.href="/member_account_validations/" + response.id;
      },
      error: function(response) {
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"]
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

  $selectBranch.on("change", function() {
    var branchId  = $(this).val();

    $selectCenter.html("");
    
    for(var i = 0; i < branches.length; i++) {
      if(branches[i].id == branchId) {
        for(var j = 0; j < branches[i].centers.length; j++) {
          $selectCenter.append(
            "<option value='" + branches[i].centers[j].id + "'>" + branches[i].centers[j].name + "</option>"
          );
        }
      }
    }
  });
};

var init  = function(config) {
  _authenticityToken  = config.authenticityToken;

  $.ajax({
    url: urlBranches,
    method: 'GET',
    success: function(response) {
      branches  = response.branches;
    },
    error: function(response) {
      console.log(response);
      alert("Error in fetching branches");
    }
  });

  _cacheDom();
  _bindEvents();
};

export default { init: init };