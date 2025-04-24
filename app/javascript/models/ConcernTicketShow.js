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

var _setAuthenticityToken = function() {
    _authenticityToken = $("meta[name='csrf-token']").attr("content");
};

var _cacheDom = function() {
    $btnCreateTicket            = $("#btn-create-ticket");
    $btnConfirm                 = $("#btn-confirm");
    $inputName                  = $("#input-name");
    $inputDesc                  = $("#input-description");
    $inputComputerSystem        = $("#input-computer-system");
    $displayComputerSystemName  = $("#display-computer-system-name");
    
    var modalElement = document.getElementById("modal-create-ticket");
    if (modalElement) {
        $modalCreateTicket = new bootstrap.Modal(modalElement);
    } else {
        console.log("")
    }
    $message = $(".message");
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

    $(document).on("click", ".update-status", function() {
        console.log("Button clicked!");

        var $button = $(this);
        var ticketNumber = $button.data("ticket-number");
        var newStatus = $button.data("status");

        console.log("Ticket:", ticketNumber, "New Status:", newStatus);

        _updateTicketStatus(ticketNumber, newStatus, $button);
    });
};

var _updateTicketStatus = function(ticketNumber, newStatus, $button) {
    $.ajax({
        url: "/api/v1/tickets/concern_tickets/update_status",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
            "X-CSRF-Token": _authenticityToken
        },
        data: JSON.stringify({ ticket_number: ticketNumber, status: newStatus }),

        success: function(response) {
            if (response.success) {
                _updateTicketUI(response.status, ticketNumber);

                setTimeout(function() {
                    location.reload();
                }, 500); // delay
            } else {
                alert("Error updating ticket: " + response.error);
            }
        },

        error: function(xhr) {
            console.error("Error:", xhr.responseText);
            alert("Failed to update the ticket. Please try again.");
        }
    });
};

var _updateTicketUI = function(status, ticketNumber) {
    var $statusBadge = $("#ticket-status-badge");
    var $buttonContainer = $(".card-footer.d-flex.justify-content-end");

    // Palit ng status
    if ($statusBadge.length) {
        var badgeClass = "badge bg-secondary fs-7";

        switch (status) {
            case "open":
                badgeClass = "badge bg-success fs-7";
                break;
            case "processing":
                badgeClass = "badge bg-primary fs-7";
                break;
            case "verification":
                badgeClass = "badge bg-warning text-dark fs-7";
                break;
            case "closed":
                badgeClass = "badge bg-danger fs-7";
                break;
        }
        $statusBadge.attr("class", badgeClass).text(status.charAt(0).toUpperCase() + status.slice(1));
    }

    // Palit ng button
    if ($buttonContainer.length) {
        console.log("Button Container loaded!");
        var newButtonHtml = "";

        if (status === "processing") {
            newButtonHtml = `<button class="btn btn-warning fs-6 me-2 update-status" data-ticket-number="${ticketNumber}" data-status="verification">Move for Verification</button>`;
        } else if (status === "verification") {
            newButtonHtml = `<button class="btn btn-danger fs-6 me-2 update-status" data-ticket-number="${ticketNumber}" data-status="closed">Close Ticket</button>`;
        }
        $buttonContainer.html(newButtonHtml);
    }
};

var init = function() {
    _setAuthenticityToken();
    _cacheDom();
    _bindEvents();
};

$(document).ready(function() {
    init();
});


export default { init: init };
