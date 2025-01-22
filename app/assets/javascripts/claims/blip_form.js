//= require jquery

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
    $claimsPayment              = $("#claims-payment");
    $accountName                = $("#account-name");
    $accountNumber              = $("#account-number");
    $control                    = $("#control");
    $causeOfDelay               = $("#cause-of-delay");
    $reasonOfDelay              = $("#reason-of-delay");
    $dateCompletedDocuments     = $("#date-completed-documents"); 

  }

  var _bindEvents = function() {
     $submitButton.on('click', function(){
        $submitButton.addClass('loading');

        var data = {
          id: id,
          date_prepared: $datePrepared.val(),
          prepared_by: $preparedBy.val(),
          control: $control.val(),
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
            claims_payment: $claimsPayment.val(),
            account_name: $accountName.val(),
            account_number: $accountNumber.val(),
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
            $submitButton.removeClass('loading');
            window.location.href = "/claims/" + id;
          },
          error: function(responseContent) {
            console.log(responseContent);
            var errors = JSON.parse(responseContent.responseText).errors;
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

  var typeOfInsurancePolicyValue = ($typeOfInsurancePolicy.val());
  var classificationOfInsuredValue = ($classificationOfInsured.val());
  
  if(typeOfInsurancePolicyValue == "Basic Life Insurance Plan" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "Accidental Death" && classificationOfInsuredValue == "Legal Dependent (Child)" || typeOfInsurancePolicyValue == "TPD" && classificationOfInsuredValue == "Legal Dependent (Child)"){
    $orderOfChildField.show();
  }
  else{
    $orderOfChildField.hide();  
  }
  

  $dateOfDeathTpdAccident.on('change', function() {
    var typeOfInsurancePolicyValue = ($typeOfInsurancePolicy.val());
    var classificationOfInsuredValue = ($classificationOfInsured.val());  
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

    $('#length-of-stay').val(stay)
 
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
        $('#total-amount-payable').val(value);
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
        $('#total-amount-payable').val(value);
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
        $('#total-amount-payable').val(value);
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
        $('#total-amount-payable').val(value);
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
      var typeOfInsurancePolicyValue = ($typeOfInsurancePolicy.val());
      var classificationOfInsuredValue = ($classificationOfInsured.val());  
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

      $('#length-of-stay').val(stay)


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
      var typeOfInsurancePolicyValue = ($typeOfInsurancePolicy.val());
      var classificationOfInsuredValue = ($classificationOfInsured.val());  
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

      $('#length-of-stay').val(stay)
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
