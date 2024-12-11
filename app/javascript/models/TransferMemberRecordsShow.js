import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var _authenticityToken;
var _id;

var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;
var $btnDelete;
var $btnConfirmDelete;
var $modalDelete;
var $btnDeleteMember;
var $btnConfirmDeleteMember;
var $modalDeleteMember;
var $selectMember;
var $selectCenter;
var $btnAdd;
var $displayMember;
var $displayAccountingCode;
var $SelectCenterFrom;

var $btnSaveParticular;
var $particularTo;
var $particularFrom;

var $message;
var templateErrorList;

var currentMember           = "";
var currentMemberId         = "";


var _cacheDom = function() {


  $btnApprove         = $("#btn-approve");
  $btnConfirmApprove  = $("#btn-confirm-approve");
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $btnDeleteMember        = $(".btn-delete-member");
  $btnConfirmDeleteMember = $("#btn-confirm-delete-member");
  $modalDeleteMember = new bootstrap.Modal(
    document.getElementById("modal-delete-member")
  );
  $selectCenter     = $("#select-center");
  $selectMember     = $("#select-member");

  $btnAdd           = $("#btn-add");
  $btnSaveParticular = $("#btn-save-particular");
  $particularTo      = $("#particular-to");
  $particularFrom    = $("#particular-from");
  $SelectCenterFrom     = $("#select-center-from");

  $displayMember          = $(".display-member");
  $message  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _bindEvents = function() {

  $btnAdd.on("click", function() {
    var memberId        = $selectMember.val();
    var CenterFromId    = $SelectCenterFrom.val();
    var centerId        = $selectCenter.val();
    
    var data  = {
      id: _id,
      member_id: memberId,
      center_id: centerId,
      center_from_id: CenterFromId,
      authenticity_token: _authenticityToken
    };

    $selectMember.prop("disabled", true);
    $selectCenter.prop("disabled",true);
 

    $.ajax({
      url: "/api/v1/transfer_member_records/add_member",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );
        
        window.location.reload();
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

          $selectMember.prop("disabled", false);
           $selectCenter.prop("disabled",false);
         
        }
      }
    });
    
  });
  $btnSaveParticular.on("click", function() {
    var particular_to        = $particularTo.val();
    var particlar_from        = $particularFrom.val();
    
    var data  = {
      id: _id,
      particular_to: particular_to,
      particlar_from: particlar_from,
      authenticity_token: _authenticityToken
    };
    console.log(data);
    $particularTo.prop("disabled", true);
    $particularFrom.prop("disabled",true);
 

    $.ajax({
      url: "/api/v1/transfer_member_records/add_particular",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );
        
        window.location.reload();
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

          $particularTo.prop("disabled", true);
          $particularFrom.prop("disabled",true);
          $btnSaveParticular.prop("disabled", true);
        }
      }
    });
  });
  $btnApprove.on("click", function() {
    $message.html("");
    $modalApprove.show();
  });


 $btnConfirmApprove.on("click", function() {
    var data = {
      id: _id,
      authenticity_token: _authenticityToken
    };
    $btnConfirmApprove.prop("disabled", true);
    $message.html("Loading...");
    
    console.log(data);
    $.ajax({
      url: "/api/v1/transfer_member_records/approve",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/transfer_member_records";
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmApprove.prop("disabled", false);
        }
      }
    });
  });

 $btnDeleteMember.on("click", function() {
    $message.html("");
    currentMember           = $(this).data("member-name");
    currentMemberId         = $(this).data("member-id");
   

    $displayMember.html(currentMember);
    $modalDeleteMember.show();
  });

  $btnConfirmDeleteMember.on("click", function() {
    $message.html("Loading...");
    $btnConfirmDeleteMember.prop("disabled", true);

    var data  = {
      id: _id,
      member_id: currentMemberId,
      authenticity_token: _authenticityToken
    };

    $.ajax({
      url: "/api/v1/transfer_member_records/delete_member",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );
        
        window.location.reload();
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

          $btnConfirmDeleteMember.prop("disabled", false);
        }
      }
    });
  });


  
  
};

var init  = function(options) {
  _authenticityToken  = options.authenticityToken; 
  _id                 = options.id;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
 
