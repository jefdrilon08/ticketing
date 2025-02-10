import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _id;
var _authenticityToken;

var $modalNew;
var $btnNew; 

// var $message;

console.log("TEST!");

var _cacheDom = function() {
    console.log("BOHAI");
    $btnNew      = $("#btn-new");
    // console.log("Button:", $btnNew.length > 0 ? "Found" : "Not Found");
    $modalNew 	= new bootstrap.Modal(
        document.getElementById("modal-new"));
}

var _bindEvents = function() {
      $btnNew.on("click", function() {
      // $message.html("");
      console.log("Button Clicked:", document.getElementById("btn-new"));
      $modalNew.show();
    });
}

var init = function(options) {
    // console.log("ConcernTicketIndex.js: init() called with config:", config);
    _id                 = options.id;
    _authenticityToken  = options.authenticityToken;

    _cacheDom();
    _bindEvents();
};


export default { init: init };
