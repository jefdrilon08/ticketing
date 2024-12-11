import Mustache from "mustache";

var kbenteForm = (function() {

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

    $dateApproved                = $("#date-approved");
    $dateOfBirth                 = $("#date-of-birth");
    $purpose                     = $("#purpose");
    $amount                      = $("#amount");
    $nameOfInsured               = $("#name-of-insured");
    $nameOfBeneficiary           = $("#name-of-beneficiary");
    $classification              = $("#classification");
    $dateOfDeath                 = $("#date-of-death");
    $dateEnrolled                = $("#date-enrolled");
    $dateExpired                 = $("#date-expired");
    $claimsPayment              = $("#claims-payment");
    $accountName                = $("#account-name");
    $accountNumber              = $("#account-number");
    $dateOfLoa             = $("#date-of-loa");
 }

  var _bindEvents = function() {

    $submitButton.on('click', function(){
        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
          data: {
            amount: $amount.val(),
            date_approved: $dateApproved.val(),
            date_of_birth: $dateOfBirth.val(),
            purpose: $purpose.val(), 
            name_of_insured: $nameOfInsured.val(),
            name_of_beneficiary: $nameOfBeneficiary.val(),
            classification: $classification.val(),
            date_of_death: $dateOfDeath.val(),
            date_enrolled: $dateEnrolled.val(),
            date_expired: $dateExpired.val(),
            claims_payment: $claimsPayment.val(),
            account_name: $accountName.val(),
            account_number: $accountNumber.val(),
            date_of_loa: $dateOfLoa.val()
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

    $dateEnrolled.on('change', function(){
     
            var dateEnrolled = $("#date-enrolled").val();
            var expireDate = new Date(dateEnrolled);
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            expireDate.setDate(expireDate.getDate() -1);
            var dd = ("0" + expireDate.getDate()).slice(-2);
            var mm = ("0"+(expireDate.getMonth()+1)).slice(-2); 
            var y = expireDate.getFullYear();           
            $("#date-expired").val(y + "-" + mm + "-" + dd);

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
  kbenteForm.init();
});
