import Mustache from "mustache";
import $ from 'jquery';
import * as bootstrap from "bootstrap";
import select2 from 'select2';
select2($);

var $modalDelete;
var $modalCreateSurvey;
var $modalRestore;
var $modalUnlock;
var $modalChangeMemberType;
var $modalUploadProfilePicture;
var $modalUploadSignature;
var $modalDeleteProfilePicture;
var $modalDeleteSignature;
var $modalRegister;
var $btnGenerateSignature;
var $btnClearSignature;
var $btnConfirmSignature;
var $btnConfirmNewLoan;
var $btnCreateSurvey;
var $btnConfirmCreateSurvey;
var $btnDelete;
var $btnDeleteProfilePicture;
var $btnDeleteSignature;
var $btnConfirmDelete;
var $btnUnlock;
var $btnConfirmUnlock;
var $btnRegister;
var $btnConfirmRegister;
var $btnRestore;
var $btnConfirmRestore;
var $btnGenerateMissingAccounts;
var $btnChangeMemberType;
var $btnConfirmChangeMemberType;
var $btnConfirmChangeRecognitionDate;
var $btnConfirmDeleteProfilePicture;
var $btnConfirmDeleteSignature;
var $btnUploadProfilePicture;
var $btnConfirmUploadProfilePicture;
var $btnUploadSignature;
var $btnConfirmUploadSignature;
var $inputRecognitionDate;
var $selectLoanProduct;
var $selectSurvey;
var $selectMemberType;
var $message;
var $btnResignFromInsurance;
var $modalResignFromInsurance;
var $btnConfirmInsuranceResign;
var $btnConfirmReinstatement;
var $inputDateResigned;
var $inputReason;
var $inputReinstatementDate;
var $inputDateStopped;
var $fileProfilePicture;
var $fileSignature;
var templateErrorList;

var $btnConfirmClaimsCopy;
var $inputDateOfDeath;

var $btnConfirmRestructure;
var $selectRestructureLoanProduct;
var $btnRecomputeRestructure;
var $modalRecomputeRestructure;
var $btnConfirmRecomputeRestructure;
var $selectActiveLoans;
var $inputCoMakerA;
var $selectCoMakerB;
var $inputPnNumber;
var $inputClipNumber;
var $inputDatePrepared;
var $selectTerm;
var $selectModeOfPayment;
var $inputBeneficiaryFirstName;
var $inputBeneficiaryMiddleName;
var $inputBeneficiaryLastName;
var $inputBeneficiaryDateOfBirth;
var $inputBeneficiaryRelationship;

var $inputMykoinsPassword;
var $inputMykoinsPasswordConfirmation;
var $btnSaveMykoinsPassword;

var $btnConfirmMakePayment;
var $selectMakePaymentType;

var $btnErase;
var $modalErase;
var $btnConfirmErase;

var _urlSaveSignature           = "/api/v1/members/save_signature";
var _urlNewLoan                 = "/api/v1/loans/apply";
var _urlRestructure             = "/api/v1/loans/restructure";
var _urlRecomputeRestructure    = "/api/v1/loans/recompute_restructure";
var _urlCreateSurvey            = "/api/v1/members/create_survey";
var _urlDelete                  = "/api/v1/members/delete";
var _urlUnlock                  = "/api/v1/members/unlock";
var _urlRestore                 = "/api/v1/members/restore";
var _urlGenerateMissingAccounts = "/api/v1/members/generate_missing_accounts";
var _urlChangeMemberType        = "/api/v1/members/change_member_type";
var _urlChangeRecognitionDate   = "/api/v1/members/change_recognition_date";
var _urlResignFromInsurance     = "/api/v1/members/resign";
var _urlReinstatement           = "/api/v1/members/reinstate";
var _urlUploadProfilePicture    = "/api/v1/members/upload_profile_picture";
var _urlDeleteProfilePicture    = "/api/v1/members/delete_profile_picture";
var _urlUploadSignature         = "/api/v1/members/upload_signature";
var _urlDeleteSignature         = "/api/v1/members/delete_signature";
var _urlRegister                = "/api/v1/members/register";
var _urlEraseRecord             = "/api/v1/adjustments/accrued_interests/erase_record";
var _urlUpdateMykoinsPassword   = "/api/v2/members/update_password";
var _memberId;
var _authenticityToken;
var _loanId;

