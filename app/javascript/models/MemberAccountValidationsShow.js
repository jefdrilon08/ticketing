import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnApprove;
var $btnReverse;
var $btnValidate;
var $btnCheck;
var $btnCancel;

var $btnApproveConfirmation;
var $btnApproveValidate;
var $btnCancelApproval;     
var $btnCancelValidate;
var $btnApproveCheck;
var $btnCancelCheck;
var $btnApproveCancellation;
var $btnCancelCancellation;

var $btnReverseConfirmation;
var $btnCancelReverse;

var $errors;
var $errorsTemplate;
var urlApproveTransaction             = "/api/v1/member_account_validations/approve";
var urlReverseTransaction             = "/api/v1/member_account_validations/reverse";
var urlValidateTransaction            = "/api/v1/member_account_validations/validate";
var urlCheckTransaction               = "/api/v1/member_account_validations/check";
var urlCancelTransaction              = "/api/v1/member_account_validations/cancel";

var $modalApprove;
var $modalValidate;
var $modalCheck;
var $modalCancel;
var $modalReverse;
var $errors;
var $errorsTemplate;
var $modalErrorsApproval;
var $modalErrorsReverse;
var $modalErrorsValidate;
var $modalErrorsCheck;
var $modalErrorsCancel;
var $modalSuccessApproval;
var $modalSuccessReverse;
var $modalControls;
var $successTemplate;

var $confirmationModal;

var $message;
var templateErrorList;

var authenticityToken;
var memberAccountValidationId;

var _bindEvents = function() {

  // Validate
  $btnApproveValidate.on("click", function() {
    $btnApproveValidate.prop("disabled", true);

    $.ajax({
      url: urlValidateTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: memberAccountValidationId,
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

          $btnApproveValidate.prop("disabled", false);
        }
      }
    });
  });

  // Check
  $btnApproveCheck.on("click", function() {
    $btnApproveCheck.prop("disabled", true);

    $.ajax({
      url: urlCheckTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: memberAccountValidationId,
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

          $btnApproveCheck.prop("disabled", false);
        }
      }
    });
  });

  // Cancel
  $btnApproveCancellation.on("click", function() {
    $btnApproveCancellation.prop("disabled", true);

    $.ajax({
      url: urlCancelTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: memberAccountValidationId,
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

          $btnApproveCancellation.prop("disabled", false);
        }
      }
    });
  });

  // Approve
  $btnApproveConfirmation.on("click", function() {
    $btnApproveConfirmation.prop("disabled", true);

    $.ajax({
      url: urlApproveTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: memberAccountValidationId,
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

          $btnApproveConfirmation.prop("disabled", false);
        }
      }
    });
  });


  // check
  $btnCheck.on("click", function() {
    $modalCheck.show();
    $message.html("");
  });

  // validate
  $btnValidate.on("click", function() {
    $modalValidate.show();
    $message.html("");
  });

  // Approve
  $btnApprove.on("click", function() {
    $modalApprove.show();
    $message.html("");
  });

  // Cancel
  $btnCancel.on("click", function() {
    $modalCancel.show();
    $message.html("");
  });

  $btnReverseConfirmation.on('click', function() {
    if(!$btnReverseConfirmation.hasClass('loading')) {
      _addLoadingToConfirmationBtns();
      $.ajax({
        url:  urlReverseTransaction,
        method: 'POST',
        dataType: 'json',
        data: { id: memberAccountValidationId },
        success: function(responseContent) {
          $modalSuccessReverse.html(Mustache.render($successTemplate.html(), { messages: ["Successfully reversed transaction"] }));
          $modalControls.hide();
          window.location.href = "/member_account_validations/" + memberAccountValidationId;
        },
        error: function(responseContent) {
          var errorMessages = JSON.parse(responseContent.responseText).errors;
          console.log(errorMessages);
          $modalErrorsReverse.html(Mustache.render($errorsTemplate.html(), { errors: errorMessages }));
          toastr.error("Something went wrong when trying to reverse transaction");
          _removeLoadingToConfirmationBtns();
        }
      });
    } else {
      toastr.error("Still loading");
    }
  });

  $btnCancelReverse.on('click', function() {
    if($btnCancelReverse.hasClass('loading')) {
      toastr.info("Still loading");
    } else {
      $modalReverse.close();
    }
  });

  $btnReverse.on('click', function() {
    $modalSuccessApproval.html("");
    $modalErrorsReverse.html("");
    $modalReverse.open();
  });
}

var _cacheDom = function() {
  $confirmationModal           = $("#confirmation-modal"); 
  $btnApprove                  = $("#btn-approve");
  $btnValidate                 = $("#btn-validate");
  $btnCheck                    = $("#btn-check");
  $btnCancel                   = $("#btn-cancel");
  $btnReverse                  = $("#btn-reverse");
  $btnCancelApproval           = $("#btn-cancel-approval");
  $btnCancelValidate           = $("#btn-cancel-validate");
  $btnCancelCheck              = $("#btn-cancel-check");
  $btnCancelCancellation       = $("#btn-cancel-cancellation");
  $btnReverseConfirmation      = $("#btn-confirm-reversal");
  $btnCancelReverse            = $("#btn-cancel-reversal");
  $btnApproveConfirmation      = $("#btn-confirm-approval");
  $btnApproveValidate          = $("#btn-confirm-validate");
  $btnApproveCheck             = $("#btn-confirm-check");
  $btnApproveCancellation      = $("#btn-confirm-cancellation");
  $errors                      = $("#errors");
  $errorsTemplate              = $("#errors-template");
  
  $modalValidate               = new bootstrap.Modal(
    document.getElementById("modal-validate-confirmation")
  );
  
  // Validate
  $modalCheck = new bootstrap.Modal(
    document.getElementById("modal-check-confirmation")
  )

  $modalCancel = new bootstrap.Modal(
    document.getElementById("modal-cancel-confirmation")
  )

  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve-confirmation")
  )


  $modalErrorsApproval          = $(".modal-approve").find(".errors");
  $modalErrorsReverse           = $(".modal-reverse").find(".errors");
  $modalErrorsValidate          = $(".modal-validate").find(".errors");
  $modalErrorsCheck             = $(".modal-check").find(".errors");
  $modalErrorsCancel            = $(".modal-cancel").find(".errors"); 
  $modalSuccessApproval         = $(".modal-approve").find(".success");
  $modalSuccessReverse          = $(".modal-reverse").find(".success");
  $modalControls                = $(".modal-controls");
  $successTemplate              = $("#success-template");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var init = function(options) {
  authenticityToken         = options.authenticityToken;
  memberAccountValidationId = options.id;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
