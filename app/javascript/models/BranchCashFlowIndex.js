import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $modalNew;
var $branchId;
var $date;
var $btnConfirmNew;
var $message;
var templateErrorList;
var authenticityToken;


var _cacheDom = function() {
  $btnNew = $("#btn-new");
  $branchId = $("#select-branch");
  $date = $("#input-date");
  $btnConfirmNew = $("#btn-confirm-new");
  $modalNew = new bootstrap.Modal(document.getElementById("modal-new"));


  $message                = $(".message");
  templateErrorList = $("#template-error-list").html();  
};

var _bindEvents = function() {
  $btnNew.on("click",function(){
    $modalNew.show();
  });

  $btnConfirmNew.on("click", function(){
    var data = {
      branch_id: $branchId.val(),
      date: $date.val(),
      authenticityToken: authenticityToken
    }
    $.ajax({
      url: "/api/branch_cash_flow/generate",
      method: "POST",
      data: data,

      success: function(response){

      },
      error: function(response){
        errors = [];

        try {
          errors = JSON.parse(response.responseText).errors;
          
        } catch(err) {
          errors.push("Something went wrong");
          console.log(response);
        }

        $message.html(
          Mustache.render(
            templateErrorList,
            { errors: errors }
          )
        );
      }
    });
  });






}

var init  = function(options) {
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
