import Mustache from "mustache";
import $ from 'jquery';
import * as bootstrap from "bootstrap";

var $btnAdd;
var $btnDelete;
var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;
var $btnCheck;
var $btnConfirmCheck;
var $modalCheck;
var $btnDeclined;
var $btnConfirmDeclined;
var $modalDeclined;
var $btnPending;
var $btnConfirmPending;
var $modalPending;
var $selectMember;
var $message;
var templateErrorList;

// print pdf 
var $modalPrint;
var $printMessage;
var $btnPrintPdf;
var $btnPrint;

// kok
var $inputPlanType;
var $inputPlanCategory;
var $inputPartner;
var $inputPolicyNo;
var $inputEffectivityDate;
var $inputMaturityDate;
var $inputClientType;
var $inputFirstName;
var $inputMiddleName;
var $inputLastName;
var $inputAddress;
var $inputGender;
var $inputEnrolledStatus;
var $inputCivilStatus;
var $inputBirthDate;
var $inputAge;
var $inputPremiumCoverage;
var $inputMobileNo;
var $inputMembershipDate;
var $inputBenif_Fname;
var $inputBenif_Mname;
var $inputBenif_Lname;
var $inputBenif_BirthDate;
var $inputBenif_Gender;
var $inputBenif_Relationship;

var _id;
var _options;
var _authenticityToken;

var _urlAdd                = "/api/v1/insurance_loan_bundle_enrollments/add_member";
var _urlDelete             = "/api/v1/insurance_loan_bundle_enrollments/remove_member";
var _urlApprove            = "/api/v1/insurance_loan_bundle_enrollments/approve";
var _urlCheckTransaction   = "/api/v1/insurance_loan_bundle_enrollments/check";
var _urlDeclineTransaction = "/api/v1/insurance_loan_bundle_enrollments/declined";

var _cacheDom = function() {

  $btnAdd               = $("#btn-add");
  $btnDelete            = $(".btn-delete");
  $btnApprove           = $("#btn-approve");
  $btnConfirmApprove    = $("#btn-confirm-approve");
  $btnCheck             = $("#btn-check");
    
  $btnPrint             = $("#btn-print");
  $printMessage         = $(".print-message");
  $btnPrintPdf          = $("#btn-print-pdf");
  $modalPrint           = $("modal-print");

  $btnConfirmCheck      = $("#btn-confirm-check");
  $btnDeclined          = $("#btn-declined");
  $btnConfirmDeclined   = $("#btn-confirm-declined");
  $btnPending           = $("#btn-pending");
  $btnConfirmPending    = $("#btn-confirm-pending");


  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $modalCheck = new bootstrap.Modal(
    document.getElementById("modal-check-confirmation")
  );

  $modalDeclined = new bootstrap.Modal(
    document.getElementById("modal-declined-confirmation")
  );
  
  $selectMember             = $("#select-member");
  $message                  = $(".message");
  templateErrorList         = $("#template-error-list").html();
  $inputPlanType            = $("#input-plan-type");
  $inputPlanCategory        = $("#input-plan-category");
  $inputPartner             = $("#input-partner");
  $inputPolicyNo            = $("#input-policy-no");
  $inputEffectivityDate     = $("#input-effectivity-date");
  $inputMaturityDate        = $("#input-maturity-date");
  $inputClientType          = $("#input-client-type");
  $inputFirstName           = $("#input-first-name");
  $inputMiddleName          = $("#input-middle-name");
  $inputLastName            = $("#input-last-name");
  $inputAddress             = $("#input-address");
  $inputGender              = $("#input-gender");
  $inputEnrolledStatus      = $("#input-enrolled-status");
  $inputCivilStatus         = $("#input-civil-status");
  $inputBirthDate           = $("#input-birth-date");
  $inputAge                 = $("#input-age");
  $inputPremiumCoverage     = $("#input-premium-coverage");
  $inputMobileNo            = $("#input-mobile-no");
  $inputMembershipDate      = $("#input-membership-date");
  $inputBenif_Fname         = $("#input-benif-fname");
  $inputBenif_Mname         = $("#input-benif-mname");
  $inputBenif_Lname         = $("#input-benif-lname");
  $inputBenif_BirthDate     = $("#input-benif-birth-date");
  $inputBenif_Gender        = $("#input-benif-gender");
  $inputBenif_Relationship  = $("#input-benif-relationship");

};

