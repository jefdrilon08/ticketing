//= require jquery

var kalingaForm = (function() {

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

    $dateReported                = $("#date-reported");
    $dateEmailed                 = $("#date-emailed");
    $dateApproved                = $("#date-approved");
    $dateRequested               = $("#date-requested");
    $purpose                     = $("#purpose");
    $amount                      = $("#amount");
    $effectiveDate               = $("#effective-date");
    $expirationDate              = $("#expiration-date");
    $pocNumber                   = $("#poc-number");
    $nameOfInsured               = $("#name-of-insured");
    $relationshipToMember        = $("#relationship-to-member");
    $insuredAddress              = $("#insured-address");
    $civilStatus                 = $("#civil-status");
    $dateOfBirth                 = $("#date-of-birth");
    $nameOfBeneficiary           = $("#name-of-beneficiary");
    $dateOfDeathOrIncident       = $("#date-of-death-or-incident");
    $reasonOfDeath               = $("#reason-of-death");
    $gender                      = $("#gender");
    $issuedDate                  = $("#issued-date");
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
            date_reported: $dateReported.val(),
            date_emailed: $dateEmailed.val(),
            date_approved: $dateApproved.val(),
            date_requested: $dateRequested.val(),
            purpose: $purpose.val(), 
            effective_date: $effectiveDate.val(),
            expiration_date: $expirationDate.val(),
            poc_number: $pocNumber.val(),
            name_of_insured: $nameOfInsured.val(),
            relationship_to_member: $relationshipToMember.val(),
            insured_address: $insuredAddress.val(),
            civil_status: $civilStatus.val(),
            date_of_birth: $dateOfBirth.val(),
            name_of_beneficiary: $nameOfBeneficiary.val(),
            date_of_death_or_incident: $dateOfDeathOrIncident.val(),
            reason_of_death: $reasonOfDeath.val(),
            gender: $gender.val(),
            issued_date: $issuedDate.val(),
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
    $effectiveDate.on('change', function(){
     
            var effectiveDate = $("#effective-date").val();
            var expireDate = new Date(effectiveDate);
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            expireDate.setDate(expireDate.getDate() -1);
            var dd = ("0" + expireDate.getDate()).slice(-2);
            var mm = ("0"+(expireDate.getMonth()+1)).slice(-2); 
            var y = expireDate.getFullYear();           
            $("#expiration-date").val(y + "-" + mm + "-" + dd);

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
  kalingaForm.init();
});
