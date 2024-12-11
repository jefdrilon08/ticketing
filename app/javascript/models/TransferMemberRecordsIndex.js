import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;
var errors;
var $selectBranch;
var $selectBranchToTransfer;
var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  )
  $btnNew           = $("#btn-new");
  $btnConfirmNew    = $("#btn-confirm-new");
  $selectBranch     = $("#select-branch");
  $selectBranchToTransfer = $("#select-branch-to-transfer");
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var selectBranchToTransferId = $selectBranchToTransfer.val();
    var branchId  = $selectBranch.val();

    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectBranchToTransfer.prop("disabled", true);
    $selectBranch.prop("disabled", true);

    var data  = {
      
      branch_id: branchId,
      branch_id_to_transfer: selectBranchToTransferId,
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: "/api/v1/transfer_member_records/create",
      method: 'POST',
      data: data,
      success: function(response) {
        window.location.href="/transfer_member_records";
      },
      error: function(response) {
        errors = [];

        try {
          errors = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          console.log(response);
          errors.push("Something went wrong");
        }

        $message.html(
          Mustache.render(
            templateErrorList,
            { errors: errors }
          )
        );

        $btnConfirmNew.prop("disabled", false);
        $selectYear.prop("disabled", false);
        $selectBranch.prop("disabled", false);
      }
    });
  });
}

var init  = function(config) {
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