var _bindEvents = function() {

  var inputClientTypeValue = ($inputClientType.val());
    if(inputClientTypeValue == "DEPENDENT")
    {
      $inputFirstName.show();
      $inputMiddleName.show();
      $inputLastName.show();
      $inputAddress.show();
      $inputGender.show();
      $inputBirthDate.show();
      $inputMobileNo.show();
      $inputCivilStatus.show();
    }
    else
    {
      $inputFirstName.hide();
      $inputMiddleName.hide();
      $inputLastName.hide();
      $inputAddress.hide();
      $inputGender.hide();
      $inputBirthDate.hide();
      $inputMobileNo.hide();
      $inputCivilStatus.hide();
    }

  //prind pdf
  $btnPrint.on("click", function() {
    $modalPrint.show();

    var type = "print_insurance_loan_bundle_enrollment";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + _id);
  });

  // check
  $btnCheck.on("click", function() {
    $modalCheck.show();
    $message.html("");
  });

  // approved
  $btnApprove.on("click", function() {
    $modalApprove.show();
    $message.html("");
  });

  // declined
  $btnDeclined.on("click", function() {
    $modalDeclined.show();
    $message.html("");
  });

  $btnConfirmApprove.on("click", function() {
    $btnConfirmApprove.prop("disabled", true);

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken
    };

    $message.html("Loading...");

    $.ajax({
      url: _urlApprove,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Reloading...");
        window.location.reload();
      },
      error: function(response) {
        var errors = [];

        try {
          errors = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors.push("Something went wrong.");
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmApprove.prop("disabled", false);
        }
      }
    });
  });

  //delete
  $btnDelete.on("click", function() {
    var $btn      = $(this);
    var memberId  = $btn.data("member-id");

    $btn.prop("disabled", true);

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken,
      member_id: memberId
    };

    $message.html("Loading...");

    $.ajax({
      url: _urlDelete,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Reloading...");
        window.location.reload();
      },
      error: function(response) {
        var errors = [];

        try {
          errors = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors.push("Something went wrong.");
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btn.prop("disabled", false);
        }
      }
    });
  });

  //Check
  $btnConfirmCheck.on("click", function() {
    $btnConfirmCheck.prop("disabled", true);

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken
    };

    $message.html("Loading...");

    $.ajax({
      url: _urlCheckTransaction,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Reloading...");
        window.location.reload();
      },
      error: function(response) {
        var errors = [];

        try {
          errors = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors.push("Something went wrong.");
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmCheck.prop("disabled", false);
        }
      }
    });
  });

  //Declined
  $btnConfirmDeclined.on("click", function() {
    $btnConfirmDeclined.prop("disabled", true);

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken
    };

    $message.html("Loading...");

    $.ajax({
      url: _urlDeclineTransaction,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Reloading...");
        window.location.reload();
      },
      error: function(response) {
        var errors = [];

        try {
          errors = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors.push("Something went wrong.");
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmCheck.prop("disabled", false);
        }
      }
    });
  });
 
  //Add
  $btnAdd.on("click", function() {
    var memberId  = $selectMember.val();
    var PlanType              = $inputPlanType.val();
    var PlanCategory          = $inputPlanCategory.val();
    var Partner               = $inputPartner.val();
    var PolicyNo              = $inputPolicyNo.val();
    var EffectivityDate       = $inputEffectivityDate.val();
    var MaturityDate          = $inputMaturityDate.val();
    var ClientType            = $inputClientType.val();
    var FirstName             = $inputFirstName.val();
    var MiddleName            = $inputMiddleName.val();
    var LastName              = $inputLastName.val();
    var Address               = $inputAddress.val();
    var Gender                = $inputGender.val();
    var EnrolledStatus        = $inputEnrolledStatus.val();
    var CivilStatus           = $inputCivilStatus.val();
    var BirthDate             = $inputBirthDate.val();
    var Age                   = $inputAge.val();
    var PremiumCoverage       = $inputPremiumCoverage.val();
    var MobileNo              = $inputMobileNo.val();
    var MembershipDate        = $inputMembershipDate.val();
    var Benif_Fname           = $inputBenif_Fname.val();
    var Benif_Mname           = $inputBenif_Mname.val();
    var Benif_Lname           = $inputBenif_Lname.val();
    var Benif_BirthDate       = $inputBenif_BirthDate.val();
    var Benif_Gender          = $inputBenif_Gender.val();
    var Benif_Relationship    = $inputBenif_Relationship.val();
  
    $btnAdd.prop("disabled", true);
    $selectMember.prop("disabled", true);
    $inputPlanType.prop("disabled", true);
    $inputPlanCategory.prop("disabled", true);
    $inputPartner.prop("disabled", true);
    $inputPolicyNo.prop("disabled", true);
    $inputEffectivityDate.prop("disabled", true);
    $inputMaturityDate.prop("disabled", true);
    $inputClientType.prop("disabled", true);
    $inputFirstName.prop("disabled", true);
    $inputMiddleName.prop("disabled", true);
    $inputLastName.prop("disabled", true);
    $inputAddress.prop("disabled", true);
    $inputGender.prop("disabled", true);
    $inputEnrolledStatus.prop("disabled", true);
    $inputCivilStatus.prop("disabled", true);
    $inputBirthDate.prop("disabled", true);
    $inputAge.prop("disabled", true);
    $inputPremiumCoverage.prop("disabled", true);
    $inputMobileNo.prop("disabled", true);
    $inputMembershipDate.prop("disabled", true);
    $inputBenif_Fname.prop("disabled", true);
    $inputBenif_Mname.prop("disabled", true);
    $inputBenif_Lname.prop("disabled", true);
    $inputBenif_BirthDate.prop("disabled", true);
    $inputBenif_Gender.prop("disabled", true);
    $inputBenif_Relationship.prop("disabled", true);

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken,
      member_id: memberId,
      plan_type: PlanType,
      plan_category: PlanCategory, 
      partner: Partner,
      policy_no: PolicyNo, 
      effectivity_date: EffectivityDate, 
      maturity_date: MaturityDate, 
      client_type: ClientType, 
      first_name: FirstName, 
      middle_name: MiddleName, 
      last_name: LastName, 
      address: Address, 
      gender: Gender, 
      enrolled_status: EnrolledStatus, 
      civil_status: CivilStatus, 
      birth_date: BirthDate,
      age: Age, 
      premium_coverage: PremiumCoverage, 
      mobile_no: MobileNo, 
      membership_date: MembershipDate, 
      benif_fname: Benif_Fname, 
      benif_mname: Benif_Mname, 
      benif_lname: Benif_Lname, 
      benif_birth_date: Benif_BirthDate, 
      benif_gender: Benif_Gender, 
      benif_relationship: Benif_Relationship 
    };

    $message.html("Loading...");
    $.ajax({
      url: _urlAdd,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Reloading...");
        window.location.reload();
      },
      error: function(response) {
        var errors = [];

        try {
          errors = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors.push("Something went wrong.");
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnAdd.prop("disabled", false);
          $selectMember.prop("disabled", false);
          $inputPlanType.prop("disabled", false);
          $inputPlanCategory.prop("disabled", false);
          $inputPartner.prop("disabled", false);
          $inputPolicyNo.prop("disabled", false);
          $inputEffectivityDate.prop("disabled", false);
          $inputMaturityDate.prop("disabled", false);
          $inputClientType.prop("disabled", false);
          $inputFirstName.prop("disabled", false);
          $inputMiddleName.prop("disabled", false);
          $inputLastName.prop("disabled", false);
          $inputAddress.prop("disabled", false);
          $inputGender.prop("disabled", false);
          $inputEnrolledStatus.prop("disabled", false);
          $inputCivilStatus.prop("disabled", false);
          $inputBirthDate.prop("disabled", false);
          $inputAge.prop("disabled", false);
          $inputPremiumCoverage.prop("disabled", false);
          $inputMobileNo.prop("disabled", false);
          $inputMembershipDate.prop("disabled", false);
          $inputBenif_Fname.prop("disabled", false);
          $inputBenif_Mname.prop("disabled", false);
          $inputBenif_Lname.prop("disabled", false);
          $inputBenif_BirthDate.prop("disabled", false);
          $inputBenif_Gender.prop("disabled", false);
          $inputBenif_Relationship.prop("disabled", false);

        }
      }
    });
  });
  $inputClientType.on('change', function() { 
    var inputClientTypeValue = ($inputClientType.val());

    if(inputClientTypeValue == "PRINCIPAL/MEMBER")
     {
        $inputFirstName.hide();
        $inputMiddleName.hide();
        $inputLastName.hide();
        $inputAddress.hide();
        $inputGender.hide();
        $inputBirthDate.hide();
        $inputMobileNo.hide();
        $inputCivilStatus.hide();
      }
      else
      {
        $inputFirstName.show();
        $inputMiddleName.show();
        $inputLastName.show();
        $inputAddress.show();
        $inputGender.show();
        $inputBirthDate.show();
        $inputMobileNo.show();
        $inputCivilStatus.show();
      }
  });
};

var init  = function(options) {
  _options            = options;
  _id                 = _options.id
  _authenticityToken  = _options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };