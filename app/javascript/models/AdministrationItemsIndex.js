import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew;
let $btnUpdate;
let $btnConfirmNew;
let $inputName;
let $inputDesc;
let $inputUnit;
let $inputItemsCategory;
let $inputStatus;
let $modalNew;
let $message;
let $itemId;
let _authenticityToken;

let templateErrorList;

const _cacheDom = () => {
  $btnNew             = $("#btn-new");
  $btnUpdate          = $(".update-button");
  $btnConfirmNew      = $("#btn-confirm-new");
  $inputName          = $("#input-name");
  $inputDesc          = $("#input-description");
  $inputUnit          = $("#input-unit");
  $inputItemsCategory = $("#input-items-category");
  $inputStatus        = $("#input-status");
  $itemId             = $("#item-id");
  $modalNew           = new bootstrap.Modal(document.getElementById("modal-new"));
  $message            = $(".message");
  templateErrorList   = $("#template-error-list").html() || "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

const _bindEvents = () => {

  $btnNew.on("click", () => {
    $inputName.val("");
    $inputDesc.val("");
    $inputUnit.val("");
    $inputItemsCategory.val("");
    $inputStatus.val("Active"); 
    $itemId.val("");

    $inputStatus.closest('.status-group').hide();
    $modalNew.show();
    $message.html("");
  });


  $(document).on("click", ".update-button", function() {
    const _id           = $(this).data("id");
    const _name         = $(this).data("name");
    const _description  = $(this).data("description");
    const _unit         = $(this).data("unit");
    const _itemsCategory= $(this).data("itemsCategory");
    const _status       = $(this).data("status");

    $itemId.val(_id);
    $inputName.val(_name);
    $inputDesc.val(_description);
    $inputUnit.val(_unit);
    $inputItemsCategory.val(_itemsCategory);
    $inputStatus.val(_status);

    $inputStatus.closest('.status-group').show();
    $modalNew.show();
    $inputName.focus();
  });


  $btnConfirmNew.on("click", () => {
    const id              = $itemId.val();
    const name            = $inputName.val();
    const description     = $inputDesc.val();
    const unit            = $inputUnit.val();
    const itemsCategoryId = $inputItemsCategory.find("option:selected").val();
    const status          = $inputStatus.val();

    if (itemsCategoryId === "") {
      alert("Please select a category value");
      return;
    }
    if (id && status === "") { 
      alert("Please select a valid status");
      return;
    }

    const data = {
      name:              name,
      description:       description,
      unit:              unit,
      status:            status,
      id:                id,
      items_category_id: itemsCategoryId,
      authenticity_token: _authenticityToken
    };

    let url    = "/api/v1/administration/items/create";
    let method = "POST";

    if (id) {
      url    = "/api/v1/administration/items/update";
      method = "PUT";
    }

    $.ajax({
      url: url,
      method: method,
      data: data,
      success: function(response) {
        alert(id ? "Successfully Updated!" : "Successfully Saved!");
        window.location.reload();
      },
      error: function(response) {
        const errorTemplate = "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
        let errors = [];
        try {
          const errorData = JSON.parse(response.responseText);
          errors = Array.isArray(errorData.messages)
            ? errorData.messages.map(err => err.message)
            : [errorData.messages || "An unexpected error occurred."];
        } catch (err) {
          errors.push("Something went wrong. Please try again.");
        }
        $btnConfirmNew.prop("disabled", false);
        $message.html(Mustache.render(errorTemplate, { errors })).addClass("text-danger");
      }
    });
  });

  $(document).on("click", ".delete-button", function() {
    const id = $(this).data("id");
    $message.html("").removeClass("text-danger");

    if (confirm("Are you sure you want to delete this Item record?")) {
      $.ajax({
        url: "/api/v1/administration/items/delete",
        method: "POST",
        data: {
          id: id,
          authenticity_token: _authenticityToken
        },
        success: function(response) {
          alert("Item record successfully deleted!");
          window.location.reload();
        },
        error: function(response) {
          let errors = [];
          try {
            errors = JSON.parse(response.responseText).messages;
          } catch (err) {
            errors.push("Something went wrong");
          }
          $message.html(Mustache.render(templateErrorList, { errors }));
        }
      });
    }
  });
};

const init = (options) => {
  _authenticityToken = options.authenticityToken;
  _cacheDom();
  _bindEvents();
};

export default { init };
