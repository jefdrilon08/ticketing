import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;
var $modalNew;
var $btnNew;
var $btnConfirmNew;
var errors;
var $selectBranch;
var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew      = new bootstrap.Modal(document.getElementById("modal-new"));
  $btnConfirmNew = $("#btn-confirm-new");
  $btnNew        = $("#btn-new");
  $selectBranch  = $("#select-branch");
  

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}
var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function(){
    var branchID = $selectBranch.val();
    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);

    var data = {
      branch_id: branchID,
      authenticity_token: authenticityToken
    }

      $btnConfirmNew.prop("disabled",true);
    $.ajax({
      url: "/api/v1/transfer_savings/create",
      method: "POST",
      data: data,

      success: function(response){
         window.location.href="/transfer_savings";
      },
      error: function(response){
        errors = [];

        try {
          errors = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          console.log(response);
          errors.push("Something went wrong");
        }

        $message.html(
          Mustache.render(
            templateErrorList,
            { errors: errors }
          )
        );

        $btnConfirmNew.prop("disabled", false);
      }

    });



  });


}

var init  = function(config) {
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
