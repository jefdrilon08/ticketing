import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirm;
var $inputName;
var $inputTicketName;
var $inputDesc;
var $id;
var $message;
var $inputComputerSystem;
var $displayComputerSystemName;
var templateErrorList;

var _cacheDom = function() {
    // $btnNew                     = $("#btn-new");
    // $btnConfirm                 = $("#btn-confirm");
    // $inputName                  = $("#input-name");
    // $inputTicketName            = $("#input-ticket_name");
    // $inputDesc                  = $("#input-description");
    // $inputComputerSystem        = $("#input-computer-system");
    // $displayComputerSystemName = $("#display-computer-system-name");
    // $id                         = $("#id");
    
    // $modalNew  = new bootstrap.Modal(document.getElementById("modal-new"));
    // $message   = $(".message");
    // templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
    // $btnNew.on("click", function() {
    //     $inputName.val("");
    //     $inputDesc.val("");
    //     $inputComputerSystem.val("");
    //     $displayComputerSystemName.text("");
    //     $id.val("");
    //     $modalNew.show();
    //     $message.html("");
    // });

    // $btnConfirm.on("click", function() {
    //     var id = $id.val();
    //     var name = $inputName.val();
    //     var description = $inputDesc.val();
    //     var computer_system_id = $inputComputerSystem.val();
    
    //     var data = {
    //         name: name,
    //         description: description,
    //         computer_system_id: computer_system_id,
    //         status: "active",
    //         id: id,
    //         authenticity_token: _authenticityToken
    //     };
        
    //     var url = "/api/v1/tickets/concern_tickets"; 
    //     var method = 'POST';
    //     if (id) {
    //         url = "/api/v1/tickets/concern_tickets/update"; 
    //         method = 'PUT';
    //     }
    
    //     $.ajax({
    //         url: url,
    //         method: method,
    //         data: data,
    //         success: function(response) {
    //             if (response.data) {
    //                 var ticket = response.data;
    //                 alert("Successfully " + (id ? "Updated" : "Saved") + "!");
    //                 $displayComputerSystemName.text(ticket.computer_system_name || "");
    //             }
    //             window.location.reload();
    //         },
    //         error: function(response) {
    //             var templateErrorList = `<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>`;
    //             var errors  = [];
    //             try {
    //                 var errorData = JSON.parse(response.responseText);
    //                 errors = Array.isArray(errorData.messages) ? 
    //                     errorData.messages.map(err => err.message) : 
    //                     [errorData.messages || "An unexpected error occurred."];
    //             } catch {
    //                 errors.push("Something went wrong. Please try again.");
    //             }
    //             $btnConfirm.prop("disabled", false);
    //             $message.html(Mustache.render(templateErrorList, { errors })).addClass("text-danger");
    //         }
    //     });
    // });
}

var init = function(options) {
    _authenticityToken = options.authenticityToken;
    _cacheDom();
    _bindEvents();
};

export default { init: init };