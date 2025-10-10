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

    $(document).on("click", ".toggle-hold", function() {
        const $button = $(this);
        const ticketId = $button.data("ticket-id");
        const isHeld = $button.data("held") === "true";

        $.ajax({
            url: `/api/v1/tickets/concern_tickets/${ticketId}/toggle_hold`,
            method: "POST",
            contentType: "application/json",
            headers: {
                "X-CSRF-Token": _authenticityToken
            },
            success: function(response) {
                if (response.success) {
                    setTimeout(() => {
                        location.reload();
                    }, 100);
                } else {
                    alert("Failed to toggle hold: " + response.error);
                }
            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
                alert("Server error while toggling hold.");
            }
        });
    });

    $(document).on("click", ".update-status", function() {

        var $button = $(this);
        var ticketNumber = $button.data("ticket-number");
        var newStatus = $button.data("status");
        var reprocess = $button.data("reprocess") ? 'true' : 'false';

        _updateTicketStatus(ticketNumber, newStatus, $button, reprocess);
    });
};

var _updateTicketStatus = function(ticketNumber, newStatus, $button, reprocess) {
    $.ajax({
        url: "/api/v1/tickets/concern_tickets/update_status",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
            "X-CSRF-Token": _authenticityToken
        },
        data: JSON.stringify({ ticket_number: ticketNumber, status: newStatus, reprocess: reprocess }),

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

//pang print sa table
var printTable = function () {
    const tableContent = document.getElementById('printable-table');
    if (!tableContent) {
      console.warn("No printable table found!");
      return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Concern Ticket</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');

    printWindow.document.write(`
      <style>
        @media print {
          .no-print { display: none !important; }
        }

        table {
          width: 100% !important;
          border-collapse: collapse !important;
        }

        th, td {
          border: 1px solid black !important;
          padding: 8px !important;
          text-align: center !important;
        }

        tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important; /* for better browser support */
        }
      </style>
    `);

    printWindow.document.write('</head><body>');
    printWindow.document.write('<h4>Concern Ticket List</h4>');
    printWindow.document.write(tableContent.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  window.printTable = printTable;


export default { init: init };
