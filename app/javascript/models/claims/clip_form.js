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
 }

  var _bindEvents = function() {

    $submitButton.on('click', function(){
        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
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
            expiration_date_of_coverage: $expirationDateOfCoverage.val()
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

    $amountPayableToBeneficiary.on('change', function() {
      var amountOfLoanValue = ($amountOfLoan.val());
      var amountPayableToBeneficiaryValue = ($amountPayableToBeneficiary.val());
      $('#amount-payable-to-creditor').val(parseFloat(amountOfLoanValue) - parseFloat(amountPayableToBeneficiaryValue))
    });

    $effectiveDateOfCoverage.on('change', function(){
      var effectiveDateOfCoverage = $("#effective-date-of-coverage").val();
      var expireDate = new Date(effectiveDateOfCoverage);
      expireDate.setFullYear(expireDate.getFullYear() + 1);
      expireDate.setDate(expireDate.getDate() -1);
      var dd = ("0" + expireDate.getDate()).slice(-2);
      var mm = ("0"+(expireDate.getMonth()+1)).slice(-2); 
      var y = expireDate.getFullYear();           
      $("#expiration-date-of-coverage").val(y + "-" + mm + "-" + dd);

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
