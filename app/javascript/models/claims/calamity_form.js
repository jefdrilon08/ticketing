import Mustache from "mustache";
var calamityForm = (function() {

  var authenticityToken       = $("meta[name='csrf-token']").attr('content');
  var $errorsTemplate;
  var $parameters;
  var id;
  var urlClaims               = "/api/v1/claims/save";
 
  var _cacheDom = function() {
    $parameters                  = $("#parameters");
    id                           = $parameters.data("id");
    $datePrepared                = $("#date-prepared");
    $preparedBy                  = $("#prepared-by");
    $submitButton                = $("#submit-button");
    $message                     = $(".message");
    $errorsTemplate              = $("#errors-template").html();
    $dateRequested               = $("#date-requested");
    $purpose                     = $("#purpose");
    $typeOfCalamity              = $("#type-of-calamity");
    $amount                      = $("#amount");
    $dateOfEvent                 = $("#date-of-event");
    $nameOfPayee                 = $("#name-of-payee");
    $nameOfBeneficiary           = $("#name-of-beneficiary");
  
 }

  var _bindEvents = function() {

    $submitButton.on('click', function(){
        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
          data: {
            amount: $amount.val(), 
            date_requested: $dateRequested.val(),
            purpose: $purpose.val(),
            type_of_calamity: $typeOfCalamity.val(),
            date_of_event: $dateOfEvent.val(),
            name_of_payee: $nameOfPayee.val(),
            name_of_beneficiary: $nameOfBeneficiary.val()
          },
          authenticity_token: authenticityToken,
          
        }
        console.log(data);

        $.ajax({
          url: urlClaims,
          method: 'POST',
          data: data,
          success: function(responseContent) {
            $message.html("Success! Redirecting...");
            window.location.href = "/claims/" + id;
          },
          error: function(responseContent) {
            console.log(responseContent);
            var  errors  = JSON.parse(responseContent.responseText).errors;
            console.log(errors);
            console.log(data);
            $message.html(
                Mustache.render(
                  $errorsTemplate,
                  { errors: errors }
                )
              );
          }
      });
     });


  }

  var init = function() {
    _cacheDom();
    _bindEvents();
  }

  return {
    init: init
  };
})();

$(document).ready(function() {
  calamityForm.init();
});
