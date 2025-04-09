import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

let $btnNew;
let $btnConfirmNew;
let $inputName;
let $inputCode;
let $inputStatus;
let $inputContactPerson;
let $inputContactNumber;
let $inputAddress;
let $modalNew;
let $message;
let _authenticityToken;

let templateErrorList;
let supplierId = null;
 
const _cacheDom = () => {
  $btnNew = $("#btn-new");
  $btnConfirmNew = $("#btn-confirm-new");
  $inputName = $("#input-name");
  $inputCode = $("#input-code");
  $inputStatus = $("#input-status");
  $inputContactPerson = $("#input-contact-person");
  $inputContactNumber = $("#input-contact-number");
  $inputAddress = $("#input-address");

  $modalNew = new bootstrap.Modal(document.getElementById("modal-new"));
  $message = $(".message");
  templateErrorList =
    $("#template-error-list").html() ||
    "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

const _bindEvents = () => {
  $(document).on("input", "#input-contact-number", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  $btnNew.on("click", function(e) {
    e.preventDefault();
    supplierId = null;
    $inputName.val("");
    $inputCode.val("");
    $inputStatus.val("Active");
    $inputStatus.closest(".status-group").hide();
    $("#item-id").val("");

    $inputContactPerson.val("");
    $inputContactNumber.val("");
    $inputAddress.val("");

    // console.log("New Supplier form cleared", {
    //   name: $inputName.val(),
    //   code: $inputCode.val(),
    //   status: $inputStatus.val(),
    //   contact_person: $inputContactPerson.val(),
    //   contact_number: $inputContactNumber.val(),
    //   address: $inputAddress.val()
    // });

    $modalNew.show();
    $message.html("");
  });

  $(document).on("click", ".update-button", function(e) {
    e.preventDefault();
    supplierId = $(this).data("id");
    $("#item-id").val(supplierId);

    const _name = $(this).data("name");
    const _code = $(this).data("code");
    const _statusRaw = $(this).data("status");

    const _statusMap = {
      true: "Active",
      false: "Inactive",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending"
    };
    const _status = _statusMap[_statusRaw.toString().toLowerCase()] || "";

    $inputName.val(_name);
    $inputCode.val(_code);
    $inputStatus.val(_status);
    $inputStatus.closest(".status-group").show();

    const cp = $(this).data("contact-person") || "";
    const cn = $(this).data("contact-number") || "";
    const addr = $(this).data("address") || "";
    $inputContactPerson.val(cp);
    $inputContactNumber.val(cn);
    $inputAddress.val(addr);

    console.log("Update Supplier pre-populated", {
      id: supplierId,
      name: _name,
      code: _code,
      status: _status,
      contact_person: cp,
      contact_number: cn,
      address: addr
    });

    $modalNew.show();
    $inputName.focus();
  });

  $btnConfirmNew.on("click", function(e) {
    e.preventDefault();

    const name = $inputName.val();
    const code = $inputCode.val();
    const statusStr = $inputStatus.val();
    const status = statusStr === "Active";

    const contactPerson = $inputContactPerson.val();
    const contactNumber = $inputContactNumber.val();
    const address = $inputAddress.val();

    console.log("Confirm button clicked", {
      name,
      code,
      status,
      contact_person: contactPerson,
      contact_number: contactNumber,
      address
    });

    if (!name) {
      alert("Name cannot be blank");
      return;
    }
    if (!code) {
      alert("Code cannot be blank");
      return;
    }

    const data = {
      name: name,
      code: code,
      status: status,
      contact_person: contactPerson,
      contact_number: contactNumber,
      address: address,
      id: supplierId,
      authenticity_token: _authenticityToken
    };

    console.log("AJAX Payload:", data);

    let url = "/api/v1/administration/suppliers/create";
    let method = "POST";

    if (supplierId) {
      url = "/api/v1/administration/suppliers/update";
      method = "POST";
      data._method = "PUT";
    }

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
            ? errorData.messages.map(err => err.message || err)
            : [errorData.messages || "An unexpected error occurred."];
        } catch (err) {
          errors.push("Something went wrong. Please try again.");
        }
        console.log("AJAX Error:", errors);
        $btnConfirmNew.prop("disabled", false);
        $message.html(Mustache.render(errorTemplate, { errors })).addClass("text-danger");
      }
    });
  });

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
          console.log("Delete Error:", errors);
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
