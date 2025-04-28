import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew;
let $btnConfirmNew;
let $inputName;
let $inputDesc;
let $inputUnit;
let $inputItemsCategory;
let $inputStatus;
let $message;
let $itemId;
let _authenticityToken;
let $isParentCheckbox;
let templateErrorList;
let modalInstance;

const _cacheDom = () => {
  $btnNew = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");
  $inputName = $("#input-name");
  $inputDesc = $("#input-description");
  $inputUnit = $("#input-unit");
  $inputItemsCategory = $("#input-items-category");
  $inputStatus = $("#input-status");
  $itemId = $("#item-id");
  $message = $(".message");
  $isParentCheckbox = $("#input-is-parent");
  templateErrorList = $("#template-error-list").html() || "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";

  const modalElement = document.getElementById("myModal");
  if (modalElement) {
    modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  }
};

const _bindEvents = () => {
  $btnNew.off("click").on("click", () => {
    $inputName.val("");
    $inputDesc.val("");
    $inputUnit.val("");
    $inputItemsCategory.val("");
    $inputStatus.val("Active");
    $itemId.val("");
    $isParentCheckbox.prop("checked", false);
    $message.html("").removeClass("text-danger");

    if (modalInstance) modalInstance.show();
  });

  $(document).off("click", ".update-button").on("click", ".update-button", function () {
    const itemId = $(this).data("id");
    if (itemId) window.location.href = `/administration/items/${itemId}/edit`;
  });

  $(document).off("click", ".delete-button").on("click", ".delete-button", function () {
    const itemId = $(this).data("id");
    if (!itemId) return;

    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    $.ajax({
      url: `/api/v1/administration/items/${itemId}`,
      method: "DELETE",
      headers: {
        "X-CSRF-Token": _authenticityToken
      },
      success: () => {
        alert("Item deleted successfully.");
        window.location.reload();
      },
      error: () => {
        alert("Unable to delete. This item is already used in another module");
      }
    });
  });

  $btnConfirmNew.off("click").on("click", () => {
    const id = $itemId.val();
    const name = $inputName.val();
    const description = $inputDesc.val();
    const unit = $inputUnit.val();
    const category = $inputItemsCategory.val();
    const status = $inputStatus.val();
    const isParent = $isParentCheckbox.is(":checked");

    if (!name || !unit || !category || !status) {
      alert("Please fill in all required fields (Name, Unit, Category, Status).");
      return;
    }

    const itemData = {
      id,
      name,
      description,
      unit,
      items_category_id: category,
      status,
      is_parent: isParent
    };

    const data = {
      authenticity_token: _authenticityToken,
      item: itemData
    };

    const url = id ? `/api/v1/administration/items/${id}` : "/api/v1/administration/items";
    const method = id ? "PUT" : "POST";

    $.ajax({
      url,
      method,
      data,
      headers: {
        "X-CSRF-Token": _authenticityToken
      },
      success: () => {
        alert(id ? "Successfully Updated!" : "Successfully Saved!");
        window.location.reload();
      },
      error: function (response) {
        let errors = [];
        try {
          const errorData = JSON.parse(response.responseText);
          errors = Array.isArray(errorData.messages)
            ? errorData.messages.map((err) => err.message || err)
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
  _cacheDom();
  _bindEvents();
};

$(document).ready(function () {
  const isItemsPage = $("[data-controller='administration-items']").length > 0;
  if (!isItemsPage) return;

  const options = {
    authenticityToken: $("meta[name='csrf-token']").attr("content")
  };
  init(options);
});

export default { init };
