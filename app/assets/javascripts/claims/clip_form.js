//= require jquery

var clipForm = (function() {

  var $amountOfLoan;
  var $amountPayableToBeneficiary;
  var $amountPayableToCreditor;
  var authenticityToken       = $("meta[name='csrf-token']").attr('content');
  var $errorsTemplate;
  var $parameters;
  var id;
  var urlClaims               = "/api/v1/claims/save";
 
  var _cacheDom = function() {
    $parameters                  = $("#parameters");
    id                           = $parameters.data("id");
    $amountOfLoan                = $("#amount-of-loan"); 
    $amountPayableToBeneficiary  = $("#amount-payable-to-beneficiary");
    $amountPayableToCreditor     = $("#amount-payable-to-creditor");
    $datePrepared                = $("#date-prepared");
    $creditorsName               = $("#creditors-name");
    $memberName                  = $("#member-name");
    $beneficiary                 = $("#beneficiary");
    $dateOfBirth                 = $("#date-of-birth");
    $age                         = $("#age");
    $gender                      = $("#gender");
    $policyNumber                = $("#policy-number");
    $dateOfDeath                 = $("#date-of-death");
    $causeOfDeath                = $("#cause-of-death");
    $typeOfLoan                  = $("#type-of-loan");
    $terms                       = $("#terms");
    $effectiveDateOfCoverage     = $("#effective-date-of-coverage");
    $expirationDateOfCoverage    = $("#expiration-date-of-coverage");
    $preparedBy                  = $("#prepared-by");
    $submitButton                = $("#submit-button");
    $message                     = $(".message");
    $errorsTemplate              = $("#errors-template").html();
    $claimsPayment               = $("#claims-payment");
    $accountName                 = $("#account-name");
    $accountNumber               = $("#account-number");
    $transactionType             = $("#transaction-type");
    $claimsPaymentCreditor       = $("#claims-payment-creditor");
    $accountNameCreditor         = $("#account-name-creditor");
    $accountNumberCreditor       = $("#account-number-creditor");
    $control                     = $("#control");
 }

  var _bindEvents = function() {

    $submitButton.on('click', function(){
        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
          control: $control.val(),
          data: {
            amount: $amountPayableToBeneficiary.val(),
            amount_of_loan: $amountOfLoan.val(),
            amount_payable_to_creditor: $amountPayableToCreditor.val(),
            date_prepared: $datePrepared.val(),
            creditors_name: $creditorsName.val(),
            member_name: $memberName.val(),
            beneficiary: $beneficiary.val(),
            date_of_birth: $dateOfBirth.val(),
            age: $age.val(),
            gender: $gender.val(),
            policy_number: $policyNumber.val(),
            date_of_death: $dateOfDeath.val(),
            cause_of_death: $causeOfDeath.val(),
            type_of_loan: $typeOfLoan.val(),
            terms: $terms.val(),
            effective_date_of_coverage: $effectiveDateOfCoverage.val(),
            expiration_date_of_coverage: $expirationDateOfCoverage.val(),
            claims_payment: $claimsPayment.val(),
            account_name: $accountName.val(),
            account_number: $accountNumber.val(),
            transaction_type: $transactionType.val(),
            claims_payment_creditor: $claimsPaymentCreditor.val(),
            account_name_creditor: $accountNameCreditor.val(),
            account_number_creditor: $accountNumberCreditor.val()
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
            var errors = JSON.parse(responseContent.responseText).errors;
            console.log(errors);
            $message.html("Error! " + errors);
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

    $amountPayableToBeneficiary.on('change', function() {
      var amountOfLoanValue = ($amountOfLoan.val());
      var amountPayableToBeneficiaryValue = ($amountPayableToBeneficiary.val());
      $('#amount-payable-to-creditor').val(parseFloat(amountOfLoanValue) - parseFloat(amountPayableToBeneficiaryValue))
    });


    $effectiveDateOfCoverage.on('change', function(){
      var effectiveDateOfCoverage = $("#effective-date-of-coverage").val();
      var terms = $("#terms").val();
      var effectiveDate = new Date(effectiveDateOfCoverage);
      var days = terms * 7;

      effectiveDate.setDate(effectiveDate.getDate() + days);
      var dd = ("0" + effectiveDate.getDate()).slice(-2);
      var mm = ("0"+(effectiveDate.getMonth()+1)).slice(-2); 
      var yy = effectiveDate.getFullYear();           
      $("#expiration-date-of-coverage").val(yy + "-" + mm + "-" + dd);
    });


    $terms.on('change', function(){
      var terms = $("#terms").val();
      var effectiveDate = new Date();
      var ddd = ("0" + effectiveDate.getDate()).slice(-2);
      var mmm = ("0"+(effectiveDate.getMonth()+1)).slice(-2); 
      var yyy = effectiveDate.getFullYear(); 
      $("#effective-date-of-coverage").val(yyy + "-" + mmm + "-" + ddd);

      var expirationDate = new Date();
      var days = terms * 7;

      expirationDate.setDate(expirationDate.getDate() + days);
      var dd = ("0" + expirationDate.getDate()).slice(-2);
      var mm = ("0"+(expirationDate.getMonth()+1)).slice(-2); 
      var yy = expirationDate.getFullYear();           
      $("#expiration-date-of-coverage").val(yy + "-" + mm + "-" + dd);
    });

    $dateOfBirth.on('change', function(){
      var dateOfBirth = $('#date-of-birth').val();
      var birthDate = new Date(dateOfBirth);
      var today = new Date();
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      $('#age').val(age);
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
  clipForm.init();
});
