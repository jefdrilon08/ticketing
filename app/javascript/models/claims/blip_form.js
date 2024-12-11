var blipForm = (function() {

  var $typeOfInsurancePolicy;
  var $classificationOfInsured;
  var $dateOfPolicyIssue;
  var $dateOfDeathTpdAccident;
  var $arrears;
  var urlClaims               = "/api/v1/claims/save";
  var authenticityToken       = $("meta[name='csrf-token']").attr('content');
  var $errorsTemplate;
  var $parameters;
  var id;

  var _cacheDom = function() {
    $parameters                 = $("#parameters");
    id = $parameters.data("id");

    $typeOfInsurancePolicy      = $("#type-of-insurance-policy");
    $classificationOfInsured    = $("#classification-of-insured");
    $dateOfPolicyIssue          = $("#date-of-policy-issue");
    $dateOfDeathTpdAccident     = $("#date-of-death-tpd-accident"); 
    $returnedContribution       = $("#returned-contribution");
    $returnedContributionField  = $(".returned-contribution-field");
    $totalAmountPayable         = $("#total-amount-payable");
    $arrears                    = $("#arrears");
    $orderOfChildField          = $(".order-of-child-field");
    $datePrepared               = $("#date-prepared");
    $dateReported               = $("#date-reported");
    $datePaid                   = $("#date-paid");
    $lengthOfStay               = $("#length-of-stay");
    $equityValue                = $("#equity-value");
    $retirementFund             = $("#retirement-fund");
    $policyNumber               = $("#policy-number");
    $faceAmount                 = $("#face-amount");
    $nameOfInsured              = $("#name-of-insured");
    $dateOfBirth                = $("#date-of-birth");
    $orderOfChild               = $("#order-of-child");
    $gender                     = $("#gender");
    $beneficiary                = $("#beneficiary");
    $preparedBy                 = $("#prepared-by");
    $categoryOfCauseOfDeathTpdAccident = $("#category-of-cause-of-death-tpd-accident");
    $causeOfDeathTpdAccident    = $("#cause-of-death-tpd-accident");
    $age                        = $("#age");
    $submitButton               = $("#submit-button");
    $message                    = $(".message");
    $errorsTemplate             = $("#errors-template").html();
    $causeOfDelay               = $("#cause-of-delay");
    $reasonOfDelay              = $("#reason-of-delay");
    $dateCompletedDocuments     = $("#date-completed-documents");

  }

  var _bindEvents = function() {
     $submitButton.on('click', function(){
        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
          data: {
            amount: $totalAmountPayable.val(),
            date_reported: $dateReported.val(),
            date_paid: $datePaid.val(),
            length_of_stay: $lengthOfStay.val(),
            equity_value: $equityValue.val(),
            retirement_fund: $retirementFund.val(),
            policy_number: $policyNumber.val(),
            face_amount: $faceAmount.val(),
            name_of_insured: $nameOfInsured.val(),
            date_of_birth: $dateOfBirth.val(),
            order_of_child: $orderOfChild.val(),
            gender: $gender.val(),
            arrears: $arrears.val(),
            type_of_insurance_policy: $typeOfInsurancePolicy.val(),
            classification_of_insured: $classificationOfInsured.val(),
            date_of_death_tpd_accident: $dateOfDeathTpdAccident.val(),
            date_of_policy_issue: $dateOfPolicyIssue.val(),
            returned_contribution: $returnedContribution.val(),
            beneficiary: $beneficiary.val(),
            category_of_cause_of_death_tpd_accident: $categoryOfCauseOfDeathTpdAccident.val(),
            cause_of_death_tpd_accident: $causeOfDeathTpdAccident.val(),
            age: $age.val(),
            cause_of_delay: $causeOfDelay.val(),
            reason_of_delay: $reasonOfDelay.val(),
            date_completed_documents: $dateCompletedDocuments.val()
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

  var typeOfInsurancePolicyValue = ($typeOfInsurancePolicy.val());
  var classificationOfInsuredValue = ($classificationOfInsured.val());
  
  if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Child)"){
    $orderOfChildField.show();
  }
  else{
    $orderOfChildField.hide();  
  }
  

  $dateOfDeathTpdAccident.on('change', function() {
    var dateOfPolicyIssueValue = $dateOfPolicyIssue.val();
    var dateOfDeathTpdAccidentValue = $dateOfDeathTpdAccident.val();
    var dateOfPolicyIssue = new Date(dateOfPolicyIssueValue);
    var dateOfDeathTpdAccident = new Date(dateOfDeathTpdAccidentValue);

    var years = dateOfDeathTpdAccident.getFullYear() - dateOfPolicyIssue.getFullYear();
    var months = dateOfDeathTpdAccident.getMonth() - dateOfPolicyIssue.getMonth();
    var days = dateOfDeathTpdAccident.getDate() - dateOfPolicyIssue.getDate();

    if (days < 0) {
        months--;
        var lastDayOfMonth = new Date(dateOfDeathTpdAccident.getFullYear(), dateOfDeathTpdAccident.getMonth(), 0).getDate();
        days += lastDayOfMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    var stay = "";
    if (years > 0) {
        stay += years + " Year";
        if (years > 1) {
            stay += "s";
        }
    }

    if (months > 0) {
        if (stay) {
            stay += " and ";
        }
        stay += months + " Month";
        if (months > 1) {
            stay += "s";
        }
    }

    $('#length-of-stay').val(stay);

 
    // if(typeOfInsurancePolicyValue == "Basic Life" && classificationOfInsuredValue == "Member"){ 
      if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Member" || typeOfInsurancePolicyValue == "TPD"  && classificationOfInsuredValue == "Member"){  
        if (months < 3 && years < 1){
            var value = 2000.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 6000.00
          }
          else if (years >= 1 && years < 2){
           var value = 10000.00
          }
          else if (years >= 2 && years < 3){
            var value = 30000.00
          }
          else if (years >= 3){
            var value = 50000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.show();
      } else if(typeOfInsurancePolicyValue == "Accidental Death"  && classificationOfInsuredValue == "Member") {
        if (months < 3 && years < 1){
            var value = 2000.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 12000.00
          }
          else if (years >= 1 && years < 2){
           var value = 20000.00
          }
          else if (years >= 2 && years < 3){
            var value = 60000.00
          }
          else if (years >= 3){
            var value = 100000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.show();
      } else if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Parent)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Child)" ||typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Parent)"){
        if (months < 3 && years < 1){
            var value = 0.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 5000.00
          }
          else if (years >= 1 && years < 2){
           var value = 5000.00
          }
          else if (years >= 2 && years < 3){
            var value = 10000.00
          }
          else if (years >= 3){
            var value = 10000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.hide();
      } else if(typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Parent)") {
        if (months < 3 && years < 1){
            var value = 0.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 5000.00
          }
          else if (years >= 1 && years < 2){
           var value = 5000.00
          }
          else if (years >= 2 && years < 3){
            var value = 10000.00
          }
          else if (years >= 3){
            var value = 10000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.hide();
      } else if(typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Parent)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Member") {
        var value = 0.00

        $('#face-amount').val(value);
      }

    });

    $returnedContribution.on('change', function() { 
      var value = $('#face-amount').val() 
      var return_contri = $('#returned-contribution').val()
      $('#total-amount-payable').val(parseFloat(value) + parseFloat(return_contri))
    });

    $arrears.on('change', function() { 
      var value       = $('#total-amount-payable').val() 
      var arrears_val = $('#arrears').val()
      $('#total-amount-payable').val(parseFloat(value) - parseFloat(arrears_val))
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


    $classificationOfInsured.on('change', function() { 
      var typeOfInsurancePolicyValue = ($typeOfInsurancePolicy.val());
      var classificationOfInsuredValue = ($classificationOfInsured.val());

      if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Child)"){
        $orderOfChildField.show();
      }
      else{
        $orderOfChildField.hide();
      }  
    });

    $typeOfInsurancePolicy.on('change', function(){
      var typeOfInsurancePolicyValue = $typeOfInsurancePolicy.val();
      var classificationOfInsuredValue = $classificationOfInsured.val();  
      var dateOfPolicyIssueValue = $dateOfPolicyIssue.val();
      var dateOfDeathTpdAccidentValue = $dateOfDeathTpdAccident.val();

      var recognitionDate = new Date(dateOfPolicyIssueValue);
      var dateOfResignation = new Date(dateOfDeathTpdAccidentValue);
      var currentDate = new Date();


      function getMonthsDifference(date1, date2) {
          const monthsInYear = 12;
          const diffYear = date2.getFullYear() - date1.getFullYear();
          const diffMonth = date2.getMonth() - date1.getMonth();
          return diffYear * monthsInYear + diffMonth;
      }


      var numberOfMonths = getMonthsDifference(dateOfPolicyIssue, dateOfDeathTpdAccident);

      var years = Math.floor(numberOfMonths / 12);
      var months = numberOfMonths % 12;

      if (years < 1){
          if (months > 1){
              var stay = months + " Months"
              $('#length-of-stay').val(stay)
          } else if (months == 1){
              var stay = months + " Month"
              $('#length-of-stay').val(stay)
          } else if (months < 1) {
              if (numberOfDays == 1){
                  var stay = numberOfDays + " Day"
                  $('#length-of-stay').val(stay)
              } else if (numberOfDays > 1){
                  var stay = numberOfDays + " Days"
                  $('#length-of-stay').val(stay)
              } else if (numberOfDays < 1){
                  var stay = ""
                  $('#length-of-stay').val(stay)
              }
          }  
      } else {
          if (years == 1 && months == 0){
              var stay = years + " Year"
              $('#length-of-stay').val(stay)
          } else if (years == 1 && months == 1){
              var stay = years + " Year and " + months + " Month" 
              $('#length-of-stay').val(stay)
          } else if (years == 1 && months > 1){
              var stay = years + " Year and " + months + " Months"
              $('#length-of-stay').val(stay)
          } else if (years > 1 && months > 0){
              var stay = years + " Years and " + months + " Months"
              $('#length-of-stay').val(stay)
          } else if (years > 1 && months == 1){
              var stay = years + " Years and " + months + " Month"
              $('#length-of-stay').val(stay)
          } else if (years > 1 && months < 1){
              var stay = years + " Years"
              $('#length-of-stay').val(stay)
          }
      }

      if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Member" || typeOfInsurancePolicyValue == "TPD"  && classificationOfInsuredValue == "Member"){  
        if (months < 3 && years < 1){
            var value = 2000.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 6000.00
          }
          else if (years >= 1 && years < 2){
           var value = 10000.00
          }
          else if (years >= 2 && years < 3){
            var value = 30000.00
          }
          else if (years >= 3){
            var value = 50000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.show();
      } else if(typeOfInsurancePolicyValue == "Accidental Death"  && classificationOfInsuredValue == "Member") {
        if (months < 3 && years < 1){
            var value = 2000.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 12000.00
          }
          else if (years >= 1 && years < 2){
           var value = 20000.00
          }
          else if (years >= 2 && years < 3){
            var value = 60000.00
          }
          else if (years >= 3){
            var value = 100000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.show();
      } else if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Parent)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Child)" ||typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Parent)"){
        if (months < 3 && years < 1){
            var value = 0.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 5000.00
          }
          else if (years >= 1 && years < 2){
           var value = 5000.00
          }
          else if (years >= 2 && years < 3){
            var value = 10000.00
          }
          else if (years >= 3){
            var value = 10000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.hide();
      } else if(typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Parent)") {
        if (months < 3 && years < 1){
            var value = 0.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 5000.00
          }
          else if (years >= 1 && years < 2){
           var value = 5000.00
          }
          else if (years >= 2 && years < 3){
            var value = 10000.00
          }
          else if (years >= 3){
            var value = 10000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.hide();
      } else if(typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Parent)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Member") {
        var value = 0.00

        $('#face-amount').val(value);
      }
    });

    $classificationOfInsured.on('change', function(){
      var typeOfInsurancePolicyValue = $typeOfInsurancePolicy.val();
      var classificationOfInsuredValue = $classificationOfInsured.val();  
      var dateOfPolicyIssueValue = $dateOfPolicyIssue.val();
      var dateOfDeathTpdAccidentValue = $dateOfDeathTpdAccident.val();

      var dateOfPolicyIssue = new Date(dateOfPolicyIssueValue);
      var dateOfDeathTpdAccident = new Date(dateOfDeathTpdAccidentValue);

      function getMonthsDifference(date1, date2) {
          const monthsInYear = 12;
          const diffYear = date2.getFullYear() - date1.getFullYear();
          const diffMonth = date2.getMonth() - date1.getMonth();
          return diffYear * monthsInYear + diffMonth;
      }


      var numberOfMonths = getMonthsDifference(dateOfPolicyIssue, dateOfDeathTpdAccident);

      var years = Math.floor(numberOfMonths / 12);
      var months = numberOfMonths % 12;

      if (years < 1){
          if (months > 1){
              var stay = months + " Months"
              $('#length-of-stay').val(stay)
          } else if (months == 1){
              var stay = months + " Month"
              $('#length-of-stay').val(stay)
          } else if (months < 1) {
              if (numberOfDays == 1){
                  var stay = numberOfDays + " Day"
                  $('#length-of-stay').val(stay)
              } else if (numberOfDays > 1){
                  var stay = numberOfDays + " Days"
                  $('#length-of-stay').val(stay)
              } else if (numberOfDays < 1){
                  var stay = ""
                  $('#length-of-stay').val(stay)
              }
          }  
      } else {
          if (years == 1 && months == 0){
              var stay = years + " Year"
              $('#length-of-stay').val(stay)
          } else if (years == 1 && months == 1){
              var stay = years + " Year and " + months + " Month" 
              $('#length-of-stay').val(stay)
          } else if (years == 1 && months > 1){
              var stay = years + " Year and " + months + " Months"
              $('#length-of-stay').val(stay)
          } else if (years > 1 && months > 0){
              var stay = years + " Years and " + months + " Months"
              $('#length-of-stay').val(stay)
          } else if (years > 1 && months == 1){
              var stay = years + " Years and " + months + " Month"
              $('#length-of-stay').val(stay)
          } else if (years > 1 && months < 1){
              var stay = years + " Years"
              $('#length-of-stay').val(stay)
          }
      }

      if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Member" || typeOfInsurancePolicyValue == "TPD"  && classificationOfInsuredValue == "Member"){  
        if (months < 3 && years < 1){
            var value = 2000.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 6000.00
          }
          else if (years >= 1 && years < 2){
           var value = 10000.00
          }
          else if (years >= 2 && years < 3){
            var value = 30000.00
          }
          else if (years >= 3){
            var value = 50000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.show();
      } else if(typeOfInsurancePolicyValue == "Accidental Death"  && classificationOfInsuredValue == "Member") {
        if (months < 3 && years < 1){
            var value = 2000.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 12000.00
          }
          else if (years >= 1 && years < 2){
           var value = 20000.00
          }
          else if (years >= 2 && years < 3){
            var value = 60000.00
          }
          else if (years >= 3){
            var value = 100000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.show();
      } else if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Parent)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Child)" ||typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Parent)"){
        if (months < 3 && years < 1){
            var value = 0.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 5000.00
          }
          else if (years >= 1 && years < 2){
           var value = 5000.00
          }
          else if (years >= 2 && years < 3){
            var value = 10000.00
          }
          else if (years >= 3){
            var value = 10000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.hide();
      } else if(typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Parent)") {
        if (months < 3 && years < 1){
            var value = 0.00
          }
          else if (months >= 3 && years < 1){ 
            var value = 5000.00
          }
          else if (years >= 1 && years < 2){
           var value = 5000.00
          }
          else if (years >= 2 && years < 3){
            var value = 10000.00
          }
          else if (years >= 3){
            var value = 10000.00
          }

        $('#face-amount').val(value);
        $returnedContributionField.hide();
      } else if(typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Spouse)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Legal Dependent (Parent)" || typeOfInsurancePolicyValue == "MVAH" && classificationOfInsuredValue == "Member") {
        var value = 0.00

        $('#face-amount').val(value);
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
  blipForm.init();
});
