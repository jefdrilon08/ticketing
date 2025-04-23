import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnCreate;
var $modalCreate;
var $message;
var _authenticityToken;
var templateErrorList;

var _cacheDom = () => {
  $btnCreate = $("#btn-create-request");
  $modalCreate = new bootstrap.Modal(document.getElementById("createRequestModal"));
  console.log("Modal Create:", $modalCreate);
  console.log("Button Create:", $btnCreate);
  $message = $(".message");
  templateErrorList =
    $("#template-error-list").html() ||
    "<ul>{{#errors}}<li>{{.}}</li>{{/errors}}</ul>";
};

var _bindEvents = () => {
  $btnCreate.on("click", function(e) {
    console.log("Create button clicked");
    e.preventDefault();

    $modalCreate.show();
    $message.html("");
  });
};

var init = (options) => {
  console.log("Initializing InventoryRequestShow.js");
  _authenticityToken = options.authenticityToken;
  _cacheDom();
  _bindEvents();
  console.log("InventoryRequestShow.js initialized");
};

  

export default { init };
