import Mustache from "mustache";
import $ from "jquery";

var options;
var id;
var authenticityToken;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnPrint;
var $modalPrint;

var $message;
var templateErrorList;

var _urlApprove = "/api/v1/equity_withdrawal_collections/approve";
var _urlPrint   = "/api/v1/print/generate_file";

var _cacheDom = function() {
  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  $modalApprove       = $("#modal-approve");

  $btnPrint   = $("#btn-print");
  $modalPrint = $("#modal-print");

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
        id: id,
        type: "equity_withdrawal_collection",
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
        id: id,
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
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init }
