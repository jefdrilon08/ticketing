import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
console.log("Loading Administration Items Index module");
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
let childDetails = [];
let editingChildIndex = null;

const _cacheDom = () => {
  console.log("Caching DOM elements for Administration Items Index");
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

const _populateForm = (item) => {
  console.log("Populating form with item data:", item);
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
    resolve();
  });
};

function populateSubCategories(categoryId, selectedSubCategoryId = "") {
  const allChildSubCategories = JSON.parse($('#all-child-sub-categories-json').val() || '[]');
  const $subCategory = $('#child_sub_category_id');
  $subCategory.empty().append($('<option>', { value: '', text: '-- SELECT --' }));
  if (!categoryId) return;
  allChildSubCategories
    .filter(sc => String(sc.category_id) === String(categoryId))
    .forEach(sc => {
      $subCategory.append($('<option>', { value: sc.id, text: sc.name }));
    });
  if (selectedSubCategoryId) {
    $subCategory.val(selectedSubCategoryId);
  }
}

const _bindEvents = () => {
  console.log("Binding events for Administration Items Index");
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

const _bindChildAddEvents = () => {
  console.log("Binding child add events for Administration Items Index");
  function getText(selector) {
    return $(selector + " option:selected").text();
  }
  function getVal(selector) {
    return $(selector).val();
  }
  function toProperCase(str) {
    return (str || '').replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  function syncChildDetailsField() {
    $('#child-details-json').val(JSON.stringify(childDetails));
  }

  function renderChildTable() {
    const $tbody = $('#child-items-table tbody');
    $tbody.empty();
    if (childDetails.length === 0) {
      $tbody.append('<tr><td colspan="11" class="text-center text-muted">No child details yet.</td></tr>');
      return;
    }
    childDetails.forEach((child, idx) => {
      $tbody.append(
        `<tr>
          <td>${child.item_category || ''}</td>
          <td>${child.sub_category || ''}</td>
          <td>${child.name || ''}</td>
          <td>${child.description || ''}</td>
          <td>${child.brand || ''}</td>
          <td>${child.model || ''}</td>
          <td>${child.serial_number || ''}</td>
          <td>${child.unit || ''}</td>
          <td>${child.unit_price || ''}</td>
          <td>
            <button type="button" class="btn btn-warning btn-sm update-child" data-index="${idx}">Update</button>
            <button type="button" class="btn btn-danger btn-sm remove-child" data-index="${idx}">Remove</button>
          </td>
        </tr>`
      );
    });
  }

  $(document).off("change", "#child_item_category_id").on("change", "#child_item_category_id", function () {
    populateSubCategories($(this).val());
  });

  $(document).off("click", "#add-child-button").on("click", "#add-child-button", function () {
    var citemType = getText('#child_item_type');
    var citemTypeId = getVal('#child_item_type');
    var citemCategory = getText('#child_item_category_id');
    var citemCategoryId = getVal('#child_item_category_id');
    var csubCategory = getText('#child_sub_category_id');
    var csubCategoryId = getVal('#child_sub_category_id');
    var citemName = toProperCase(getVal('#child_item_name'));
    var cdescription = getVal('#child_description');
    var cbrand = getText('#child_brand_id');
    var cbrandId = getVal('#child_brand_id');
    var cmodel = getVal('#child_model');
    var cserial = getVal('#child_serial_number');
    var cunit = getVal('#child_unit');
    var cunitPrice = getVal('#child_unit_price');
    let cunitPriceFormatted = (parseFloat(cunitPrice) || 0).toFixed(2);

    const childData = {
      item_type: citemType,
      item_type_id: citemTypeId,
      item_category: citemCategory,
      item_category_id: citemCategoryId,
      sub_category: csubCategory,
      sub_category_id: csubCategoryId,
      name: citemName,
      description: cdescription,
      brand: cbrand,
      brand_id: cbrandId,
      model: cmodel,
      serial_number: cserial,
      unit: cunit,
      unit_price: cunitPriceFormatted
    };

    if (editingChildIndex !== null) {
      childDetails[editingChildIndex] = childData;
      editingChildIndex = null;
      $("#add-child-button").text("Add Child");
    } else {
      childDetails.push(childData);
    }
    syncChildDetailsField();
    renderChildTable();

    $('#child_item_type').val('');
    $('#child_item_category_id').val('');
    $('#child_sub_category_id').val('');
    $('#child_item_name').val('');
    $('#child_description').val('');
    $('#child_brand_id').val('');
    $('#child_model').val('');
    $('#child_serial_number').val('');
    $('#child_unit').val('');
    $('#child_unit_price').val('');
  });

  $(document).off("click", ".remove-child").on("click", ".remove-child", function () {
    const rowIndex = $(this).data("index");
    childDetails.splice(rowIndex, 1);
    syncChildDetailsField();
    renderChildTable();
  });

  $(document).off("click", ".update-child").on("click", ".update-child", function () {
    const index = $(this).data("index");
    editingChildIndex = index;
    const child = childDetails[index];

    $('#child_item_type').val(child.item_type_id || "");
    $('#child_item_category_id').val(child.item_category_id || "");
    populateSubCategories(child.item_category_id, child.sub_category_id);

    $('#child_item_name').val(child.name || "");
    $('#child_description').val(child.description || "");
    $('#child_brand_id').val(child.brand_id || "");
    $('#child_model').val(child.model || "");
    $('#child_serial_number').val(child.serial_number || "");
    $('#child_unit').val(child.unit || "");
    $('#child_unit_price').val(child.unit_price || "");

    $("#add-child-button").text("Update Child");
  });

  renderChildTable();
};

const init = (options) => {
  console.log("Initializing Administration Items Index");
  _authenticityToken = options.authenticityToken;
  _cacheDom();
  _bindEvents();
  _bindChildAddEvents();

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