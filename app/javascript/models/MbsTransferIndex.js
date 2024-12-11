import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';
select2($);


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
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  )

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
   $selectBranch.on("change", function() {
    $.ajax({
      method: 'GET',
      url: _urlCenters,
      data: {
        id: $selectBranch.val(),
        with_members: true
      },
      success: function(response) {
        _centers  = response.centers;

        if(_centers.length > 0) {
          _members  = _centers[0].members;
        }

        _loadCenterOptions();
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching centers");
      }
    });
  });
  $selectCenter.on("change", function() {
    _centerId = $selectCenter.val();

    _members  = _centers.find(c => c.id === _centerId).members;

    $selectMember.html("");
    for(var i = 0; i < _members.length; i++) {
      $selectMember.append(new Option(_members[i].full_name, _members[i].id));
    }

    if(_members.length > 0) {
      _memberId = _members[i].id;

      _fetchLoans();
    }
  });

     
 $btnNew.on("click", function() {
   $modalNew.show();
   $message.html("");
  });


 $btnConfirmNew.on("click", function() {
   var branchId = $selectBranch.val(); 
   var centerId = $selectCenter.val(); 

   $message.html("Loading...");
   $btnConfirmNew.prop("disabled", true);
   $selectBranch.prop("disabled", true);
   $selectCenter.prop("disabled", true);

   var data = {
	branch_id: branchId,
	center_id: centerId,
	authenticity_token: authenticityToken
   }
	 
     $.ajax({
      url: "/api/v1/mbs_transfer/create",
      method: 'POST',
      data: data,
      success: function(response) {
	window.location.href="/mbs_transfer";
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


