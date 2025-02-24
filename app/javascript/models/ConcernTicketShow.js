import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;

var $modalCreateTicket;
var $btnCreateTicket;
var $btnConfirm;
var $inputName;
var $inputDesc;
var $inputComputerSystem;
var $displayComputerSystemName;
var $message;
var templateErrorList;

var _cacheDom = function() {
    $btnCreateTicket            = $("#btn-create-ticket");
    $btnConfirm                 = $("#btn-confirm");
    $inputName                  = $("#input-name");
    $inputDesc                  = $("#input-description");
    $inputComputerSystem        = $("#input-computer-system");
    $displayComputerSystemName  = $("#display-computer-system-name");
    
    $modalCreateTicket = new bootstrap.Modal(document.getElementById("modal-create-ticket"));
    $message   = $(".message");
    templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {
    $btnCreateTicket.on("click", function() {
        
        $inputName.val("");
        $inputDesc.val("");
        $inputComputerSystem.val("");
        $displayComputerSystemName.text("");
        $modalCreateTicket.show();
        $message.html("");
    });

    $btnConfirm.on("click", function() {
        var name = $inputName.val();
        var description = $inputDesc.val();
        var computer_system_id = $inputComputerSystem.val();
    
        var data = {
            name: name,
            description: description,
            computer_system_id: computer_system_id,
            status: "active",
            authenticity_token: _authenticityToken
        };
        
        var url = "/api/v1/tickets/concern_tickets";
    
        $.ajax({
            url: url,
            method: "POST",
            data: data,
            success: function(response) {
                if (response.data) {
                    var ticket = response.data;
                    alert("Successfully Created!");
                    $displayComputerSystemName.text(ticket.computer_system_name || "");
                }
                window.location.reload();
            },
            error: function(response) {
                var templateErrorList = `<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>`;
                var errors = [];
                try {
                    var errorData = JSON.parse(response.responseText);
                    errors = Array.isArray(errorData.messages) ? 
                        errorData.messages.map(err => err.message) : 
                        [errorData.messages || "An unexpected error occurred."];
                } catch {
                    errors.push("Something went wrong. Please try again.");
                }
                $btnConfirm.prop("disabled", false);
                $message.html(Mustache.render(templateErrorList, { errors })).addClass("text-danger");
            }
        });
    });
};

var init = function(options) {
    console.log("Opening Create Ticket Modal");
    _authenticityToken = options.authenticityToken;
    _cacheDom();
    _bindEvents();
};

export default { init: init };