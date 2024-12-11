import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;
var $btnDelete;

var $selectBranch;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")

  );
  $btnNew           = $("#btn-new");
  $btnConfirmNew    = $("#btn-confirm-new");
  $selectBranch     = $("#select-branch");

  $btnDelete        = $("#btn-delete");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnDelete.on("click", function(){
    alert("jef")
  });


  $btnNew.on("click", function() {
    //alert("jef")
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var branchId  = $selectBranch.val();
    $message.html("Loading...");
    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);

    var data  = {
      branch_id: branchId,
      authenticity_token: authenticityToken
    }

    $.ajax({
      url: "/api/v1/data_stores/member_id_generetors/create",
      method: 'POST',
      data: data,
      success: function(response) {
        
        window.location.href="/data_stores/member_id_generators/" + response.id;
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

        $btnConfirmNew.prop("disabled", false);
        $selectBranch.prop("disabled", false);
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
