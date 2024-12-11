import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;

var $btnNew;
var $modalNew;
var $selectBranch;
var $selectCenter;
var $btnConfirmNew;
var templateErrorList;

var _centers  = [];

var _urlCenters       = "/api/v1/branches/fetch_centers";

var _cacheDom = function() {
  $btnNew	    = $("#btn-new");
  $modalNew      = new bootstrap.Modal(
    document.getElementById("modal-new")

  );
  $btnConfirmNew    = $("#btn-confirm-new");
  $selectBranch     = $("#select-branch");
  $selectCenter     = $("#select-center");
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _loadCenterOptions  = function() {
  $selectCenter.html("");
  if(_centers.length > 0) {
    _centerId = _centers[0].id;

    for(var i = 0; i < _centers.length; i++) {
      $selectCenter.append(new Option(_centers[i].name, _centers[i].id));
    }
  }
 };


var _bindEvents = function() {
  $btnNew.on("click",function(){
   $modalNew.show();
  });
  
 $btnConfirmNew.on("click", function() {
   var branchId = $selectBranch.val(); 

   $message.html("Loading...");
   $btnConfirmNew.prop("disabled", true);
   $selectBranch.prop("disabled", true);

   var data = {
    branch_id: branchId,
    authenticity_token: authenticityToken
   }
   
    $.ajax({
      url: "/api/v1/billing_for_involuntary/create",
      method: 'POST',
      data: data,
      success: function (response) {
        window.location.href="/billing_for_involuntary";
      },
      error: function(response) {
        errors = [];

        try {
          errors = JSON.parse(response.responseText).full_messages;
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

      $btnConfirmNew.prop("disabled", true);
      $selectBranch.prop("disabled", true);
      $selectCenter.prop("disabled", true);
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


