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

// Retrieve CSRF Token from meta tag
var _setAuthenticityToken = function() {
    _authenticityToken = $("meta[name='csrf-token']").attr("content");
};

// Cache DOM elements
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
        console.error(" Modal element #modal-create-ticket not found.");
    }

    $message = $(".message");
    templateErrorList = $("#template-error-list").html();
};

// Bind Events
var _bindEvents = function() {
    // Show modal when clicking "Create Ticket"
    $btnCreateTicket.on("click", function() {
        $inputName.val("");
        $inputDesc.val("");
        $inputComputerSystem.val("");
        $displayComputerSystemName.text("");
        
        if ($modalCreateTicket) {
            $modalCreateTicket.show();
        } else {
            console.error(" Modal not initialized.");
        }

        $message.html("");
    });

    // Attach click event to the status update buttons
    $(document).on("click", ".update-status", function() {
        console.log("✅ Button clicked!");

        var $button = $(this);
        var ticketNumber = $button.data("ticket-number");
        var newStatus = $button.data("status");

        console.log("Ticket:", ticketNumber, "New Status:", newStatus);

        _updateTicketStatus(ticketNumber, newStatus, $button);
    });
};

// Function to send AJAX request and update UI
var _updateTicketStatus = function(ticketNumber, newStatus, $button) {
    $.ajax({
        url: "/api/v1/tickets/concern_tickets/update_status",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
            "X-CSRF-Token": _authenticityToken // ✅ Ensure CSRF token is included
        },
        data: JSON.stringify({ ticket_number: ticketNumber, status: newStatus }),

        success: function(response) {
            if (response.success) {
                _updateTicketUI(response.status, ticketNumber);
            } else {
                alert("Error updating ticket: " + response.error);
            }
        },

        error: function(xhr) {
            console.error(" Error:", xhr.responseText);
            alert("Failed to update the ticket. Please try again.");
        }
    });
};

// Function to update the UI after status change
var _updateTicketUI = function(status, ticketNumber) {
    console.log("✅ UpdateUI loaded!");
    var $statusBadge = $("#ticket-status-badge");
    var $buttonContainer = $(".card-footer.d-flex.justify-content-end");

    // Update Status Badge
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

    // Update Buttons
    if ($buttonContainer.length) {
        console.log(" Button Container loaded!");
        var newButtonHtml = "";

        if (status === "processing") {
            newButtonHtml = `<button class="btn btn-warning fs-6 me-2 update-status" data-ticket-number="${ticketNumber}" data-status="verification">Move for Verification</button>`;
        } else if (status === "verification") {
            newButtonHtml = `<button class="btn btn-danger fs-6 me-2 update-status" data-ticket-number="${ticketNumber}" data-status="closed">Close Ticket</button>`;
        }

        $buttonContainer.html(newButtonHtml);
    }
};

// Initialize the module
var init = function() {
    console.log(" Init Working loaded!");
    _setAuthenticityToken();
    _cacheDom();
    _bindEvents();
};

// Ensure CSRF token is set and events are bound when the page loads
$(document).ready(function() {
    console.log(" JavaScript loaded!");
    init();
});

export default { init: init };
