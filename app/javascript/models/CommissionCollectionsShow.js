import Mustache from "mustache";
import $ from "jquery";

var $btnUpdate;
var $btnConfirmUpdate;
var $modalUpdate;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var id;
var templateErrorList;
var authenticityToken;

var urlModifyTemplate         = "/api/v1/commission_collections/modify_template";
var urlModifyBook             = "/api/v1/commission_collections/modify_book";
var urlModifyParticular       = "/api/v1/commission_collections/modify_particular";
var urlSaveCheckNumber        = "/api/v1/commission_collections/save_check_number";
var urlSaveCheckVoucherNumber = "/api/v1/commission_collections/save_check_voucher_number";
var urlSavePayee              = "/api/v1/commission_collections/save_payee";
var urlAddTransactionFee      = "/api/v1/commission_collections/add_transaction_fee";

var $selectTemplate;
var $btnConfirmTemplate;

var $btnConfirmBook;
var $btnConfirmParticular;
var $btnConfirmPayee;
var $btnConfirmCheckNumber;
var $btnConfirmCheckVoucherNumber;

var $selectBook;
var $inputTextParticular;
var $inputTextPayee;
var $inputTextCheckNumber;
var $inputTextCheckVoucherNumber;

var $btnConfirmTransactionFee;
var $inputTextTransactionFee;

var $message;

var _cacheDom = function() {
  $btnUpdate                    = $("#btn-update");
  $btnConfirmUpdate             = $("#btn-confirm-update");
  $modalUpdate                  = $("#modal-update");
  
  $btnApprove                   = $("#btn-approve");
  $btnConfirmApprove            = $("#btn-confirm-approve");
  $modalApprove                 = $("#modal-approve");

  $selectTemplate               = $("#select-template");
  $btnConfirmTemplate           = $("#btn-confirm-template");

  $inputTextParticular          = $("#input-text-particular");
  $btnConfirmParticular         = $("#btn-confirm-particular");

  $inputTextPayee               = $("#input-text-payee");
  $btnConfirmPayee              = $("#btn-confirm-payee");

  $inputTextCheckNumber         = $("#input-text-check-number");
  $btnConfirmCheckNumber        = $("#btn-confirm-check-number");

  $inputTextCheckVoucherNumber  = $("#input-text-check-voucher-number");
  $btnConfirmCheckVoucherNumber = $("#btn-confirm-check-voucher-number");

  $btnConfirmTransactionFee     = $("#btn-confirm-transaction-fee");
  $inputTextTransactionFee      = $("#input-text-transaction-fee");

  $selectBook                   = $("#select-book");
  $btnConfirmBook               = $("#btn-confirm-book");

  $message                      = $(".message");
  templateErrorList             = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnApprove.on("click", function() {
    $message.html("");
    $modalApprove.show();
  });

  $btnConfirmApprove.on("click", function() {
    $btnConfirmApprove.prop("disabled", true);
    $message.html("Loading...");

    $.ajax({
      url: "/api/v1/commission_collections/approve",
      method: 'POST',
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

  $btnUpdate.on("click", function() {
    $message.html("");
    $modalUpdate.show();
  });

  $btnConfirmUpdate.on("click", function() {
    $btnConfirmUpdate.prop("disabled", true);

    $.ajax({
      url: "/api/v1/commission_collections/update",
      method: 'POST',
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

          $btnConfirmUpdate.prop("disabled", false);
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
        id: id,
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

  $btnConfirmTemplate.on("click", function() {
    var template  = $selectTemplate.val();

    $message.html("Loading...");

    $selectTemplate.prop("disabled", true);
    $btnConfirmTemplate.prop("disabled", true);

    $.ajax({
      url: urlModifyTemplate,
      method: 'POST',
      data: { 
        id: id,
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

          $selectTemplate.prop("disabled", false);
          $btnConfirmTemplate.prop("disabled", false);
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
        id: id,
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

  $btnConfirmPayee.on("click", function() {
    var payee  = $inputTextPayee.val();

    $message.html("Loading...");

    $inputTextPayee.prop("disabled", true);
    $btnConfirmPayee.prop("disabled", true);

    $.ajax({
      url: urlSavePayee,
      method: 'POST',
      data: { 
        id: id,
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
        id: id,
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
        id: id,
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
        id: id,
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
};

var init  = function(options) {
  id                = options.id;
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
