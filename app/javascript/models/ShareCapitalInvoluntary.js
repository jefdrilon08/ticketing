import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;
var errors;

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  );

  $btnNew           = $("#btn-new");
  $btnConfirmNew    = $("#btn-confirm-new");
  $asOf             = $("#as-of");
  $selectBranch     = $("#select-branch");
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
   var branch = $selectBranch.val();
   var asOf   = $asOf.val();

   $message.html("loading .....");
   $btnConfirmNew.prop("disabled", true);
   $selectBranch.prop("disabled",true);
   $asOf.prop("disabled",true);

   var data = {
    branch_id: branch,
    as_of: asOf,
    authenticity_token: authenticityToken
   }

   console.log(data);

   $.ajax({
    url: "/api/v1/data_stores/share_capital_involuntary/queue",
    method: "POST",
    data: data,
    success: function(response){
      window.location.href="/data_stores/share_capital_involuntary";
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
