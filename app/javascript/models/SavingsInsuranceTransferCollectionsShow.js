import Mustache from "mustache";
import $ from 'jquery';
import * as bootstrap from "bootstrap";

var $btnAdd;
var $btnDelete;
var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;
var $selectMember;
var $inputAmount;
var $inputParticular;
var $btnUpdateParticular;
var $message;
var templateErrorList;

var $btnUpdateOrArnumber;
var $inputOrNumber;          
var $inputArNumber; 

var $inputLoanProductId;
var $inputPrincipal;
var $inputTerm;
var $inputNumInstallments;
var $inputMaturityDate;
var $inputEffectiveDate;
var $inputClipNumber;
var $inputBeneficiary;

//k-bente
var $inputKbenteBeneficiaryName;
var $inputDateOfBirth;
var $inputGender;
var $inputStatus;
var $inputaddress;
var $inputEffectivityDate;
var $inputPremium;
var $inputRelationship;

//k-kalinga
var $inputKkalingaBeneficiaryName;
var $inputKkalingaDateOfBirth;
var $inputKkalingaGender;
var $inputKkalingaStatus;
var $inputKkalingaaddress;
var $inputKkalingaEffectivityDate;
var $inputKkalingaPremium;
var $inputKkalingaRelationship;
var $inputKkalingaNameOfInsured;
var $inputPOCNumber;

//printing kbente
var $modalPrint;
var $printMessage;
var $btnPrintPdf;
var $btnPrint;

//printing kkalinga
var $modalPrintK;
var $printMessageK;
var $btnPrintPdfK;
var $btnPrintK;

var _id;
var _options;
var _authenticityToken;

var _urlAdd               = "/api/v1/savings_insurance_transfer_collections/add_member";
var _urlDelete            = "/api/v1/savings_insurance_transfer_collections/remove_member";
var _urlApprove           = "/api/v1/savings_insurance_transfer_collections/approve";
var _urlUpdateParticular  = "/api/v1/savings_insurance_transfer_collections/update_particular";
var _urlUpdateOrArNumber  = "/api/v1/savings_insurance_transfer_collections/update_or_ar_number";
var _cacheDom = function() {
  $btnAdd               = $("#btn-add");
  $btnUpdateParticular  = $("#btn-update-particular");
  $btnUpdateOrArnumber  = $("#btn-update-or-ar-number");
  $btnDelete            = $(".btn-delete");
  $btnApprove           = $("#btn-approve");
  $btnConfirmApprove    = $("#btn-confirm-approve");
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );
  $selectMember         = $("#select-member");
  $inputAmount          = $("#input-amount");
  $inputParticular      = $("#input-particular");
  $inputOrNumber        = $("#input-or-number");
  $inputArNumber        = $("#input-ar-number");
  $message              = $(".message");
  templateErrorList     = $("#template-error-list").html();
  $inputLoanProductId   = $("#input-loan-product-id");
  $inputPrincipal       = $("#input-principal");
  $inputTerm            = $("#input-term");
  $inputNumInstallments = $("#input-num-installments");
  $inputMaturityDate    = $("#input-maturity-date");
  $inputEffectiveDate   = $("#input-effective-date");
  $inputClipNumber      = $("#input-clip-number");
  $inputBeneficiary     = $("#input-beneficiary");
  
  //k-bente
  $inputKbenteBeneficiaryName   = $("#input-kbente-beneficiary-name");
  $inputDateOfBirth             = $("#input-date-of-birth");
  $inputGender                  = $("#input-gender");
  $inputStatus                  = $("#input-status");
  $inputaddress                 = $("#input-address");
  $inputEffectivityDate         = $("#input-effectivity-date");
  $inputPremium                 = $("#input-premium");
  $inputRelationship            = $("#input-relationship");

  //k-kalinga
  $inputKkalingaBeneficiaryName = $("#input-kkalinga-beneficiary-name");
  $inputKkalingaDateOfBirth     = $("#input-kkalinga-date-of-birth");
  $inputKkalingaGender          = $("#input-kkalinga-gender");
  $inputKkalingaStatus          = $("#input-kkalinga-status");
  $inputKkalingaaddress         = $("#input-kkalinga-address");
  $inputKkalingaEffectivityDate = $("#input-kkalinga-effectivity-date");
  $inputKkalingaPremium         = $("#input-kkalinga-premium");
  $inputKkalingaRelationship    = $("#input-kkalinga-relationship");
  $inputKkalingaNameOfInsured   = $("#input-kkalinga-name-of-insured");
  $inputPOCNumber               = $("#input-pocnumber");

  //printing kbente
  $btnPrint                     = $("#btn-print");
  $printMessage                 = $(".print-message");
  $btnPrintPdf                  = $("#btn-print-pdf");
  $modalPrint                   = $("modal-print");

  //printing kkalinga
  $btnPrintK                     = $("#btn-print-k");
  $printMessageK                 = $(".print-message-k");
  $btnPrintPdfK                  = $("#btn-print-pdf-k");
  $modalPrintK                   = $("modal-print-k");
};

