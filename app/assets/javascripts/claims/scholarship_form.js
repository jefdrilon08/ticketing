//= require jquery

var scholarshipForm = (function() {

  var authenticityToken       = $("meta[name='csrf-token']").attr('content');
  var $errorsTemplate;
  var $parameters;
  var id;
  var urlClaims               = "/api/v1/claims/save";
  var $yearLevel;

  var _cacheDom = function() {
    $parameters                  = $("#parameters");
    id                           = $parameters.data("id");
    $datePrepared                = $("#date-prepared");
    $preparedBy                  = $("#prepared-by");
    $submitButton                = $("#submit-button");
    $message                     = $(".message");
    $errorsTemplate              = $("#errors-template").html();
    $nameOfBeneficiary           = $("#name-of-beneficiary");
    $payee                       = $("#payee");
    $amount                      = $("#amount");
    $nameOfSchool                = $("#name-of-school");
    $schoolYear                  = $("#school-year");
    $yearLevel                   = $("#year-level");
    $sem                         = $("#sem");
    $scholarshipType             = $("#scholarship-type");
    $finalGrade                  = $("#final-grade");
    $classification              = $("#classification");
    $course                      = $("#course");
    $courseField                 = $(".course-field");
    $semField                    = $(".sem-field");
    $claimsPayment               = $("#claims-payment");
    $accountName                 = $("#account-name");
    $accountNumber               = $("#account-number");
 }

  var _bindEvents = function() {
      var yearLevelValue = ($yearLevel.val());
      if(yearLevelValue == "1st Year" || yearLevelValue == "2nd Year 8" || yearLevelValue == "3rd Year" || yearLevelValue == "4th Year" || yearLevelValue == "5th Year"){
        $courseField.show();
        $semField.show();
      }
      else
      {
        $courseField.hide(); 
        $semField.hide();
      }

    $submitButton.on('click', function(){
        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
          data: {
            amount: $amount.val(),
            name_of_beneficiary: $nameOfBeneficiary.val(),
            payee: $payee.val(),
            name_of_school: $nameOfSchool.val(),
            school_year: $schoolYear.val(),
            year_level: $yearLevel.val(),
            sem: $sem.val(),
            scholarship_type: $scholarshipType.val(),
            final_grade: $finalGrade.val(),
            classification: $classification.val(),
            course: $course.val(),
            claims_payment: $claimsPayment.val(),
            account_name: $accountName.val(),
            account_number: $accountNumber.val()
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
            $message.html("Error! " + errors);
            $submitButton.removeClass('loading');
            $message.html(
                Mustache.render(
                  $errorsTemplate,
                  { errors: errors }
                )
              );
          }
      });
     });

    $yearLevel.on('change', function() { 
      var yearLevelValue = ($yearLevel.val());

     if(yearLevelValue == "GRADE 7" || yearLevelValue == "GRADE 8" || yearLevelValue == "GRADE 9" || yearLevelValue == "GRADE 10" || yearLevelValue == "GRADE 11" || yearLevelValue == "GRADE 12")
        {
        $courseField.hide();
        $semField.hide();
        }
      else{
        $courseField.show();  
        $semField.show();
      } 
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
  scholarshipForm.init();
});
