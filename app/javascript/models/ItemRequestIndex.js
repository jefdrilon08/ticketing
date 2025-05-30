import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $statusModal,
    $detailIdInput,
    $statusModalInputStatus,
    $btnConfirmStatusUpdate,
    _authenticityToken,
    $message,
    templateErrorList;

const cacheDom = () => {
  const modalElement = document.getElementById("status-modal");
  if (!modalElement) {
    return false; 
  }
  $statusModal = new bootstrap.Modal(modalElement);
  $detailIdInput = $("#status-modal #detail-id");
  $statusModalInputStatus = $("#status-modal #input-status");
  $btnConfirmStatusUpdate = $("#btn-confirm-status-update");
  $message = $(".message");
  templateErrorList = $("#template-error-list").html() || "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";

  return true;
};

const bindEvents = () => {
  if (!$btnConfirmStatusUpdate || !$btnConfirmStatusUpdate.length) {
    return;
  }

  $(document).off("click", ".update-status-button").on("click", ".update-status-button", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const currentStatus = $(this).data("status");
    if (!$statusModal) {
      return;
    }
    $detailIdInput.val(id);
    $statusModalInputStatus.val(currentStatus);
    $statusModal.show();
  });

  $btnConfirmStatusUpdate.off("click").on("click", function (e) {
    e.preventDefault();
    const id = $detailIdInput.val();
    const newStatus = $statusModalInputStatus.val();
    if (!id || !newStatus) {
      alert("Please select a status.");
      return;
    }
    const data = {
      "item_request_detail[status]": newStatus,
      authenticity_token: _authenticityToken,
      _method: "PATCH"
    };
    $.ajax({
      url: `/item_request_details/${id}/update_status`,
      type: "POST",
      data: data,
      dataType: "json",
      success: function (response) {
        alert(response.message || "Status updated successfully.");
        $statusModal.hide();
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
};

const init = (options) => {
  _authenticityToken = options.authenticityToken;
  if (cacheDom()) {
    bindEvents();
  }
};


$(document).on("shown.bs.modal", "#status-modal", function () {
  if (cacheDom()) {
    bindEvents();
  }
});

$(document).ready(function () {
  const authToken = $('meta[name="csrf-token"]').attr("content");
  init({ authenticityToken: authToken });
});

export default { init };
