import Mustache from "mustache";

var $btnNewTransaction;
var $btnConfirm;
var $modalNewTransaction;

var $selectBranch;
var $selectCenter;

var $message;

var templateErrorList;

var branches  = [];
var centers   = [];
var members   = [];
var authenticityToken       = $("meta[name='csrf-token']").attr('content');

var urlBranches       = "/api/v1/branches";
var urlCenters       = "/api/v1/centers/centers";
var urlCreate       = "/api/v1/claims/create";

var _authenticityToken;



var _cacheDom = function() {
  $btnNewTransaction        = $("#btn-new-transaction");
  $btnConfirm               = $("#btn-confirm");
  $modalNewTransaction      = $("#modal-new-transaction");

  $selectBranch          = $("#select-branch");
  $selectCenter          = $("#select-center");
  $selectMember          = $("#select-member");
  $typeOfClaim           = $("#type-of-claims");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();

};

var _bindEvents = function() {
  $btnConfirm.on("click", function() {
    var memberId = $selectMember.val();
    var typeOfClaim = $typeOfClaim.val();

    $.ajax({
      url: urlCreate,
      method: 'POST',
      data: {
        authenticity_token: authenticityToken,
        member_id: memberId,
        claim_type: typeOfClaim
      },  
      success: function(response) {
        window.location.href = "/claims/new/" + response.id;
      },
      error: function(response) {
        console.log(response);
        alert("Something went wrong")
      }
    });
  });
  $btnNewTransaction.on("click", function() {
    $modalNewTransaction.show();
  });


  $selectBranch.on("change", function() {
    var branchId  = $(this).val();

    $selectCenter.html("");
    $selectCenter.append("<option>--ALL--</option>")
    for(var i = 0; i < branches.length; i++) {
      if(branches[i].id == branchId) {
        for(var j = 0; j < branches[i].centers.length; j++) {
          $selectCenter.append(
            "<option value='" + branches[i].centers[j].id + "'>" + branches[i].centers[j].name + "</option>"
          );
        }
      }
    }
  });

  $selectCenter.on("change", function() {
    var centerId  = $(this).val();

    $selectMember.html("");
    $selectMember.append("<option>--ALL--</option>");
    console.log(centers);
    for(var i = 0; i < centers.length; i++) {
      if(centers[i].id == centerId) {
        for(var j = 0; j < centers[i].members.length; j++) { 
          $selectMember.append(
            "<option value='" + centers[i].members[j].id + "'>" + centers[i].members[j].name + "</option>"
          );
        }
      }
    }
  });
};

var init  = function(config) {
  _authenticityToken  = config.authenticityToken;

  $.ajax({
    url: urlBranches,
    method: 'GET',
    success: function(response) {
      branches  = response.branches;
    },
    error: function(response) {
      console.log(response);
      alert("Error in fetching branches");
    }
  });

  $.ajax({
    url: urlCenters,
    method: 'GET',
    success: function(response) {
      centers  = response.centers;
    },
    error: function(response) {
      console.log(response);
      alert("Error in fetching centers");
    }
  });


  _cacheDom();
  _bindEvents();
};

export default { init: init };