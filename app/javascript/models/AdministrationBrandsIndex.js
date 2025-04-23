import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew;
let $btnConfirmNew;
let $inputName;
let $inputCode;
let $inputItemId;
let $itemId;
let $modalNew;
let $message;
let _authenticityToken;

let templateErrorList;

const _cacheDom = () => {
  $btnNew = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");
  $inputName = $("#input-name");
  $inputCode = $("#input-code");
  $inputItemId = $("#input-item-id");
  $itemId = $("#item-id");

  $modalNew = new bootstrap.Modal(document.getElementById("modal-new"));
  $message = $(".message");
  templateErrorList =
    $("#template-error-list").html() ||
    "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

const _bindEvents = () => {
  $btnNew.on("click", function (e) {
    e.preventDefault();
    $inputName.val("");
    $inputCode.val("");
    $inputItemId.val("");
    $itemId.val("");
    $modalNew.show();
    $message.html("");
  });

  $(document).on("click", ".update-button", function (e) {
    e.preventDefault();
    const _id = $(this).data("id");
    const _name = $(this).data("name");
    const _code = $(this).data("code");
    const _itemId = $(this).data("item-id");

    $itemId.val(_id);
    $inputName.val(_name);
    $inputCode.val(_code);
    $inputItemId.val(_itemId);
    $modalNew.show();
    $inputName.focus();
  });

  $btnConfirmNew.on("click", function (e) {
    e.preventDefault();
    const id = $itemId.val();
    const name = $inputName.val();
    const code = $inputCode.val();
    const item_id = $inputItemId.val();

    if (!name) {
      alert("Name cannot be blank");
      return;
    }
    if (!code) {
      alert("Code cannot be blank");
      return;
    }
    if (!item_id) {
      alert("Please select an item");
      return;
    }

    const data = {
      name: name,
      code: code,
      item_id: item_id,
      id: id,
      authenticity_token: _authenticityToken,
    };

    let url = "/api/v1/administration/brands/create";
    let method = "POST";

    if (id) {
      url = "/api/v1/administration/brands/update";
      method = "POST";
      data._method = "PUT";
    }

    console.log("AJAX Request:", url, method, data);

    $.ajax({
      url: url,
      type: method,
      data: data,
      dataType: "json",
      success: function () {
        alert(id ? "Successfully Updated!" : "Successfully Saved!");
        window.location.reload();
      },
      error: function (response) {
        const errorTemplate = "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
        let errors = [];
        try {
          const errorData = JSON.parse(response.responseText);
          errors = Array.isArray(errorData.messages)
            ? errorData.messages.map((err) => err.message || err)
            : [errorData.messages || "An unexpected error occurred."];
        } catch (err) {
          errors.push("Something went wrong. Please try again.");
        }
        $btnConfirmNew.prop("disabled", false);
        $message.html(Mustache.render(errorTemplate, { errors })).addClass("text-danger");
      },
    });
  });

  $(document).on("click", ".delete-button", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    $message.html("").removeClass("text-danger");

    if (confirm("Are you sure you want to delete this Brand?")) {
      $.ajax({
        url: "/api/v1/administration/brands/delete",
        type: "POST",
        data: {
          id: id,
          authenticity_token: _authenticityToken,
        },
        success: function () {
          alert("A Brand is successfully deleted!");
          window.location.reload();
        },
        error: function (response) {
          let errors = [];
          try {
            errors = JSON.parse(response.responseText).messages;
          } catch (err) {
            errors.push("Something went wrong");
          }
          $message.html(Mustache.render(templateErrorList, { errors }));
        },
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