var _cacheDom = function() {
  /**
   * Bootstrap 5 modal initialization
   **/
  $modalCreateSurvey = new bootstrap.Modal(
    document.getElementById("modal-create-survey")
  )

  $modalDelete = new bootstrap.Modal(
    document.getElementById("modal-delete")
  )

  $modalUnlock = new bootstrap.Modal(
    document.getElementById("modal-unlock")
  )

  $modalRestore = new bootstrap.Modal(
    document.getElementById("modal-restore")
  )

  $modalChangeMemberType = new bootstrap.Modal(
    document.getElementById("modal-change-member-type")
  )

  $modalUploadProfilePicture = new bootstrap.Modal(
    document.getElementById("modal-upload-profile-picture")
  ) 

  $modalDeleteProfilePicture = new bootstrap.Modal(
    document.getElementById("modal-delete-profile-picture")
  )

  $modalDeleteSignature = new bootstrap.Modal(
    document.getElementById("modal-delete-signature")
  )

  $modalRegister = new bootstrap.Modal(
    document.getElementById("modal-register")
  )

  $modalResignFromInsurance = new bootstrap.Modal(
    document.getElementById("modal-resign-from-insurance")
  )

  $modalErase = new bootstrap.Modal(
    document.getElementById("modal-erase")
  )

  $modalRecomputeRestructure = new bootstrap.Modal(
    document.getElementById("modal-recompute-restructure")
  )

  $btnConfirmSignature              = $("#btn-confirm-signature");
  $btnGenerateSignature             = $("#btn-generate-signature");
  $btnClearSignature                = $("#btn-clear-signature");
  $btnCreateSurvey                  = $("#btn-create-survey");
  $btnConfirmCreateSurvey           = $("#btn-confirm-create-survey");
  $btnConfirmNewLoan                = $("#btn-confirm-new-loan");
  $btnDelete                        = $("#btn-delete");
  $btnDeleteProfilePicture          = $("#btn-delete-profile-picture");
  $btnDeleteSignature               = $("#btn-delete-signature");
  $btnConfirmDelete                 = $("#btn-confirm-delete");
  $btnConfirmDeleteProfilePicture   = $("#btn-confirm-delete-profile-picture");
  $btnRegister                      = $("#btn-register");
  $btnConfirmRegister               = $("#btn-confirm-register");
  $btnUnlock                        = $("#btn-unlock");
  $btnRestore                       = $("#btn-restore");
  $btnConfirmRestore                = $("#btn-confirm-restore");
  $btnConfirmUnlock                 = $("#btn-confirm-unlock");
  $btnGenerateMissingAccounts       = $("#btn-generate-missing-accounts");
  $btnChangeMemberType              = $("#btn-change-member-type");
  $btnConfirmChangeMemberType       = $("#btn-confirm-change-member-type");
  $btnConfirmChangeRecognitionDate  = $("#btn-confirm-change-recognition-date");
  $btnConfirmRecomputeRestructure   = $("#btn-confirm-recompute-restructure")
  $btnUploadSignature               = $("#btn-upload-signature");
  $btnConfirmUploadSignature        = $("#btn-confirm-upload-signature");
  $inputRecognitionDate             = $("#input-recognition-date");
  $fileProfilePicture               = $("#file-profile-picture");
  $fileSignature                    = $("#file-signature");
  $selectMemberType                 = $("#select-member-type");
  $selectLoanProduct                = $("#select-loan-product");
  $selectSurvey                     = $("#select-survey");
  $btnResignFromInsurance           = $("#btn-resign-from-insurance");
  $btnConfirmInsuranceResign        = $("#btn-confirm-insurance-resign");
  $btnConfirmReinstatement          = $("#btn-confirm-reinstatement")
  $btnUploadProfilePicture          = $("#btn-upload-profile-picture");
  $btnConfirmUploadProfilePicture   = $("#btn-confirm-upload-profile-picture");
  $btnConfirmDeleteSignature        = $("#btn-confirm-delete-signature");
  $inputDateResigned                = $("#input-date-resigned");
  $inputReason                      = $("#input-reason");
  $inputReinstatementDate           = $("#input-reinstatement-date");
  $inputDateStopped                 = $("#input-date-stop");

  $btnConfirmClaimsCopy             = $("#btn-confirm-claims-copy");
  $inputDateOfDeath                 = $("#input-date-of-death");

  $btnConfirmRestructure        = $("#btn-confirm-restructure");
  $selectRestructureLoanProduct = $("#select-restructure-loan-product");

  $selectActiveLoans            = $("#select-active-loans").select2();
  $selectCoMakerB               = $("#select-co-maker-b").select2();

  $inputCoMakerA                = $("#input-co-maker-a");
  $inputPnNumber                = $("#input-pn-number");
  $inputClipNumber              = $("#input-clip-number");
  $inputDatePrepared            = $("#input-date-prepared");
  $selectTerm                   = $("#select-term");
  $selectModeOfPayment          = $("#select-mode-of-payment");
  $inputBeneficiaryFirstName    = $("#input-beneficiary-first-name");
  $inputBeneficiaryMiddleName   = $("#input-beneficiary-middle-name");
  $inputBeneficiaryLastName     = $("#input-beneficiary-last-name");
  $inputBeneficiaryDateOfBirth  = $("#input-beneficiary-date-of-birth");
  $inputBeneficiaryRelationship = $("#input-beneficiary-relationship");


  $btnRecomputeRestructure               = $("#btn-recompute-restructure");

  $btnErase                    = $(".btn-erase"); 
  $btnConfirmErase             = $("#btn-confirm-erase");
  
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();

  $inputMykoinsPassword             = $("#input-mykoins-password");
  $inputMykoinsPasswordConfirmation = $("#input-mykoins-password-confirmation");
  $btnSaveMykoinsPassword           = $("#btn-save-mykoins-password");
  
  $btnConfirmMakePayment  = $("#btn-confirm-make-payment-type")
  $selectMakePaymentType  = $("#select-make-payment-type")

  _changeTermOptions($selectModeOfPayment.val());
}

