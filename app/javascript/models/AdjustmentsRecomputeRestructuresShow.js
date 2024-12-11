import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var options;
var recomputeRestructureId;
var authenticityToken;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnDelete;
var $modalDelete;
var $btnConfirmDelete;

var $btnPrint;
var $modalPrint;

var $message;
var templateErrorList;

var _urlApprove = "/api/v1/adjustments/recompute_restructures/approve";
var _urlPrint   = "#" //"/api/v1/print/generate_file";
var _urlDelete = "/api/v1/adjustments/recompute_restructures/destroy";

var _cacheDom = function() {
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $modalDelete = new bootstrap.Modal(
    document.getElementById("modal-delete")
  );


  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");

  $btnDelete         = $("#btn-delete");
  $btnConfirmDelete  = $("#btn-confirm-delete");
  
  $btnPrint   = $("#btn-print");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnPrint.on("click", function() {
    $modalPrint.show();

    $.ajax({
      url: "/api/v1/print/generate_file",
      method: 'POST',
      data: { 
        id: insuranceWithdrawalCollectionId,
        type: "insurance_withdrawal_collection",
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        $modalPrint.hide();
        window.open("/print?filename=" + response.filename, '_blank');
      },
      error: function(response) {
        $message.html("Error!");
      }
    });
  });

  $btnDelete.on("click", function(){
    $message.html("");
    $modalDelete.show();
  });

  $btnConfirmDelete.on("click", function() {
    $message.html("Loading...");
    $btnConfirmDelete.prop("disabled", true);

    $.ajax({
      url: _urlDelete,
      method: "POST",
      data: {
        id: recomputeRestructureId,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success!");
        window.location.href="/adjustments/recompute_restructures/";
      },
      error: function(response) {
        console.log(response);
        alert("Error in deleting record!");
        $message.html("");
        $btnConfirmDelete.prop("disabled", false);
      }
    });
  });

  $btnApprove.on("click", function() {
    $message.html("");
    $modalApprove.show();
  });
  

  $btnConfirmApprove.on("click", function() {
    $message.html("Loading...");
    $btnConfirmApprove.prop("disabled", true);

    $.ajax({
      url: _urlApprove,
      method: 'POST',
      dataType: 'json',
      data: {
        id: recomputeRestructureId,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmApprove.prop("disabled", false);
        }
      }
    });
  });
};

var init  = function(options) {
  recomputeRestructureId = options.id;
  authenticityToken   = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
