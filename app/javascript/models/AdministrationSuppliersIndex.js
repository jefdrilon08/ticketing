import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew;
let $btnConfirmNew;
let $inputName;
let $inputCode;
let $inputStatus;
let $modalNew;
let $message;
let _authenticityToken;

let templateErrorList;
// Variable to hold the supplier ID
let supplierId = null;

const _cacheDom = () => {
  $btnNew = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");
  $inputName = $("#input-name");
  $inputCode = $("#input-code");
  $inputStatus = $("#input-status");

  $modalNew = new bootstrap.Modal(document.getElementById("modal-new"));
  $message = $(".message");
  templateErrorList =
    $("#template-error-list").html() ||
    "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

const _bindEvents = () => {

  // NEW SUPPLIER: Clear form, set status to Active, and hide the status field group
  $btnNew.on("click", function(e) {
    e.preventDefault();
    supplierId = null;
    $inputName.val("");
    $inputCode.val("");
    $inputStatus.val("Active"); // Automatically set status to "Active"
    $inputStatus.closest('.status-group').hide(); // Hide status group for new records
    $("#item-id").val(""); // Clear the hidden supplier ID field
    $modalNew.show();
    $message.html("");
  });

  // UPDATE SUPPLIER: Populate form with supplier data and show status field group
  $(document).on("click", ".update-button", function(e) {
    e.preventDefault();
    supplierId = $(this).data("id");
    // Update hidden field with supplier ID
    $("#item-id").val(supplierId);
    
    const _name = $(this).data("name");
    const _code = $(this).data("code");
    const _statusRaw = $(this).data("status");
    // Normalize the status to match select options (e.g., "Active")
    const _status = _statusRaw
      ? _statusRaw.charAt(0).toUpperCase() + _statusRaw.slice(1).toLowerCase()
      : "";
    
    $inputName.val(_name);
    $inputCode.val(_code);
    $inputStatus.val(_status);
    $inputStatus.closest('.status-group').show(); // Show status group for updates
    $modalNew.show();
    $inputName.focus();
  });

  // CONFIRM (Create/Update) Supplier
  $btnConfirmNew.on("click", function(e) {
    e.preventDefault();
    const name = $inputName.val();
    const code = $inputCode.val();
    const status = $inputStatus.val();

    if (!name) {
      alert("Name cannot be blank");
      return;
    }
    if (!code) {
      alert("Code cannot be blank");
      return;
    }
    if (!status) {
      alert("Status must be selected");
      return;
    }

    const data = {
      name: name,
      code: code,
      status: status,
      id: supplierId, // Use the supplierId variable
      authenticity_token: _authenticityToken
    };

    let url = "/api/v1/administration/suppliers/create";
    let method = "POST";

    if (supplierId) {
      url = "/api/v1/administration/suppliers/update";
      method = "POST";
      data._method = "PUT";
    }

    console.log("AJAX Request:", url, method, data);

    $.ajax({
      url: url,
      type: method,
      data: data,
      dataType: "json",
      success: function(response) {
        alert(supplierId ? "Successfully Updated!" : "Successfully Saved!");
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

  // DELETE SUPPLIER
  $(document).on("click", ".delete-button", function(e) {
    e.preventDefault();
    const id = $(this).data("id");
    $message.html("").removeClass("text-danger");

    if (confirm("Are you sure you want to delete this Supplier record?")) {
      $.ajax({
        url: "/api/v1/administration/suppliers/delete",
        type: "POST",
        data: {
          id: id,
          authenticity_token: _authenticityToken
        },
        success: function(response) {
          alert("Supplier record successfully deleted!");
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
