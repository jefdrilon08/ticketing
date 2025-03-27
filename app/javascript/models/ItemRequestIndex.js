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
    return;
  }
  $statusModal = new bootstrap.Modal(modalElement);
  $detailIdInput = $("#status-modal #detail-id");
  $statusModalInputStatus = $("#status-modal #input-status");
  $btnConfirmStatusUpdate = $("#btn-confirm-status-update");
  $message = $(".message");
  templateErrorList = $("#template-error-list").html() || "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

const bindEvents = () => {
  $(document).on("click", ".update-status-button", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const currentStatus = $(this).data("status");
    $detailIdInput.val(id);
    $statusModalInputStatus.val(currentStatus);
    $statusModal.show();
  });

  $btnConfirmStatusUpdate.on("click", function (e) {
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
        console.error("Update error:", xhr.responseText);
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
  cacheDom();
  bindEvents();
};

$(document).ready(function () {
  const authToken = $('meta[name="csrf-token"]').attr("content");
  init({ authenticityToken: authToken });
});

export default { init };
