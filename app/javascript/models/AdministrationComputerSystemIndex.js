import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $btnConfirmNew;
var $inputName;
var $inputDesc;
var $modalNew;
var $message;
var $id;
var _authenticityToken;

var templateErrorList;

var _cacheDom = function() {
  $btnNew         = $("#btn-new");
  $btnUpdate      = $(".update-button")
  $btnConfirmNew  = $("#btn-confirm-new");
  $inputName      = $("#input-name");
  $inputDesc      = $("#input-description");
  $modalNew       = $("#modal-new");
  $id             = $("#id");

  $modalNew = new bootstrap.Modal(
    document.getElementById('modal-new')
  );

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $inputName.val("");
    $inputDesc.val("");
    $id.val("");
      $modalNew.show();
      $message.html("");
  });

  $(document).on("click", ".update-button", function(){
    var _id          = $(this).data("id")
    var _name        = $(this).data("name")
    var _description = $(this).data("description")
    
    $id.val(_id)
    $inputName.val(_name);
    $inputDesc.val(_description);
    $modalNew.show();
    $inputName.focus()
    
 });

  $btnConfirmNew.on("click", function() {
    var id          = $id.val();
    var name        = $inputName.val();
    var description = $inputDesc.val();

    // $btnConfirmNew.prop("disabled", true);
    // $inputName.prop("disabled", true);

    var data = {
      name:        name,
      description: description,
      status:      "active",
      id:          id,
      authenticity_token: _authenticityToken
    };

    var url = "/api/v1/administration/computer_system/create"; 
    var method = 'POST';  

    if (id) {
      url = "/api/v1/administration/computer_system/update"; 
      method = 'PUT';
    }

    $.ajax({
      url: url,
      method: method,
      data: data,
      success: function(response) {
        if (id) {
          alert("Successfuly Updated!")
        } else {
          alert("Successfully Saved!");
        }
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var templateErrorList = `<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>`;
        var errors  = [];
        try {
            var errorData = JSON.parse(response.responseText);
            errors = Array.isArray(errorData.messages) ? 
                  errorData.messages.map(err => err.message) : 
                  [errorData.messages || "An unexpected error occurred."];
        } catch {
            errors.push("Something went wrong. Please try again.");
            console.log(response);
        } 
        $btnConfirmNew.prop("disabled", false);
        $message.html(Mustache.render(templateErrorList, { errors })).addClass("text-danger");
      }
    });
  });

  // Delete button 
  $(document).on("click", ".delete-button", function() {
    var Id = $(this).data("id");

    // Clear previous messages
    $message.html("");
    $message.removeClass("text-danger");

    // Confirm before deletion
    if (confirm("Are you sure you want to delete this Computer System record?")) {
        $.ajax({
            url: "/api/v1/administration/computer_system/delete",
            method: "POST",
            data: {
              id: Id,
              authenticity_token: _authenticityToken
            },
            success: function(response) {
                alert("Computer System record successfully deleted!");
                window.location.reload();
            },
            error: function(response) {
                var errors = [];
                try {
                    errors = JSON.parse(response.responseText).messages;
                } catch (err) {
                    errors.push("Something went wrong");
                    console.log(response);
                }
                $message.html(
                    Mustache.render(templateErrorList, { errors: errors })
                );
            }
        });
    }
  });
}

var init  = function(options) {
  _id                = options.id;
  _authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
