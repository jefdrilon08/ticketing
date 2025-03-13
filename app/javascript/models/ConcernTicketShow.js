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

};

var init = function(options) {
    _authenticityToken = options.authenticityToken;
    _cacheDom();
    _bindEvents();
};

export default { init: init };