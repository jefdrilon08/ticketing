import Mustache from "mustache";

var hiipForm = (function() {

  var $amount;
  var $numberOfDaysTobepaid;
  var $effectiveDateOfCoverage;
  var authenticityToken       = $("meta[name='csrf-token']").attr('content');
  var $errorsTemplate;
  var $parameters;
  var id;
  var urlClaims               = "/api/v1/claims/save";
 
  var _cacheDom = function() {
    $parameters               = $("#parameters");
    id                        = $parameters.data("id");    
    $datePrepared             = $("#date-prepared");
    $preparedBy               = $("#prepared-by");
    $amount                   = $("#amount"); 
    $numberOfDaysTobepaid     = $("#number-of-days-tobepaid");
    $effectiveDateOfCoverage  = $("#effective-date-of-coverage");
    $expirationDateOfCoverage = $("#expiration-date-of-coverage");
    $dateAdmitted             = $("#date-admitted");
    $dateDischarged           = $("#date-discharged");
    $certificateNumber        = $("#certificate-number");
    $dateOfBirth              = $("#date-of-birth");
    $age                      = $("#age");
    $reasonOfConfinement      = $("#reason-of-confinement");
    $diagnosis                = $("#diagnosis");
    $nameOfClaimant           = $("#name-of-claimant");
    $balance                  = $("#balance");
    $submitButton             = $("#submit-button");
    $message                  = $(".message");
    $errorsTemplate           = $("#errors-template").html();
    
 }

  var _bindEvents = function() {
    $submitButton.on('click', function(){
        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
          data: {
            amount: $amount.val(),
            number_of_days_tobepaid: $numberOfDaysTobepaid.val(),
            effective_date_of_coverage: $effectiveDateOfCoverage.val(),
            expiration_date_of_coverage: $expirationDateOfCoverage.val(),
            date_admitted: $dateAdmitted.val(),
            date_discharged: $dateDischarged.val(),
            date_of_birth: $dateOfBirth.val(),
            age: $age.val(),
            certificate_number: $certificateNumber.val(),
            reason_of_confinement: $reasonOfConfinement.val(),
            diagnosis: $diagnosis.val(),
            name_of_claimant: $nameOfClaimant.val(),
            balance: $balance.val()
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


    $dateDischarged.on('change', function() {

      var dateAdmitted = $("#date-admitted").val();
      var dateDischarged = $("#date-discharged").val();

      var dateDischargedValue = new Date(dateDischarged);
      var dateAdmittedValue = new Date(dateAdmitted);

      var time = dateDischargedValue.getTime() - dateAdmittedValue.getTime(); 
      var days = time / (1000 * 3600 * 24); 

      $('#number-of-days-tobepaid').val(days);
      var numberOfDaysTobepaid = $("#number-of-days-tobepaid").val();
      var value = 200.00;
      var amount = $('#amount').val(parseFloat(numberOfDaysTobepaid) * parseFloat(value));
      // $('#balance').val(parseFloat(balance) - (parseFloat(numberOfDaysTobepaid) * parseFloat(value)));
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
  hiipForm.init();
});
