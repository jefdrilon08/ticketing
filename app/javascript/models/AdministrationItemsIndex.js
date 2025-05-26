import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew;
let $btnConfirmNew;
let $inputName;
let $inputDesc;
let $inputUnit;
let $inputItemsCategory;
let $inputSubCategory;
let $inputStatus;
let $message;
let $itemId;
let $inputParentId;
let $isParentCheckbox;
let _authenticityToken;
let templateErrorList;
let modalInstance;

const _cacheDom = () => {
  $btnNew = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");
  $inputName = $("#input-name");
  $inputDesc = $("#input-description");
  $inputUnit = $("#input-unit");
  $inputItemsCategory = $("#input-items-category");
  $inputSubCategory = $("#input-sub-category");
  $inputStatus = $("#input-status");
  $inputParentId = $("#input-parent-id");
  $itemId = $("#item-id");
  $message = $(".message");
  $isParentCheckbox = $("#input-is-parent");
  templateErrorList = $("#template-error-list").html() || "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";

  const modalElement = document.getElementById("myModal");
  if (modalElement) {
    modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  }
};

const _loadSubCategories = (categoryId, selectedId = null) => {
  $inputSubCategory.empty().append('<option value="">--SELECT--</option>');
  if (!categoryId) return Promise.resolve();

  return $.ajax({
    url: `/api/v1/administration/sub_categories`,
    data: { items_category_id: categoryId },
    success: function (subCategories) {
      subCategories.forEach(sub => {
        const selected = selectedId && selectedId == sub.id ? "selected" : "";
        $inputSubCategory.append(`<option value="${sub.id}" ${selected}>${sub.name}</option>`);
      });
    },
    error: function () {
      alert("Failed to load sub categories.");
    }
  });
};

const _populateForm = (item) => {
  return new Promise((resolve) => {
    $inputName.val(item.name || "");
    $inputDesc.val(item.description || "");
    $inputUnit.val(item.unit || "");
    $inputItemsCategory.val(item.items_category_id || "");
    $inputStatus.val(item.status || "Active");
    $inputParentId.val(item.parent_id || "");
    $itemId.val(item.id || "");
    $isParentCheckbox.prop("checked", !!item.is_parent);
    $message.html("").removeClass("text-danger");

    _loadSubCategories(item.items_category_id, item.sub_category_id).then(resolve).catch(resolve);
  });
};

const _bindEvents = () => {
  $btnNew.off("click").on("click", () => {
    _populateForm({
      name: "",
      description: "",
      unit: "",
      items_category_id: "",
      sub_category_id: null,
      status: "Active",
      id: "",
      is_parent: false,
      parent_id: ""
    }).then(() => {
      if (modalInstance) modalInstance.show();
    });
  });

  $inputItemsCategory.off("change").on("change", function () {
    const categoryId = $(this).val();
    _loadSubCategories(categoryId);
  });

  $isParentCheckbox.off("change").on("change", function () {
    if ($(this).is(":checked")) {
      $inputParentId.val(""); 
    }
  });

  $(document.body).off("click", ".update-button").on("click", ".update-button", function () {
    const itemId = $(this).data("id");
    if (!itemId) return;

    $.ajax({
      url: `/api/v1/administration/items/${itemId}.json`,
      method: "GET",
      success: function (item) {
        _populateForm(item).then(() => {
          if (modalInstance) modalInstance.show();
        });
      },
      error: function (xhr) {
        console.error("Failed to fetch item:", xhr);
        alert("Failed to load item data for editing.");
      }
    });
  });

  $(document.body).off("click", ".delete-button").on("click", ".delete-button", function () {
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
        alert("Unable to delete. This item is already used in another module.");
      }
    });
  });

  $btnConfirmNew.off("click").on("click", () => {
    const id = $itemId.val();
    const name = $inputName.val();
    const description = $inputDesc.val();
    const unit = $inputUnit.val();
    const category = $inputItemsCategory.val();
    const subCategoryId = $inputSubCategory.val();
    const parentId = $inputParentId.val() || null;
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
      sub_category_id: subCategoryId || null,
      parent_id: isParent ? null : parentId,
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
          if (errorData.errors && typeof errorData.errors === "object") {
            Object.keys(errorData.errors).forEach((field) => {
              errorData.errors[field].forEach((msg) => {
                errors.push(`${field.replace(/_/g, ' ')} ${msg}`);
              });
            });
          } else {
            errors.push("An unexpected error occurred.");
          }
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

  if (window.itemData) {
    _populateForm(window.itemData).then(() => {
      if (modalInstance) modalInstance.show();
    });
  }
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
