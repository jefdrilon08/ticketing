import Mustache from "mustache";
import $ from "jquery";

var $btnNewTransaction;
var $btnConfirmNewTransaction;
var $modalNewTransaction;

var $selectBranch;
var $inputCollectionDate;

var $message;

var templateErrorList;

var branches  = [];

var urlBranches                             = "/api/v1/branches";
var urlCreateEquityWithdrawalCollection     = "/api/v1/equity_withdrawal_collections";

var _authenticityToken;

var _cacheDom = function() {
  $btnNewTransaction        = $("#btn-new-transaction");
  $btnConfirmNewTransaction = $("#btn-confirm-new-transaction");
  $modalNewTransaction      = $("#modal-new-transaction");

  $selectBranch         = $("#select-branch");
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

    $btnConfirmNewTransaction.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $inputCollectionDate.prop("disabled", true);

    $.ajax({
      url: urlCreateEquityWithdrawalCollection,
      method: 'POST',
      data: {
        authenticity_token: _authenticityToken,
        collection_date: collectionDate,
        branch_id: branchId
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.href="/equity_withdrawal_collections/" + response.id;
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
          $inputCollectionDate.prop("disabled", false);
        }
      }
    });
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
