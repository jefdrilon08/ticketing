import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';
select2($);


var authenticityToken;

var $btnDelete;
var $modalDeleteMember;
var $displayMember
var $message;

var currentMember           = "";
var currentMemberId         = "";

var $btnConfirmDeleteMember;

var $btnAdd;
var _memberId;
var _id;

var templateErrorList;
var _urlAddParticular = "/api/v1/mbs_transfer/add_particular";

var _cacheDom = function() {
  $modalUpdate 	    = new bootstrap.Modal(
     document.getElementById("modal-update-transaction")
   )
  
   $modalApproveTransaction = new bootstrap.Modal(
     document.getElementById("modal-approve-transaction")
   )

$modalDeleteMember = new bootstrap.Modal(document.getElementById("modal-delete-member"))
  $btnDelete = $(".btn-delete-member");
  $btnAdd	    = $("#btn-add");
  $btnApprove			  = $("#btn-approve");	
  $btnConfirmProcess = $("#btn-confirm-process");
  $btnConfirmAmount	= $("#btn-confirm-amount")
  $selectMember      = $("#select-member");
  $message          = $(".message");
  $UpdateAmount      = $(".undo");
  $withdrawAmount		= $("#withdrawAmount");		
  $memberName			  = $("#memberName");
  $memberId			    = $("#memberId");
  $accountSubType		= $("#accountSubType");
  $btnAddParticular  = $("#btn-add-particular");
  $inputParticular   = $("#particular");
  $btnConfirmDeleteMember = $("#btn-confirm-delete-member");
  $displayMember          = $(".display-member");
 
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {

  $btnDelete.on("click", function(){
    $message.html("");
    console.log($(this).data);
    currentMember           = $(this).data("member-name");
    currentMemberId         = $(this).data("member-id");
    _id = $(this).data("id");
    $displayMember.html(currentMember);
    $modalDeleteMember.show();
  });

  $btnConfirmDeleteMember.on("click", function(){
    
    $message.html("Loading...");
    $btnConfirmDeleteMember.prop("disabled", true);


    var data = {
      id: _id,
      member_id: currentMemberId,
      authenticity_token: authenticityToken
    };

    $.ajax({
      url: "/api/v1/mbs_transfer/delete_member",
      method: "POST",
      data: data,
      success: function(response){
        $message.html("Success!");
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
  $btnAdd.on("click", function() {
   _memberId = $selectMember.val();
   _id = $(this).data("id");	
   var data = {
      id: _id,
      member_id: _memberId,
      authenticity_token: authenticityToken
    };
    
    $selectMember.prop("disabled", true);
    $.ajax({
      url: "/api/v1/mbs_transfer/add_member",
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
      alert(JSON.parse(response.responseText).full_messages)
      $selectMember.prop("disabled", false);
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
      }
      }
      });
  });

     $UpdateAmount.on("click" , function() {
	   _memberAccountId 		= $(this).data("member-account-id")
	   var withdraw_amount		= $(this).data("withdraw-amount")
	   var member_name		= $(this).data("member-name")
	   var account_subtype		= $(this).data("account-subtype")
	   var member_id		= $(this).data("member-id")

	   //alert(account_subtype);
	   $withdrawAmount.val(withdraw_amount)
	   $memberName.text(member_name)
	   $accountSubType.text(account_subtype)
	   $memberId.text(member_id)
	   $modalUpdate.show();

     });

      $btnConfirmAmount.on("click", function() {
	_withdrawAmount	= $withdrawAmount.val()	     
	_id 		= $(this).data("id");	
	_memberId	= $memberId.text()

	   var data = {
		id: _id,
		member_name: $memberName.text(),
		member_id: _memberId,   
		member_account_id: _memberAccountId,   
		withdraw_amount: _withdrawAmount,
		authenticity_token: authenticityToken
	   	};
      $.ajax({
      url: "/api/v1/mbs_transfer/update_amount",
      method: 'POST',
      data: data,
      success: function(response) {
	$message.html(
          "Success! Redirecting..."
        );
        
        window.location.reload();
      },
      error: function(response) {
        errors = [];
	alert(JSON.parse(response.responseText).full_messages)
        try {
          errors = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors.push("Something went wrong");
          console.log(response);
        }

        $message.html(
          Mustache.render(
           
          )
        );
    }
    }); 
   });	


   $btnAddParticular.on("click", function() {
    var txtParticular = $inputParticular.val()
    _id = $(this).data("id");	  
    $.ajax({	    
      url: _urlAddParticular,
      method: "POST",
      data: {
	id: _id,
	txtParticular: txtParticular,
        authenticity_token: authenticityToken
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnAddParticular.prop("disabled", false);
        }
      }
    });

   });

   $btnApprove.on("click", function() {
     _id = $(this).data("id");
        $modalApproveTransaction.show();
   });
	
   $btnConfirmProcess.on("click", function() {
    var data = {
       id: _id,
       authenticity_token: authenticityToken
     };
     $btnConfirmProcess.prop("disabled", true);
     $message.html("Loading...");

    console.log(data);
    $.ajax({
      url: "/api/v1/mbs_transfer/approve",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/mbs_transfer";
      },
      error: function(response) {
        console.log(response);
	alert(JSON.parse(response.responseText).full_messages);      
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

          $btnConfirmProcess.prop("disabled", false);
        }
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


