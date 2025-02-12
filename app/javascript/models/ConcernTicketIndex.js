import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _id;
var _authenticityToken;

var $modalNew;
var $btnNew; 
var $btnConfirm;
var $concernTextbox;
var $concernid;
var $message;
var $computerSystemTextbox


var _cacheDom = function() {
    $btnNew                 = $("#btn-new");
    $btnConfirm             = $("#btn-confirm");
    $concernTextbox         = $("#concern-textbox")
    $concernid              = $("#concern-id")
    $message                = $(".message");
    $computerSystemTextbox  = $("#computer-system");

    $modalNew 	= new bootstrap.Modal(
        document.getElementById("modal-new"));
}

var _bindEvents = function() {
    $btnNew.on("click", function() {
      $message.html("");
      $concernTextbox.val("");
      $computerSystemTextbox.val("");
    //   $concernid.val("");
      $modalNew.show();
    });


    $btnConfirm.on("click", function(){
        console.log("ETO GUMAGANA NAMAN SIYA")
        var concernTextbox              = $concernTextbox.val().trim();
        var computerSystemTextbox      = $computerSystemTextbox.val();
        // var concernId                   = $concernid.val();

        // // Clear previous message
        $message.html("");
        $message.removeClass("text-danger"); // Remove any previous error class

        // // Validation checks
        var messages = {
            both: "Please provide fields.",
            concern: "Please provide the concern name.",
            computer_system: "Please select a system."
        };

        var missingField = !concernTextbox && !computerSystemTextbox ? "both" : !concernTextbox ? "concern" : !computerSystemTextbox ? "computer_system" : null;

        if (missingField) {
            $message.html(messages[missingField]);
            $message.addClass("text-danger");
            return;
        }

        var data = {
            concern_name: concernTextbox,
            computer_system_id: computerSystemTextbox,
            status: "active",
            authenticity_token: _authenticityToken
        };

        $.ajax({
            url: "/api/v1/ticket_concern/concern_tickets/create",
            method: 'POST',
            data: data,
            success: function(response) {
                alert("Successfully created!");
                window.location.reload();
            },
            error: function(response) {
                var errors = [];
                try {
                    errors = JSON.parse(response.responseText).messages;
                } catch(err) {
                    errors.push("Something went wrong");
                    console.log(response);
                }
                $message.html(
                    Mustache.render(templateErrorList, { errors: errors })
                );
            }
        });

        // if (holidayId) {
        //     data.id = holidayId; 
        //     $.ajax({
        //         url: "/api/v1/data_stores/holiday_records/update",
        //         method: 'PUT',
        //         data: data,
        //         success: function(response) {
        //             alert("Successfully updated!");
        //             window.location.reload();
        //         },
        //         error: function(response) {
        //             var errors = [];
        //             try {
        //                 errors = JSON.parse(response.responseText).messages;
        //             } catch(err) {
        //                 errors.push("Something went wrong");
        //                 console.log(response);
        //             }
        //             $message.html(
        //                 Mustache.render(templateErrorList, { errors: errors })
        //             );
        //         }
        //     });
        // } else {
        //     // If no holidayId, create a new holiday record (POST)
            
        // }
    });
}

var init = function(options) {
    _id                 = options.id;
    _authenticityToken  = options.authenticityToken;

    _cacheDom();
    _bindEvents();
};


export default { init: init };
