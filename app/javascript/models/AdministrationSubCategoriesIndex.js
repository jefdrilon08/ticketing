import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew, $btnConfirmNew, $inputName, $inputCode, $inputCategoryId, $itemId, $modalNew, $message;
let _authenticityToken, templateErrorList;

const _cacheDom = () => {
  $btnNew          = $("#btn-new");
  $btnConfirmNew   = $("#btn-confirm-new");
  $inputName       = $("#input-name");
  $inputCode       = $("#input-code");
  $inputCategoryId = $("#input-category-id");
  $itemId          = $("#item-id");

  const modalEl = document.getElementById("modal-new");
  if (modalEl) $modalNew = new bootstrap.Modal(modalEl);

  $message = $(".message");
  templateErrorList = $("#template-error-list").html() ||
    "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

const reloadTable = () => {
  $.ajax({
    url: "/api/v1/administration/sub_categories",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${_authenticityToken}`,
      "X-CSRF-Token": $("meta[name='csrf-token']").attr("content")
    },
    success(res) {
      const $tbody = $("#data-table tbody");
      if ($tbody.length === 0) {
        $("#data-table").append("<tbody></tbody>");
      }

      $("#data-table tbody").empty();

      if (res.sub_categories.length === 0) {
        $("#data-table tbody").html(`
          <tr>
            <td colspan="3" class="text-center">No Sub Categories Found</td>
          </tr>
        `);
      } else {
        const rows = res.sub_categories.map(sc => `
          <tr data-id="${sc.id}">
            <td style="text-transform: uppercase;">${sc.code}</td>
            <td style="text-transform: uppercase; word-wrap: break-word; white-space: normal; max-width: 300px;">
              ${sc.name}
            </td>
            <td class="text-center">
              <button
                class="btn btn-info btn-sm update-button"
                data-id="${sc.id}"
                data-code="${sc.code}"
                data-name="${sc.name}"
                data-category-id="${sc.category_id}"
              >Update</button>
              <button class="btn btn-sm btn-danger delete-button" data-id="${sc.id}">
                <i class="fa fa-times"></i> Delete
              </button>
            </td>
          </tr>
        `).join("");

        $("#data-table tbody").html(rows);
      }
    },
    error() {
      console.error("Failed to reload table");
    }
  });
};

const _showMessage = (text, type = "success") => {
  $message
    .removeClass("alert-success alert-danger")
    .addClass(`alert alert-${type}`)
    .text(text)
    .fadeIn();

  setTimeout(() => {
    $message.fadeOut();
  }, 3000);
};

const _clearMessage = () => {
  $message.hide().text("").removeClass("alert alert-success alert-danger");
};

const _bindEvents = () => {
  // — New —
  $btnNew.off().on("click", e => {
    e.preventDefault();
    $itemId.val("");
    $inputName.val("");
    $inputCode.val("");
    $inputCategoryId.val("");
    _clearMessage();
    $modalNew.show();
  });

  // — Edit —
  $(document).off("click", ".update-button").on("click", ".update-button", function(e) {
    e.preventDefault();
    const $row = $(this).closest("tr");
    $itemId.val(        $row.data("id"));
    $inputCode.val(     $(this).data("code"));
    $inputName.val(     $(this).data("name"));
    $inputCategoryId.val($(this).data("category-id"));
    _clearMessage();
    $modalNew.show();
    $inputName.focus();
  });

  // — Create / Update —
  $btnConfirmNew.off().on("click", e => {
    e.preventDefault();
    if ($btnConfirmNew.prop("disabled")) return;
    $btnConfirmNew.prop("disabled", true);
    _clearMessage();

    const id         = $itemId.val();
    const name       = $inputName.val().trim();
    const code       = $inputCode.val().trim();
    const categoryId = $inputCategoryId.val();

    if (!name) {
      _showMessage("Name is required", "danger");
      $btnConfirmNew.prop("disabled", false);
      return;
    }
    if (!code) {
      _showMessage("Code is required", "danger");
      $btnConfirmNew.prop("disabled", false);
      return;
    }
    if (!categoryId) {
      _showMessage("Please select a category", "danger");
      $btnConfirmNew.prop("disabled", false);
      return;
    }

    const isUpdate = Boolean(id);
    const url      = isUpdate
      ? `/api/v1/administration/sub_categories/${id}`
      : "/api/v1/administration/sub_categories";
    const method   = isUpdate ? "PUT" : "POST";

    $.ajax({
      url,
      type: method,
      dataType: "json",
      data: {
        sub_category: { id, name, code, category_id: categoryId },
        authenticity_token: _authenticityToken
      },
      headers: {
        Authorization: `Bearer ${_authenticityToken}`,
        "X-CSRF-Token": $("meta[name='csrf-token']").attr("content")
      },
      success() {
        $modalNew.hide();
        reloadTable(); 

        const modalEl = document.getElementById("modal-new");
        if (modalEl) {
          const onHidden = () => {
            alert(isUpdate ? "Successfully Updated" : "Successfully Created");
            modalEl.removeEventListener('hidden.bs.modal', onHidden);
          };
          modalEl.addEventListener('hidden.bs.modal', onHidden);
        }
      },
      error(xhr) {
        let errs = [];
        try { errs = JSON.parse(xhr.responseText).messages; }
        catch { errs = ["Something went wrong"]; }
        $message
          .addClass("alert alert-danger")
          .html(Mustache.render(templateErrorList, { errors: errs }))
          .show();
      },
      complete() {
        $btnConfirmNew.prop("disabled", false);
      }
    });
  });

  // — Delete —
  $(document).off("click", ".delete-button").on("click", ".delete-button", function(e) {
    e.preventDefault();
    const $btn = $(this);
    const id = $btn.data("id");

    if ($btn.hasClass("processing")) return;

    $btn.addClass("processing");
    _clearMessage();

    const confirmDelete = confirm("Delete this subcategory?");
    
    if (!confirmDelete) {
      $btn.removeClass("processing");
      _clearMessage();
      return;
    }

    $.ajax({
      url: `/api/v1/administration/sub_categories/${id}`,
      type: "DELETE",
      dataType: "json",
      data: { authenticity_token: _authenticityToken },
      headers: {
        Authorization: `Bearer ${_authenticityToken}`,
        "X-CSRF-Token": $("meta[name='csrf-token']").attr("content")
      },
      success(response) {
        if (response.status === "success") {
          _showMessage(response.message, "success");
          reloadTable();
        } else {
          _showMessage("Failed to delete subcategory", "danger");
        }
      },
      error(xhr) {
        let errs = [];
        try { errs = JSON.parse(xhr.responseText).messages; }
        catch { errs = ["Something went wrong"]; }
        $message
          .addClass("alert alert-danger")
          .html(Mustache.render(templateErrorList, { errors: errs }))
          .show();
      },
      complete() {
        $(".delete-button").removeClass("processing");
      }
    });
  });
};

const init = options => {
  _authenticityToken = options.authenticityToken;
  _cacheDom();
  _bindEvents();
  reloadTable();
};

$(document).ready(() => {
  init({ authenticityToken: $("meta[name='csrf-token']").attr("content") });
});

export default { init };
