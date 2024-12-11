import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnConfirmApprove;
var $btnConfirmPost;
var $btnConfirmCheck;
var $btnConfirmProceed;
var $btnConfirmDeclined;
var $btnConfirmPending;

var $btnSaveNote;

var $btnApprove;
var $btnPost;
var $btnCheck;
var $btnProceed;
var $btnDeclined;
var $btnPending;

var $btnNote;
var $inputNote;
var $inputDeclinedNote;

var $btnConfirmBook;

var $errors;
var $errorsTemplate;
var urlApproveTransaction     = "/api/v1/claims/approve";
var urlPostTransaction        = "/api/v1/claims/post";
var urlCheckTransaction       = "/api/v1/claims/check";
var urlProceedTransaction     = "/api/v1/claims/proceed";
var urlDeclinedTransaction    = "/api/v1/claims/declined";
var urlPendingTransaction     = "/api/v1/claims/pending";
var urlModifyClaimsTemplate   = "/api/v1/claims/modify_claims_template";
var urlModifyBook             = "/api/v1/claims/modify_book";
var urlModifyParticular       = "/api/v1/claims/modify_particular";
var urlSaveCheckNumber        = "/api/v1/claims/save_check_number";
var urlSaveCheckVoucherNumber = "/api/v1/claims/save_check_voucher_number";
var urlSavePayee              = "/api/v1/claims/save_payee";
var urlSaveNote               = "/api/v1/claims/save_note";
var urlSaveDatePaid           = "/api/v1/claims/save_date_paid";
var urlAddTransactionFee      = "/api/v1/claims/add_transaction_fee";

var $modalApprove;
var $modalCheck;
var $modalProceed;
var $modalDeclined;
var $modalPost;
var $modalPending;

var $modalNote;

var $errors;
var $errorsTemplate;
var $modalErrorsApproval;
var $modalErrorsChecking;
var $modalErrorsProceeding;
var $modalErrorsDeclining;
var $modalErrorsPosting;
var $modalErrorsPending;
var $modalSuccessApproval;
var $modalSuccessChecking;
var $modalSuccessProceeding;
var $modalSuccessDeclining;
var $modalSuccessPosting;
var $modalSuccessPending;
var $modalControls;
var $successTemplate;

var $confirmationModal;

var $message;
var templateErrorList;

var authenticityToken;
var claimId;

var $selectClaimsTemplate;
var $btnConfirmBook;

var $selectBook;
var $btnConfirmClaimsTemplate;

var $inputTextParticular;
var $btnConfirmParticular;

var $btnConfirmTransactionFee;
var $inputTextTransactionFee;

var $inputTextPayee;
var $btnConfirmPayee;

var $inputTextCheckNumber;
var $btnConfirmCheckNumber;

var $inputTextCheckVoucherNumber;
var $btnConfirmCheckVoucherNumber;

var $inputDatePaid;
var $btnConfirmDatePaid;

var $btnPrint;
var $btnDailyReport;

var $modalPrint;
var $printMessage;

var loader;

