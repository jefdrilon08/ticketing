import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNew;
var $btnNewChannel;
var $modalApprove;
var $modalApproveChannel;
var $btnConfirmNew;
var $btnConfirmNewChannel;
var $BankName;
var $Amount;
var $Transferoption;
var $Code;
var $transfer;
var $accounting;
var _authenticityToken;

var _cacheDom		= function() {

$modalApprove 	= new bootstrap.Modal(document.getElementById("modal-new"));
$modalApproveChannel 	= new bootstrap.Modal(document.getElementById("modal-new-channel"));

$btnNew 							= $("#btn-new");
$btnNewChannel 				= $("#btn-channel");
$BankName 						= $("#bankname");
$btnConfirmNew  			= $("#btn-confirm-new");
$btnConfirmNewChannel	= $("#btn-confirm-new-channel");
$Amount 							= $("#amount");
$Transfer       			= $("#select1");
$Accounting     			= $("#select");
$Transferoption       = $("#transferoption");
$Code     						= $("#code");
}

var _bindEvents = function () {

	$btnNewChannel.on("click", function() {
		$modalApproveChannel.show();
	});
	
	$btnConfirmNewChannel.on("click", function(){
		var TransferName 		= $Transferoption.val();
		var Code 						= $Code.val();

		var data = {

			transfer_name: TransferName,
			code: Code,
			authenticity_token: _authenticityToken

		}

	$.ajax({
		url: "/api/v1/bank_transfer/create_channel",
		method: 'POST',
		data: data,
		success: function(response) {
			window.location.href="/bank_transfer";
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
     }
	});
});
	$btnNew.on("click", function() {
		$modalApprove.show();
	});

	$btnConfirmNew.on("click", function(){
		var BankName 			= $BankName.val();
		var Amount 			 	= $Amount.val();
		var Transfer     	= $Transfer.val();
		var Accounting    = $Accounting.val();
		
		var data = {
				bank_name: 	BankName,
				amount: 		Amount,
				transfer: 	Transfer,
				accounting: Accounting,
				authenticity_token: _authenticityToken


		}
		$.ajax({                                                              
      url: "/api/v1/bank_transfer/create",                              
      method: 'POST',                                                      
      data: data,                                                          
      success: function(response) {                                       
              window.location.href="/bank_transfer";                    
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
     }                                                                     
    });
		//alert(data);
	});

}
	
var init  = function(config) {
  _authenticityToken  = config.authenticityToken;
  
  _cacheDom();
  _bindEvents();
};


export default { init: init };