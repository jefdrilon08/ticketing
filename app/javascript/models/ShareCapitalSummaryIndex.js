import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";


var authenticityToken;

var $btnNew;
var $modalNew;
var $selectBranch;
var $selectAsOf;
var $btnConfirmNew;

var templateErrorList;

var $message;

var _cacheDom = function () {
  $btnNew 	  = $('#btn-new');
  $modalNew 	= new bootstrap.Modal(document.getElementById("modal-new-transaction"));
  $btnConfirmNew    = $("#btn-confirm-new");
  $selectBranch     = $("#select-branch");

  $selectAsOf       = $("#input-as-of");
  $message          = $(".message");
  $templateErrorList = $("#template-error-list").html();
};

 

var _bindEvents = function() {

  $btnNew.on("click", function() {

    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {

    var selectAsOf = $selectAsOf.val();
    var branch_id  = $selectBranch.val();

    var data = {
    as_of: selectAsOf, 
    branch_id: branch_id, 
    authenticity_token: _authenticityToken
  } 

    $.ajax({
      method: 'POST',
      url: "/api/v1/data_stores/share_capital_summary/create",
      data: data,

      success: function(response) {
        $message.html("!Success Redirecting.....");

        window.location.href="/data_stores/share_capital_summary";
      },
      error: function(response) {
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

          $selectBranch.prop("disabled", false);
          $btnConfirmNew.prop("disabled", false);
        }
      }




    });
  });

};

var init  = function(options) {
  _authenticityToken  = options.authenticityToken; 

  _cacheDom();
  _bindEvents();
};

export default { init: init };