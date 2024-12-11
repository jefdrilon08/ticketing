import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $modalNew;
var $btnConfirmNew;
var $startDate;
var $endDate;

var $message;
var templateErrorList;
var authenticityToken;


var _cacheDom = function() {
  $btnNew = $("#btn-new");
  $modalNew = new bootstrap.Modal(document.getElementById("modal-new"));
  $btnConfirmNew = $("#btn-confirm-new");
  $startDate = $("#start-date");
  $endDate = $("#end-date");

  $message                = $(".message");
  templateErrorList = $("#template-error-list").html();  
};

var _bindEvents = function() {
  $btnNew.on("click",function(){
    $modalNew.show();
  });

  $btnConfirmNew.on("click",function(){
    var start_date = $startDate.val();
    var end_date = $endDate.val();

    var data = {
     start_date: start_date,
     end_date: end_date,
     authenticity_token: authenticityToken
    }

    console.log(data);

    $.ajax({
      url: "/api/v1/data_stores/assets_liabilities/create",
      method: "POST",
      data: data,
      success: function(response) {
        window.location.reload();
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
    $startDate.prop("disabled",false);
    $endDate.prop("disabled",false);

  });

}

var init  = function(options) {
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
