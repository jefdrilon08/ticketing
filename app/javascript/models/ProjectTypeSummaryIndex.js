import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';

var authenticityToken;

var $modalNew;
var $btnNew;
var $btnConfirmNew;
var $selectBranch;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")

  );

  $btnConfirmNew    = $("#btn-confirm-new");
  $btnNew           = $("#btn-new");
  $selectBranch     = $("#select-branch");


  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  
  $btnConfirmNew.on("click", function() {
    var branchId  = $selectBranch.val();
    var data = {
      branch_id: branchId,
      authenticity_token: authenticityToken

    }


    $.ajax({
      url: "/api/v1/data_stores/project_type_summary/create",
      method: 'POST',
      data: data,
      success: function(response){
        //alert("jef")
        window.location.href="/data_stores/project_types_summary/" + response.id;

      }




    });


  });

  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");


  });


}

var init  = function(config) {
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