var _bindEvents = function() {

  // Check
  $btnConfirmCheck.on("click", function() {
    $btnConfirmCheck.prop("disabled", true);

    $.ajax({
      url: urlCheckTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: claimId,
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

          $btnConfirmCheck.prop("disabled", false);
        }
      }
    });
  });

  // Proceed
  $btnConfirmProceed.on("click", function() {
    $btnConfirmProceed.prop("disabled", true);

    $.ajax({
      url: urlProceedTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: claimId,
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

          $btnConfirmProceed.prop("disabled", false);
        }
      }
    });
  });

  // Declined
  $btnConfirmDeclined.on("click", function() {
    var declinedNote  = $inputDeclinedNote.val();

    $message.html("Loading...");

    $btnConfirmDeclined.prop("disabled", true);
    $inputDeclinedNote.prop("disabled", true);
    
    $.ajax({
      url: urlDeclinedTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: claimId,
        declined_note: declinedNote,
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

          $inputDeclinedNote.prop("disabled", false);
          $btnConfirmDeclined.prop("disabled", false);
        }
      }
    });
  });

  // Pending
  $btnConfirmPending.on("click", function() {
    $btnConfirmPending.prop("disabled", true);

    $.ajax({
      url: urlPendingTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: claimId,
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

          $btnConfirmPending.prop("disabled", false);
        }
      }
    });
  });

  // Approve
  $btnConfirmApprove.on("click", function() {
    $btnConfirmApprove.prop("disabled", true);

    $.ajax({
      url: urlApproveTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: claimId,
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

  // POST
  $btnConfirmPost.on("click", function() {
    $btnConfirmPost.prop("disabled", true);

    $.ajax({
      url: urlPostTransaction,
      method: 'POST',
      dataType: 'json',
      data: {
        id: claimId,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        // window.location.reload();
        window.location.href="/claims";
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

          $btnConfirmPost.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmClaimsTemplate.on("click", function() {
    var template  = $selectClaimsTemplate.val();

    $message.html("Loading...");

    $selectClaimsTemplate.prop("disabled", true);
    $btnConfirmClaimsTemplate.prop("disabled", true);

    $.ajax({
      url: urlModifyClaimsTemplate,
      method: 'POST',
      data: { 
        id: claimId,
        template: template,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $selectClaimsTemplate.prop("disabled", false);
          $btnConfirmClaimsTemplate.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmParticular.on("click", function() {
    var particular  = $inputTextParticular.val();

    $message.html("Loading...");

    $inputTextParticular.prop("disabled", true);
    $btnConfirmParticular.prop("disabled", true);

    $.ajax({
      url: urlModifyParticular,
      method: 'POST',
      data: { 
        id: claimId,
        particular: particular,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $inputTextParticular.prop("disabled", false);
          $btnConfirmParticular.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmTransactionFee.on("click", function() {
    var transaction_fee  = $inputTextTransactionFee.val();

    $message.html("Loading...");

    $inputTextTransactionFee.prop("disabled", true);
    $btnConfirmTransactionFee.prop("disabled", true);

    $.ajax({
      url: urlAddTransactionFee,
      method: 'POST',
      data: { 
        id: claimId,
        transaction_fee: transaction_fee,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $inputTextTransactionFee.prop("disabled", false);
          $btnConfirmTransactionFee.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmPayee.on("click", function() {
    var payee  = $inputTextPayee.val();

    $message.html("Loading...");

    $inputTextPayee.prop("disabled", true);
    $btnConfirmPayee.prop("disabled", true);

    $.ajax({
      url: urlSavePayee,
      method: 'POST',
      data: { 
        id: claimId,
        payee: payee,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $inputTextPayee.prop("disabled", false);
          $btnConfirmPayee.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmCheckNumber.on("click", function() {
    var check_number  = $inputTextCheckNumber.val();

    $message.html("Loading...");

    $inputTextCheckNumber.prop("disabled", true);
    $btnConfirmCheckNumber.prop("disabled", true);

    $.ajax({
      url: urlSaveCheckNumber,
      method: 'POST',
      data: { 
        id: claimId,
        check_number: check_number,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $inputTextCheckNumber.prop("disabled", false);
          $btnConfirmCheckNumber.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmCheckVoucherNumber.on("click", function() {
    var check_voucher_number  = $inputTextCheckVoucherNumber.val();

    $message.html("Loading...");

    $inputTextCheckVoucherNumber.prop("disabled", true);
    $btnConfirmCheckVoucherNumber.prop("disabled", true);

    $.ajax({
      url: urlSaveCheckVoucherNumber,
      method: 'POST',
      data: { 
        id: claimId,
        check_voucher_number: check_voucher_number,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $inputTextCheckVoucherNumber.prop("disabled", false);
          $btnConfirmCheckVoucherNumber.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmBook.on("click", function() {
    var book  = $selectBook.val();

    $message.html("Loading...");

    $selectBook.prop("disabled", true);
    $btnConfirmBook.prop("disabled", true);

    $.ajax({
      url: urlModifyBook,
      method: 'POST',
      data: { 
        id: claimId,
        book: book,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $selectBook.prop("disabled", false);
          $btnConfirmBook.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmDatePaid.on("click", function() {
    var date_paid  = $inputDatePaid.val();

    $message.html("Loading...");

    $inputDatePaid.prop("disabled", true);
    $btnConfirmDatePaid.prop("disabled", true);

    $.ajax({
      url: urlSaveDatePaid,
      method: 'POST',
      data: { 
        id: claimId,
        date_paid: date_paid,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $inputDatePaid.prop("disabled", false);
          $btnConfirmDatePaid.prop("disabled", false);
        }
      }
    });
  });


  $btnSaveNote.on("click", function() {
    var note  = $inputNote.val();

    $message.html("Loading...");

    $inputNote.prop("disabled", true);
    $btnSaveNote.prop("disabled", true);

    $.ajax({
      url: urlSaveNote,
      method: 'POST',
      data: { 
        id: claimId,
        note: note,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
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

          $inputNote.prop("disabled", false);
          $btnSaveNote.prop("disabled", false);
        }
      }
    });
  });

  // check
  $btnCheck.on("click", function() {
    $modalCheck.show();
    $message.html("");
  });

  // proceed
  $btnProceed.on("click", function() {
    $modalProceed.show();
    $message.html("");
  });

  // declined
  $btnDeclined.on("click", function() {
    $modalDeclined.show();
    $message.html("");
  });

  // Add note
  $btnNote.on("click", function() {
    $modalNote.show();
    $message.html("");
  });

  // Approve
  $btnApprove.on("click", function() {
    $modalApprove.show();
    $message.html("");
  });

  // Post
  $btnPost.on("click", function() {
    $modalPost.show();
    $message.html("");
  });

  // Pending
  $btnPending.on("click", function() {
    $modalPending.show();
    $message.html("");
  });

  $btnPrint.on("click", function() {
    var accountingEntryId = $btnPrint.data('id');
    var cId = $btnPrint.data('cid');

    $modalPrint.show();
    $printMessage.html(
      Mustache.render(
        loader,
        {}
      )
    );

    $modalPrint.hide();
    window.open("/print?id=" + accountingEntryId + "&type=claims_voucher" + "&cid=" + cId);
  });

  $btnDailyReport.on("click", function() {
    window.open("/print?type=claims_daily_report");
  });
}

var _cacheDom = function() {
  $confirmationModal            = $("#confirmation-modal"); 
  $btnApprove                   = $("#btn-approve");
  $btnCheck                     = $("#btn-check");
  $btnProceed                   = $("#btn-proceed");
  $btnDeclined                  = $("#btn-declined");
  $btnPost                      = $("#btn-post");
  $btnPending                   = $("#btn-pending");

  $btnNote                      = $("#btn-note");

  $btnConfirmApprove            = $("#btn-confirm-approval");
  $btnConfirmCheck              = $("#btn-confirm-check");
  $btnConfirmProceed            = $("#btn-confirm-proceed");
  $btnConfirmDeclined           = $("#btn-confirm-declined");
  $btnConfirmPost               = $("#btn-confirm-posting");
  $btnConfirmPending            = $("#btn-confirm-pending");

  $btnSaveNote                  = $("#btn-save-note");
  $inputNote                    = $("#input-note");

  $inputDeclinedNote            = $("#input-declined-note");

  $errors                       = $("#errors");
  $errorsTemplate               = $("#errors-template");
  
  // Validate
  $modalNote = new bootstrap.Modal(
    document.getElementById("modal-note")
  );
  $modalPending = new bootstrap.Modal(
    document.getElementById("modal-pending-confirmation")
  );
  $modalPost = new bootstrap.Modal(
    document.getElementById("modal-post-confirmation")
  );
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve-confirmation")
  );
  $modalDeclined = new bootstrap.Modal(
    document.getElementById("modal-declined-confirmation")
  );
  $modalProceed = new bootstrap.Modal(
    document.getElementById("modal-proceed-confirmation")
  );
  $modalCheck = new bootstrap.Modal(
    document.getElementById("modal-check-confirmation")
  );

  
  $modalErrorsApproval          = $(".modal-approve").find(".errors");
  $modalErrorsChecking          = $(".modal-check").find(".errors");
  $modalErrorsProceeding        = $(".modal-proceed").find(".errors");
  $modalErrorsDeclining         = $(".modal-declined").find(".errors");
  $modalErrorsPosting           = $(".modal-post").find(".errors");
  $modalErrorsPending           = $(".modal-pending").find(".errors");

  $modalSuccessApproval         = $(".modal-approve").find(".success");
  $modalSuccessChecking         = $(".modal-check").find(".success");
  $modalSuccessProceeding       = $(".modal-proceed").find(".success");
  $modalSuccessDeclining       = $(".modal-declined").find(".success");
  $modalSuccessPosting          = $(".modal-post").find(".success");
  $modalSuccessPending          = $(".modal-pending").find(".success");

  $modalControls                = $(".modal-controls");
  $successTemplate              = $("#success-template");

  $message                      = $(".message");
  templateErrorList             = $("#template-error-list").html();

  $selectClaimsTemplate         = $("#select-claims-template");
  $btnConfirmClaimsTemplate     = $("#btn-confirm-claims-template");

  $inputTextParticular          = $("#input-text-particular");
  $btnConfirmParticular         = $("#btn-confirm-particular");

  $inputDatePaid                = $("#input-date-date-paid");
  $btnConfirmDatePaid           = $("#btn-confirm-date-paid");

  $btnConfirmTransactionFee     = $("#btn-confirm-transaction-fee");
  $inputTextTransactionFee      = $("#input-text-transaction-fee");

  $inputTextPayee               = $("#input-text-payee");
  $btnConfirmPayee              = $("#btn-confirm-payee");

  $inputTextCheckNumber         = $("#input-text-check-number");
  $btnConfirmCheckNumber        = $("#btn-confirm-check-number");

  $inputTextCheckVoucherNumber  = $("#input-text-check-voucher-number");
  $btnConfirmCheckVoucherNumber = $("#btn-confirm-check-voucher-number");

  $selectBook                   = $("#select-book");
  $btnConfirmBook               = $("#btn-confirm-book");

  $btnPrint                     = $("#btn-print");
  $btnDailyReport               = $("#btn-daily-report");
  $modalPrint                   = $("#modal-print");
  $printMessage                 = $(".print-message");

  loader                        = $("#template-loader").html();
}

var init = function(options) {
  authenticityToken  = options.authenticityToken;
  claimId            = options.id;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
