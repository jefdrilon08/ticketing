import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;
var $modalApprove;
var $btnApprove;
var $btnConfirmApprove;
var errors;
var $message;
var templateErrorList;

var _cacheDom = function() {
   $modalApprove = new bootstrap.Modal(document.getElementById("modal-approve"));
   $btnApprove   = $("#btn-approved");
   $btnConfirmApprove = $("#btn-confirm-approve");
  
  

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}
var _bindEvents = function() {
  $btnApprove.on("click",function(){
    $modalApprove.show();
  });

  $btnConfirmApprove.on("click",function(){
    var data = {
      id:_id,
      authenticity_token: authenticityToken
    }
    $btnConfirmApprove.prop("disabled", true);
    
    $.ajax({
      url: "/api/v1/transfer_savings/approved",
      data: data,
      method: "POST",

      success: function(response){
        console.log(response);
        $message.html(
          "Success! Redirecting..."
        );
         window.location.href="/transfer_savings";
      },
      error: function(response){
         var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"]
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );
           $btnConfirmApprove.prop("disabled", false);
         }
      }
    });
  });
}

var init  = function(config) {
  authenticityToken = config.authenticityToken;
  _id                 = config.id;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