var _changeTermOptions  = function(modeOfPayment) {
  $selectTerm.empty();

  if(modeOfPayment == "weekly") {
    $selectTerm.append($("<option></option>").attr("value", 15).text(15));
    $selectTerm.append($("<option></option>").attr("value", 25).text(25));
    $selectTerm.append($("<option></option>").attr("value", 35).text(35));
    $selectTerm.append($("<option></option>").attr("value", 50).text(50));
    $selectTerm.append($("<option></option>").attr("value", 75).text(75));
  } else if(modeOfPayment == "monthly") {
    $selectTerm.append($("<option></option>").attr("value", 3).text(3));
    $selectTerm.append($("<option></option>").attr("value", 6).text(6));
    $selectTerm.append($("<option></option>").attr("value", 9).text(9));
    $selectTerm.append($("<option></option>").attr("value", 12).text(12));
  } else if(modeOfPayment == "semi-monthly") {
    $selectTerm.append($("<option></option>").attr("value", 6).text(6));
    $selectTerm.append($("<option></option>").attr("value", 12).text(12));
    $selectTerm.append($("<option></option>").attr("value", 18).text(18));
    $selectTerm.append($("<option></option>").attr("value", 24).text(24));
  }
}

var _bindEvents = function() {

  $btnConfirmMakePayment.on("click", function(){
    //alert(_memberId);
    var make_payment_type = $selectMakePaymentType.val()
    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }
    $.ajax({
      success: function() {
        $message.html("Success! Redirecting...");
        window.location.href = "/members/" + _memberId + "/form_make_payments/" + make_payment_type;
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
        } finally {
          console.log("errors:");
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmRegister.prop("disabled", false);
        }
      }
    });
  });

  $btnSaveMykoinsPassword.on("click", function() {
    var password              = $inputMykoinsPassword.val();
    var password_confirmation = $inputMykoinsPasswordConfirmation.val();
    var access_token          = $(this).data('access-token');

    $inputMykoinsPassword.prop("disabled", true);
    $inputMykoinsPasswordConfirmation.prop("disabled", true);
    $btnSaveMykoinsPassword.prop("disabled", true);

    $.ajax({
      url: _urlUpdateMykoinsPassword,
      method: 'POST',
      headers: {
        'X-KOINS-ACCESS-TOKEN': access_token
      },
      data: {
        password: password,
        password_confirmation: password_confirmation
      },
      success: function(response) {
        $inputMykoinsPassword.prop("disabled", false);
        $inputMykoinsPasswordConfirmation.prop("disabled", false);
        $btnSaveMykoinsPassword.prop("disabled", false);

        alert("Successfully changed password!");
        $inputMykoinsPassword.val("");
        $inputMykoinsPasswordConfirmation.val("");
      },
      error: function(response) {
        console.log(response);
        alert("Error in updating password!");

        $inputMykoinsPassword.prop("disabled", false);
        $inputMykoinsPasswordConfirmation.prop("disabled", false);
        $btnSaveMykoinsPassword.prop("disabled", false);
      }
    });
  });

  $selectModeOfPayment.on("change", function() {
    _changeTermOptions($(this).val());
  });

  $btnRecomputeRestructure.on("click", function() {
    $modalRecomputeRestructure.show();
  });

  $btnConfirmRecomputeRestructure.on("click", function(){
    
    $btnRecomputeRestructure.prop("disabled", true)
    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }
  
    $.ajax({
      url: _urlRecomputeRestructure ,
      method: "POST",
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href = "/loans/" + response.id;
      },

    });
  });

  $btnConfirmRestructure.on("click", function() {
    var activeLoanIds = $selectActiveLoans.val();
    var loanProductId = $selectRestructureLoanProduct.val();
    var coMaker       = $inputCoMakerA.val();
    var coMakerId     = $selectCoMakerB.val();
    var pnNumber      = $inputPnNumber.val();
    var clipNumber    = $inputClipNumber.val();
    var datePrepared  = $inputDatePrepared.val();
    var term          = $selectTerm.val();
    var modeOfPayment = $selectModeOfPayment.val();
    
    var beneficiaryFirstName    = $inputBeneficiaryFirstName.val();
    var beneficiaryMiddleName   = $inputBeneficiaryMiddleName.val();
    var beneficiaryLastName     = $inputBeneficiaryLastName.val();
    var beneficiaryDateOfBirth  = $inputBeneficiaryDateOfBirth.val();
    var beneficiaryRelationship = $inputBeneficiaryRelationship.val();

    $btnConfirmRestructure.prop("disabled", true);
    $selectRestructureLoanProduct.prop("disabled", true);
    $selectActiveLoans.prop("disabled", true);
    $inputCoMakerA.prop("disabled", true);
    $selectCoMakerB.prop("disabled", true);
    $inputPnNumber.prop("disabled", true);
    $inputClipNumber.prop("disabled", true);
    $inputDatePrepared.prop("disabled", true);
    $selectTerm.prop("disabled", true);
    $selectModeOfPayment.prop("disabled", true);
    $inputBeneficiaryFirstName.prop("disabled", true);
    $inputBeneficiaryMiddleName.prop("disabled", true);
    $inputBeneficiaryLastName.prop("disabled", true);
    $inputBeneficiaryDateOfBirth.prop("disabled", true);
    $inputBeneficiaryRelationship.prop("disabled", true);

    var data = {
      loan_product_id: loanProductId,
      co_maker: coMaker,
      co_maker_id: coMakerId,
      pn_number: pnNumber,
      clip_number: clipNumber,
      date_prepared: datePrepared,
      num_installments: term,
      term: modeOfPayment,
      active_loan_ids: activeLoanIds,
      member_id: _memberId,
      beneficiary_first_name: beneficiaryFirstName,
      beneficiary_middle_name: beneficiaryMiddleName,
      beneficiary_last_name: beneficiaryLastName,
      beneficiary_relationship: beneficiaryRelationship,
      beneficiary_date_of_birth: beneficiaryDateOfBirth,
      authenticity_token: _authenticityToken
    }

    $.ajax({
      url: _urlRestructure,
      method: "POST",
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href = "/loans/" + response.id;
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmRestructure.prop("disabled", false);
          $selectRestructureLoanProduct.prop("disabled", false);
          $selectActiveLoans.prop("disabled", false);
          $inputCoMakerA.prop("disabled", false);
          $selectCoMakerB.prop("disabled", false);
          $inputPnNumber.prop("disabled", false);
          $inputClipNumber.prop("disabled", false);
          $inputDatePrepared.prop("disabled", false);
          $selectTerm.prop("disabled", false);
          $selectModeOfPayment.prop("disabled", false);
          $inputBeneficiaryFirstName.prop("disabled", false);
          $inputBeneficiaryMiddleName.prop("disabled", false);
          $inputBeneficiaryLastName.prop("disabled", false);
          $inputBeneficiaryDateOfBirth.prop("disabled", false);
          $inputBeneficiaryRelationship.prop("disabled", false);
        }
      }
    });
  });
  
  $btnErase.on("click", function(){
    
    _loanId = $(this).data("id");
    $modalErase.show();
  });

  $btnConfirmErase.on("click", function(){
    $message.html("Loading...");
    $btnConfirmErase.prop("disabled", true);
    
      
      $.ajax({
        url: _urlEraseRecord,
        method: "POST",
        data: {
          id: _loanId
        },
        success: function(response) {
          $message.html("Success!");
          window.location.reload();
        }
      });
    
  });

  $btnRegister.on("click", function() {
    $message.html("");
    $modalRegister.show();
  });

  $btnConfirmRegister.on("click", function() {
    $message.html("Registering...");

    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }

    $btnConfirmRegister.prop("disabled", true);

    $.ajax({
      url: _urlRegister,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).errors.full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
        } finally {
          console.log("errors:");
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmRegister.prop("disabled", false);
        }
      }
    });
  });

  $btnDeleteSignature.on("click", function() {
    $message.html("");
    $modalDeleteSignature.show();
  });

  $btnConfirmDeleteSignature.on("click", function() {
    $message.html("Deleting...");

    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }

    $btnConfirmDeleteSignature.prop("disabled", true);

    $.ajax({
      url: _urlDeleteSignature,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmDeleteSignature.prop("disabled", false);
        }
      }
    });
  });

  $btnDeleteProfilePicture.on("click", function() {
    $message.html("");
    $modalDeleteProfilePicture.show();
  });

  $btnConfirmDeleteProfilePicture.on("click", function() {
    $message.html("Deleting...");

    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }

    $btnConfirmDeleteProfilePicture.prop("disabled", true);

    $.ajax({
      url: _urlDeleteProfilePicture,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmDeleteProfilePicture.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmUploadSignature.on("click", function() {
    $message.html("Uploading signature...");
    $btnConfirmUploadSignature.prop("disabled", true);

    var errors  = [];
    if($fileSignature[0].files.length == 0) {
      errors.push("Signature required");

      $message.html("Signature required...");
      $btnConfirmUploadSignature.prop("disabled", false);
    }

    if(errors.length == 0) {
      var formData  = new FormData();
      var files     = [];

      files.push({
        name: "SIGNATURE",
        file: $fileSignature[0].files[0]
      });

      for(var i = 0; i < files.length; i++) {
        formData.append("files[]", files[i].file);
        formData.append("file_types[]", files[i].name);

        formData.append("id", _memberId);

        $.ajax({
          url: _urlUploadSignature,
          method: 'POST',
          contentType: false,
          processData: false,
          data: formData,
          success: function(response) {
            $message.html("Success! Reloading...");
            window.location.reload();
          },
          error: function(response) {
            console.log(response);
            var errors  = [];
            try {
              errors  = JSON.parse(response.responseText).errors.full_messages;
            } catch(err) {
              errors  = ["Something went wrong"];
              console.log(err);
            } finally {
              console.log(errors);
              $message.html(
                Mustache.render(
                  templateErrorList,
                  { errors: errors }
                )
              );

              $btnConfirmUploadSignature.prop("disabled", false);
            }
          }
        });
      }
    }
  });

  $btnUploadProfilePicture.on("click", function() {
    $message.html("");
    $modalUploadProfilePicture.show();
  });

  $btnConfirmUploadProfilePicture.on("click", function() {
    $message.html("Uploading profile picture...");
    $btnConfirmUploadProfilePicture.prop("disabled", true);

    var errors  = [];

    if($fileProfilePicture[0].files.length == 0) {
      errors.push("Profile picture required");

      $message.html("Profile picture required...");
      $btnConfirmUploadProfilePicture.prop("disabled", false);
    }

    if(errors.length == 0) {
      var formData  = new FormData();
      var files     = [];

      files.push({
        name: "PROFILE_PICTURE",
        file: $fileProfilePicture[0].files[0]
      });

      for(var i = 0; i < files.length; i++) {
        formData.append("files[]", files[i].file);
        formData.append("file_types[]", files[i].name);

        formData.append("id", _memberId);

        $.ajax({
          url: _urlUploadProfilePicture,
          method: 'POST',
          contentType: false,
          processData: false,
          data: formData,
          success: function(response) {
            $message.html("Success! Reloading...");
            window.location.reload();
          },
          error: function(response) {
            console.log(response);
            var errors  = [];
            try {
              errors  = JSON.parse(response.responseText).full_messages;
            } catch(err) {
              errors  = ["Something went wrong"];
              console.log(err);
            } finally {
              console.log(errors);
              $message.html(
                Mustache.render(
                  templateErrorList,
                  { errors: errors }
                )
              );

              $btnConfirmUploadProfilePicture.prop("disabled", false);
            }
          }
        });
      }
    }
  });

  $btnConfirmChangeRecognitionDate.on("click", function() {
    $message.html("Changing member recognition date...");

    var data  = {
      id: _memberId,
      recognition_date: $inputRecognitionDate.val(),
      authenticity_token: _authenticityToken
    }

    $btnConfirmChangeRecognitionDate.prop("disabled", true);

    $.ajax({
      url: _urlChangeRecognitionDate,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmChangeRecognitionDate.prop("disabled", false);
        }
      }
    });
  });

  $btnChangeMemberType.on("click", function() {
    $message.html(""); 
    $modalChangeMemberType.show();
  });

  $btnConfirmChangeMemberType.on("click", function() {
    $message.html("Changing member type...");

    var data  = {
      id: _memberId,
      member_type: $selectMemberType.val(),
      authenticity_token: _authenticityToken
    }

    $btnConfirmChangeMemberType.prop("disabled", true);

    $.ajax({
      url: _urlChangeMemberType,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmChangeMemberType.prop("disabled", false);
        }
      }
    });
  });

  $btnGenerateMissingAccounts.on("click", function() {
    $message.html("Generating missing accounts...");

    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }

    $btnGenerateMissingAccounts.prop("disabled", true);

    $.ajax({
      url: _urlGenerateMissingAccounts,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnGenerateMissingAccounts.prop("disabled", false);
        }
      }
    });
  });

  $btnRestore.on("click", function() {
    $message.html("");
    $modalRestore.show();
  });

  $btnConfirmRestore.on("click", function() {
    $message.html("");

    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }

    $btnConfirmRestore.prop("disabled", true);

    $.ajax({
      url: _urlRestore,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmRestore.prop("disabled", false);
        }
      }
    });
  });

  $btnUnlock.on("click", function() {
    $message.html("");
    $modalUnlock.show();
  });

  $btnConfirmUnlock.on("click", function() {
    $message.html("");

    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }

    $btnConfirmUnlock.prop("disabled", true);

    $.ajax({
      url: _urlUnlock,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmUnlock.prop("disabled", false);
        }
      }
    });
  });

  $btnDelete.on("click", function() {
    console.log("hello");
    $message.html("");
    $modalDelete.show();
  });

  $btnConfirmDelete.on("click", function() {
    $message.html("");

    var data  = {
      id: _memberId,
      authenticity_token: _authenticityToken
    }

    $btnConfirmDelete.prop("disabled", true);

    $.ajax({
      url: _urlDelete,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/members";
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmDelete.prop("disabled", false);
        }
      }
    });
  });

  $btnCreateSurvey.on("click", function() {
    $message.html("");
    $modalCreateSurvey.show();
  });

  $btnConfirmCreateSurvey.on("click", function() {
    $message.html("");

    var data  = {
      member_id: _memberId,
      survey_id: $selectSurvey.val(),
      authenticity_token: _authenticityToken
    }

    $selectSurvey.prop("disabled", true);
    $btnConfirmCreateSurvey.prop("disabled", true);

    $.ajax({
      url: _urlCreateSurvey,
      method: 'POST',
      data: data,
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/members/" + _memberId + "/survey_answers/" + response.id + "/form";
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmCreateSurvey.prop("disabled", false);
          $selectSurvey.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmNewLoan.on("click", function() {
    var loanProductId = $selectLoanProduct.val();

    $selectLoanProduct.prop("disabled", true);
    $btnConfirmNewLoan.prop("disabled", true);

    $.ajax({
      url: _urlNewLoan,
      method: 'POST',
      data: {
        loan_product_id: loanProductId,
        member_id: _memberId,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href="/loans/" + response.id + "/form";
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmNewLoan.prop("disabled", false);
          $selectLoanProduct.prop("disabled", false);
        }
      }
    });
  });

  $btnConfirmSignature.on("click", function() {
    $btnConfirmSignature.prop("disabled", true);

    if(_signaturePad.isEmpty()) {
      alert("No signature detected");
      $btnConfirmSignature.prop("disabled", false);
    } else {
      $.ajax({
        url: _urlSaveSignature,
        method: "POST",
        data: {
          signature_data: _signaturePad.toDataURL(),
          id: _memberId,
          authenticity_token: _authenticityToken
        },
        success: function(response) {
          $message.html("Success! Reloading...");
          window.location.reload();
        },
        error: function(response) {
          alert("Error in saving signature");
          $btnConfirmSignature.prop("disabled", false);
        }
      });
    }
  });

  $btnResignFromInsurance.on("click", function() {
    $modalResignFromInsurance.show();

    $btnConfirmInsuranceResign.on("click", function() {
      $btnConfirmInsuranceResign.prop("disabled", true);
      //alert("hello");
        $.ajax({
        url: _urlResignFromInsurance,
        method: 'POST',
        dataType: 'json',
        data: { 
          member_id: _memberId,
          date_resigned: $inputDateResigned.val(),
          reason: $inputReason.val(),
          authenticity_token: _authenticityToken
        },
        success: function(response) {
          $message.html("Successfully resigned member");
          window.location.reload();
        },
        error: function(response) {
          $message.html("Error in generating access_token");
          $btnConfirmInsuranceResign.prop("disabled", false);
        }
      });

    });
  });

  $btnConfirmReinstatement.on("click", function() {
    $btnConfirmReinstatement.prop("disabled", true);
    $.ajax({
      url: _urlReinstatement,
      method: 'POST',
      dataType: 'json',
      data: { 
        member_id: _memberId,
        reinstatement_date: $inputReinstatementDate.val(),
        date_stop: $inputDateStopped.val(),
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Successfully reinstate member");
        window.location.reload();
      },
      error: function(response) {
        $message.html("Error in generating access_token");
        $btnConfirmReinstatement.prop("disabled", false);
      }
    });
  });
}

var init  = function({ memberId, authenticityToken }) {
  _memberId           = memberId
  _authenticityToken  = authenticityToken
  _cacheDom();
  _bindEvents();
}

export default { init: init };
