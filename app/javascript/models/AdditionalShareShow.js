import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";


var _authenticityToken;
var _id;

var $btnAdd;
var $UpdateAmount;
var $modalUpdate;
var $modalApproveTransaction;
var $btnApprove;
var $btnAddParticular;
var $inputParticular;
var $btnDelete;
var $modalDeleteMember;
var _memberAccountId;
var _memberId;
var $btnConfirmDeleteMember;
var currentMember           = "";
var currentMemberId         = "";
var $message;
var templateErrorList;

var _urlAddParticular = "/api/v1/additional_share/add_particular";

var _cacheDom = function() {
   $modalUpdate 	    = new bootstrap.Modal(
     document.getElementById("modal-update-transaction")
   )

   $modalApproveTransaction = new bootstrap.Modal(
     document.getElementById("modal-approve-transaction")
   )

   $modalDeleteMember = new bootstrap.Modal(document.getElementById("modal-delete-member"));

	 $btnDelete         = $(".btn-delete-member");
   $btnAdd			      = $("#btn-add");
   $btnApprove			  = $("#btn-approve");	
   $btnConfirmProcess = $("#btn-confirm-process");
   $btnConfirmAmount	= $("#btn-confirm-amount");
   $selectMember      = $("#select-member");
   $UpdateAmount      = $(".undo");
   $withdrawAmount		= $("#withdrawAmount");		
   $memberName			  = $("#memberName");
   $memberId			    = $("#memberId");
   $accountSubType		= $("#accountSubType");
   $btnAddParticular  = $("#btn-add-particular");
   $inputParticular   = $("#particular");
   $message  			    = $(".message");
   $btnConfirmDeleteMember = $("#btn-confirm-delete-member");
	 $displayMember          = $(".display-member");
};

var _bindEvents = function() {
  $btnDelete.on("click",function(){
    $message.html("");
    console.log($(this).data);
    currentMember           = $(this).data("member-name");
    currentMemberId         = $(this).data("member-id");
    _id = $(this).data("id");  
    $displayMember.html(currentMember);
    $modalDeleteMember.show();
  });

  $btnConfirmDeleteMember.on("click",function(){

    $message.html("Loading...");
    $btnConfirmDeleteMember.prop("disabled", true);

    var data  = {
      id: _id,
      member_id: currentMemberId,
      authenticity_token: _authenticityToken
    };
    
    $.ajax({
      url: "/api/v1/additional_share/delete_member",
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
      authenticity_token: _authenticityToken
    };

    $selectMember.prop("disabled", true);
 
    $.ajax({
      url: "/api/v1/additional_share/add_member",
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
	//end btnAdd
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
		authenticity_token: _authenticityToken
	   	};
      $.ajax({
      url: "/api/v1/additional_share/update_amount",
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

   $btnApprove.on("click", function() {
     _id = $(this).data("id");
           //alert(_id);
        $modalApproveTransaction.show();
   });

    $btnConfirmProcess.on("click", function() {
     var data = {
       id: _id,
       authenticity_token: _authenticityToken
     };
           //alert(_id);
     $btnConfirmProcess.prop("disabled", true);
     $message.html("Loading...");

    console.log(data);
    $.ajax({
      url: "/api/v1/additional_share/approve",
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/additional_share";
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

   $btnAddParticular.on("click", function() {
    var txtParticular = $inputParticular.val()
    _id = $(this).data("id");	  
    $.ajax({	    
      url: _urlAddParticular,
      method: "POST",
      data: {
	id: _id,
	txtParticular: txtParticular,
        authenticity_token: _authenticityToken
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

 
}


var init  = function(config) {
  _authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };


