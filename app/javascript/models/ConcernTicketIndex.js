import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _id;
var _authenticityToken;

var $modalNew;
var $btnNew; 
var $btnConfirm;
var $inputName;
var $inputDesc;
var $id;
var $message;
var $inputComputerSystem;
var templateErrorList;


var _cacheDom = function() {
    $btnNew                 = $("#btn-new");
    $btnConfirm             = $("#btn-confirm");
    $inputName              = $("#input-name");
    $inputDesc              = $("#input-description");
    $inputComputerSystem    = $("#input-computer-system");
    $id                     = $("#id");
    
    $modalNew 	= new bootstrap.Modal(
        document.getElementById("modal-new"));

    $message                = $(".message");
    templateErrorList       = $("#template-error-list").html();
}

var _bindEvents = function() {
    $btnNew.on("click", function() {
        $inputName.val("");
        $inputDesc.val("");
        $inputComputerSystem.val("");
        $id.val("");
          $modalNew.show();
          $message.html("");
      });


    $btnConfirm.on("click", function() {
        console.log("NAPIPINDOT NAMAN SIYA")
        var id          = $id.val();
        var name        = $inputName.val();
        var description = $inputDesc.val();
        var description = $inputComputerSystem.val();
    
        var data = {
          name:        name,
          description: description,
          status:      "active",
          id:          id,
          authenticity_token: _authenticityToken
        };
    
        var url = "/api/v1/ticket_concern/concern_tickets/create"; 
        var method = 'POST';  
    
        if (id) {
          url = "/api/v1/ticket_concern/concern_tickets/update"; 
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
            $btnConfirm.prop("disabled", false);
            $message.html(Mustache.render(templateErrorList, { errors })).addClass("text-danger");
          }
        });
      });
}

var init = function(options) {
    _id                 = options.id;
    _authenticityToken  = options.authenticityToken;

    _cacheDom();
    _bindEvents();
};

export default { init: init };