var _bindEvents = function() {

  $btnPrint.on("click", function() {
    $modalPrint.show();

    var type = "print_kbente_bill";

    $modalPrint.hide();
    window.open("/print?type=" + type + "&id=" + _id);
  });

  $btnPrintK.on("click", function() {
    $modalPrintK.show();

    var type = "print_kkalinga_bill";

    $modalPrintK.hide();
    window.open("/print?type=" + type + "&id=" + _id);
  });

  $btnApprove.on("click", function() {
    $modalApprove.show();
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

  $btnAdd.on("click", function() {
    var amount    = $inputAmount.val();
    var memberId  = $selectMember.val();

    var loanProductId        = $inputLoanProductId.val();
    var principal            = $inputPrincipal.val();
    var term                 = $inputTerm.val();
    var numInstallments      = $inputNumInstallments.val();
    var maturityDate         = $inputMaturityDate.val();
    var effectiveDate        = $inputEffectiveDate.val();
    var clipNumber           = $inputClipNumber.val();
    var beneficiary          = $inputBeneficiary.val();

    //k-bente
    var kbenteBeneficiaryName  = $inputKbenteBeneficiaryName.val();
    var dateOfBirth            = $inputDateOfBirth.val();
    var gender                 = $inputGender.val();
    var status                 = $inputStatus.val();
    var address                = $inputaddress.val();
    var effectivityDate        = $inputEffectivityDate.val();
    var premium                = $inputPremium.val();
    var relationship           = $inputRelationship.val(); 

    //k-kalinga
    var kkalingaBeneficiaryName        = $inputKkalingaBeneficiaryName.val();
    var kkalingaDateOfBirth            = $inputKkalingaDateOfBirth.val();
    var kkalingaGender                 = $inputKkalingaGender.val();
    var kkalingaStatus                 = $inputKkalingaStatus.val();
    var kkalingaaddress                = $inputKkalingaaddress.val();
    var kkalingaEffectivityDate        = $inputKkalingaEffectivityDate.val();
    var kkalingaPremium                = $inputKkalingaPremium.val();
    var kkalingaRelationship           = $inputKkalingaRelationship.val(); 
    var kkalingaNameOfInsured          = $inputKkalingaNameOfInsured.val();
    var pocNumber                      = $inputPOCNumber.val(); 
  
    $btnAdd.prop("disabled", true);
    $inputAmount.prop("disabled", true);
    $selectMember.prop("disabled", true);
  
    $inputLoanProductId.prop("disabled", true);
    $inputPrincipal.prop("disabled", true);
    $inputTerm.prop("disabled", true);
    $inputNumInstallments.prop("disabled", true);
    $inputMaturityDate.prop("disabled", true);
    $inputEffectiveDate.prop("disabled", true);
    $inputClipNumber.prop("disabled", true);
    $inputBeneficiary.prop("disabled", true);
    
    //k-bente
    $inputKbenteBeneficiaryName.prop("disabled", true);
    $inputDateOfBirth.prop("disabled", true);
    $inputGender.prop("disabled", true);
    $inputStatus.prop("disabled", true);
    $inputaddress.prop("disabled", true);
    $inputEffectivityDate.prop("disabled", true);
    $inputPremium.prop("disabled", true);
    $inputRelationship.prop("disabled", true);

    //k-kalinga
    $inputKkalingaBeneficiaryName.prop("disabled", true);
    $inputKkalingaDateOfBirth.prop("disabled", true);
    $inputKkalingaGender.prop("disabled", true);
    $inputKkalingaStatus.prop("disabled", true);
    $inputKkalingaaddress.prop("disabled", true);
    $inputKkalingaEffectivityDate.prop("disabled", true);
    $inputKkalingaPremium.prop("disabled", true);
    $inputKkalingaRelationship.prop("disabled", true);
    $inputKkalingaNameOfInsured.prop("disabled", true);
    $inputPOCNumber.prop("disabled", true);

    var data  = {
      id: _id,
      authenticity_token: _authenticityToken,
      amount: amount,
      member_id: memberId,
      loan_product_id: loanProductId,
      principal: principal,
      term: term,
      num_installments: numInstallments,
      maturity_date: maturityDate,
      effective_date: effectiveDate,
      clip_number: clipNumber,
      beneficiary: beneficiary,
      kbente_beneficiary_name: kbenteBeneficiaryName,
      date_of_birth: dateOfBirth,
      gender: gender,
      status: status,
      address: address,
      effectivity_date: effectivityDate,
      premium: premium,
      relationship: relationship,
      kkalinga_name_of_insured: kkalingaNameOfInsured,
      kkalinga_date_of_birth: kkalingaDateOfBirth,
      kkalinga_gender: kkalingaGender,
      kkalinga_status: kkalingaStatus,
      kkalinga_address: kkalingaaddress,
      kkalinga_effectivity_date: kkalingaEffectivityDate,
      kkalinga_premium: kkalingaPremium,
      kkalinga_relationship: kkalingaRelationship,
      kkalinga_beneficiary_name: kkalingaBeneficiaryName,
      
      poc_number: pocNumber
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
          $inputAmount.prop("disabled", false);
          $selectMember.prop("disabled", false);
          
          $inputLoanProductId.prop("disabled", false);
          $inputPrincipal.prop("disabled", false);
          $inputTerm.prop("disabled", false);
          $inputNumInstallments.prop("disabled", false);
          $inputMaturityDate.prop("disabled", false);
          $inputEffectiveDate.prop("disabled", false);
          $inputClipNumber.prop("disabled", false);
          $inputBeneficiary.prop("disabled", false);
          
          //k-bente
          $inputKbenteBeneficiaryName.prop("disabled", false);
          $inputDateOfBirth.prop("disabled", false);
          $inputGender.prop("disabled", false);
          $inputStatus.prop("disabled", false);
          $inputaddress.prop("disabled", false);
          $inputEffectivityDate.prop("disabled", false);
          $inputPremium.prop("disabled", false);
          $inputRelationship.prop("disabled", false);

           //k-kalinga
          $inputKkalingaBeneficiaryName.prop("disabled", false);
          $inputKkalingaDateOfBirth.prop("disabled", false);
          $inputKkalingaGender.prop("disabled", false);
          $inputKkalingaStatus.prop("disabled", false);
          $inputKkalingaaddress.prop("disabled", false);
          $inputKkalingaEffectivityDate.prop("disabled", false);
          $inputKkalingaPremium.prop("disabled", false);
          $inputKkalingaRelationship.prop("disabled", false);
          $inputKkalingaNameOfInsured.prop("disabled", false);
          $inputPOCNumber.prop("disabled", false);

        }
      }
    });
  });

  $btnUpdateParticular.on("click", function() {
    var particular = $inputParticular.val();

    $btnUpdateParticular.prop("disabled", true);
    $inputParticular.prop("disabled", true);
    
    var data  = {
      id: _id,
      authenticity_token: _authenticityToken,
      particular: particular
    };

    $message.html("Loading...");

    $.ajax({
      url: _urlUpdateParticular,
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

          $btnUpdateParticular.prop("disabled", false);
          $inputParticular.prop("disabled", false);
        }
      }
    });
  });

  $btnUpdateOrArnumber.on("click", function() {
    var arNumber          = $inputArNumber.val();
    var orNumber          = $inputOrNumber.val();

    $btnUpdateOrArnumber.prop("disabled", true);
    $inputArNumber.prop("disabled", true);
    $inputOrNumber.prop("disabled", true);
    
    var data  = {
      id: _id,
      authenticity_token: _authenticityToken,
      or_number: orNumber,
      ar_number: arNumber
    };

    $message.html("Loading...");

    $.ajax({
      url: _urlUpdateOrArNumber,
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

          $btnUpdateOrArnumber.prop("disabled", false);
          $inputArNumber.prop("disabled", false);
          $inputOrNumber.prop("disabled", false);
        }
      }
    });
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