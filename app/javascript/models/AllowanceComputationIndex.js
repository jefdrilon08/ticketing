import $ from "jquery";
import * as bootstrap from "bootstrap";
import Mustache from "mustache";

var authenticityToken;

var $btnNew;
var $message;
var templateErrorList;
var $btnConfirmNew;

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  );

  $btnNew           = $("#btn-new");
  $asOf		    = $("#input-asof")
  $btnConfirmNew    = $("#btn-confirm-new");
 
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html(""); 
  });

  $btnConfirmNew.on("click", function() {
    var as_of = $asOf.val();
    $message.html("Loading...");
    $asOf.prop("disabled", true);	  
    $btnConfirmNew.prop("disabled", true);

    var data = {
      as_of: as_of,	    
      authenticity_token: authenticityToken 
    }

    $.ajax({
      url: "/api/v1/data_stores/allowance_computation_report/queue",
      method: 'POST',
      data: data,
      success: function(response) {
	$message.html( 
	  "Success! Redirecting..."
	);
	window.location.href="/data_stores/allowance_computation_report";
      },
      error: function(response) {
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

        $asOf.prop("disabled", false);	  
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
