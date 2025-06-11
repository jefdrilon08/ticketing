import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew, $btnConfirmNew, $inputName, $inputCode, $inputCategoryId, $itemId, $message;
let _authenticityToken, templateErrorList, $modalEl, $modalNew;

const _cacheDom = () => {
  $btnNew = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");
  $inputName = $("#input-name");
  $inputCode = $("#input-code");
  $inputCategoryId = $("#input-category-id");
  $itemId = $("#item-id");

  $modalEl = document.getElementById("modal-new");
  if ($modalEl) $modalNew = new bootstrap.Modal($modalEl);

  $message = $(".message");
  templateErrorList = $("#template-error-list").html() ||
    "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

const reloadTable = () => {
  if ($.fn.DataTable.isDataTable('#data-table')) {
    $('#data-table').DataTable().destroy();
  }
  
  $('#data-table').DataTable({
    pageLength: 10,
    dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
         '<"row"<"col-sm-12"tr>>' +
         '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
    columnDefs: [
      { targets: 0, width: '15%' }, // Code
      { targets: 1, width: '25%' }, // Category
      { targets: 2, width: '40%' }, // Name
      { 
        targets: 3,
        width: '20%',
        orderable: false,
        className: 'text-center'
      }
    ],
    ordering: true,
    searching: true,
    responsive: true,
    autoWidth: false,
    scrollCollapse: true,
    scrollX: true,
    fixedColumns: true
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
  $btnNew.off().on("click", e => {
    e.preventDefault();
    $itemId.val("");
    $inputName.val("");
    $inputCode.val("");
    $inputCategoryId.val("");
    _clearMessage();
    $modalNew.show();
  });

  $(document).off("click", ".update-button").on("click", ".update-button", function(e) {
    e.preventDefault();
    const $row = $(this).closest("tr");
    $itemId.val($row.data("id"));
    $inputCode.val($(this).data("code"));
    $inputName.val($(this).data("name"));
    $inputCategoryId.val($(this).data("category-id"));
    _clearMessage();
    $modalNew.show();
  });

  $btnConfirmNew.off().on("click", e => {
    e.preventDefault();
    if ($btnConfirmNew.prop("disabled")) return;
    $btnConfirmNew.prop("disabled", true);
    _clearMessage();

    const id = $itemId.val();
    const name = $inputName.val().trim();
    const code = $inputCode.val().trim();
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
    const url = isUpdate
      ? `/api/v1/administration/sub_categories/${id}`
      : "/api/v1/administration/sub_categories";
    const method = isUpdate ? "PUT" : "POST";

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
        reloadTable(); // Always reload the table after create or update

        const onHidden = () => {
          alert(isUpdate ? "Successfully Updated" : "Successfully Created");
          $modalEl.removeEventListener('hidden.bs.modal', onHidden);
        };
        $modalEl.addEventListener('hidden.bs.modal', onHidden);
      },
      error(xhr) {
        let errs = [];
        try {
          errs = JSON.parse(xhr.responseText).messages;
        } catch {
          errs = ["Something went wrong"];
        }
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
        try {
          errs = JSON.parse(xhr.responseText).messages;
        } catch {
          errs = ["Something went wrong"];
        }
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
  if ($("#data-table").length > 0 && $("#data-table").hasClass("sub-categories")) {
    if ( $.fn.DataTable.isDataTable('#data-table') ) {
      $('#data-table').DataTable().destroy();
    }
    init({ authenticityToken: $("meta[name='csrf-token']").attr("content") });
  }
});

export default { init };
