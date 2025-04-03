import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $borrowTransactionModal,
    $requestDateInput,
    $branchInput,
    $btnConfirmTransaction,
    $modalTitle,
    _authenticityToken,
    _userId,
    $message,
    templateErrorList,
    currentTransactionId = null, 
    $btnDeleteTransaction; 

const getFormattedDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0].replace(/-/g, "/"); 
};

const cacheDom = () => {
  const modalElement = document.getElementById("borrowTransactionModal");
  if (!modalElement) {
    return false; 
  }

  $borrowTransactionModal = new bootstrap.Modal(modalElement);
  $requestDateInput = $("#borrowTransactionModal #request_date");
  $branchInput = $("#borrowTransactionModal #branch");
  $btnConfirmTransaction = $("#btn-confirm-transaction");
  $modalTitle = $("#borrowTransactionModalLabel");
  $message = $(".message");
  templateErrorList = $("#template-error-list").html() || "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";

  $btnDeleteTransaction = $(".delete-borrow-transaction-btn");
  return true;
};

const bindEvents = () => {
  if (!$btnConfirmTransaction || !$btnConfirmTransaction.length) {
    return;
  }

  $(document).off("click", "#btn-new-borrow").on("click", "#btn-new-borrow", function (e) {
    e.preventDefault();
    currentTransactionId = null;
    $modalTitle.text("New Borrow Transaction");
    $requestDateInput.val(getFormattedDate()); 
    $branchInput.val("0"); 
    $borrowTransactionModal.show();
  });

  $(document).off("click", ".update-button").on("click", ".update-button", function (e) {
    e.preventDefault();
    const transactionData = $(this).data(); 
    currentTransactionId = transactionData.id; 

    $modalTitle.text("Update Borrow Transaction");
    $branchInput.val(transactionData.branchId); 
    $requestDateInput.val(getFormattedDate()); 

    $borrowTransactionModal.show();
  });

  $(document).off("click", ".delete-borrow-transaction-btn").on("click", ".delete-borrow-transaction-btn", function (e) {
    e.preventDefault();
    const transactionId = $(this).data("id");
    if (!confirm("Are you sure you want to delete this Borrow Transaction?")) {
      return;
    }

    $.ajax({
      url: `/borrow_transactions/${transactionId}`,
      type: "DELETE",
      data: { authenticity_token: _authenticityToken },
      dataType: "json",
      success: function (response) {
        alert(response.message || "Borrow transaction deleted successfully.");
        window.location.reload();
      },
      error: function (xhr) {
        let errors = [];
        try {
          const errorData = JSON.parse(xhr.responseText);
          errors = Array.isArray(errorData.messages)
            ? errorData.messages
            : [errorData.messages || "An unexpected error occurred."];
        } catch (err) {
          errors.push("Something went wrong. Please try again.");
        }
        $message.html(Mustache.render(templateErrorList, { errors })).addClass("text-danger");
      }
    });
  });

  $btnConfirmTransaction.off("click").on("click", function (e) {
    e.preventDefault();
    $btnConfirmTransaction.prop("disabled", true); 

    const data = {
      borrow_transaction: {
        request_date: getFormattedDate(), 
        branch_id: $branchInput.val(),
      },
      authenticity_token: _authenticityToken
    };

    let ajaxOptions = {
      data: data,
      dataType: "json",
      success: function (response) {
        alert(response.message || (currentTransactionId ? "Borrow transaction updated successfully." : "Borrow transaction created successfully."));
        $borrowTransactionModal.hide();
        window.location.reload();
      },
      error: function (xhr) {
        let errors = [];
        try {
          const errorData = JSON.parse(xhr.responseText);
          errors = Array.isArray(errorData.messages) ? errorData.messages : [errorData.messages || "An unexpected error occurred."];
        } catch (err) {
          errors.push("Something went wrong. Please try again.");
        }
        $message.html(Mustache.render(templateErrorList, { errors })).addClass("text-danger");
      },
      complete: function () {
        $btnConfirmTransaction.prop("disabled", false);
      }
    };

    if (currentTransactionId) {
      ajaxOptions.url = `/borrow_transactions/${currentTransactionId}`;
      ajaxOptions.type = "PATCH";
    } else {
      ajaxOptions.url = "/borrow_transactions";
      ajaxOptions.type = "POST";
    }

    $.ajax(ajaxOptions);
  });

  $(document).on("shown.bs.modal", "#borrowTransactionModal", function () {
    if (cacheDom()) {
      bindEvents();
    }
  });
};

const init = (options) => {
  _authenticityToken = options.authenticityToken;
  _userId = options.userId;
  
  if (cacheDom()) {
    bindEvents();
  }
};

$(document).ready(function () {
  const authToken = $('meta[name="csrf-token"]').attr("content");
  const userId = $('meta[name="user-id"]').attr("content");
  init({ authenticityToken: authToken, userId: userId });
});

export default { init };
