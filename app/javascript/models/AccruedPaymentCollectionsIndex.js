import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $btnNewTransaction;
var $btnConfirmNewTransaction;
var $modalNewTransaction;
var $modalDelete;
var $modalProcess;
var $modalBatchProcess;
var $selectBranch;
var $selectCenter;
var $selectMember;
var $selectProcessCenter;
var $selectLoans;
var $inputDateInitialized;
var $inputNumberOfDays;
var $inputReason;
var $btnDelete;
var $btnProcess;
var $btnBatchProcess;
var $btnConfirmDelete;
var $btnConfirmProcess;
var $btnConfirmBatchProcess;
var $message;
var templateErrorList;
var _authenticityToken;

var _centers  = [];
var _members  = [];
var _loans    = [];
var _loanIds  = [];

var _branchId;
var _centerId;
var _memberId;
var _moratoriumId;

var _urlCreate        = "/api/v1/accrued_payment_collections";
var _urlDelete        = "/api/v1/adjustments/moratoriums/delete";
var _urlProcess       = "/api/v1/adjustments/moratoriums/process";
var _urlBatchProcess  = "/api/v1/adjustments/moratoriums/batch_process";
var _urlCenters       = "/api/v1/branches/fetch_centers";
var _urlLoans         = "/api/v1/loans/fetch_by_member";

var init  = function(options) {
  _authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $modalNewTransaction = new bootstrap.Modal(
    document.getElementById("modal-new-transaction")
  );

  $selectBranch             = $("#select-branch");
  $selectCenter             = $("#select-center");
  $selectProcessCenter      = $("#select-process-center");
  $inputDateInitialized     = $("#input-date-initialized");
  $inputNumberOfDays        = $("#input-number-of-days");
  $inputReason              = $("#input-reason");
  $btnNewTransaction        = $("#btn-new-transaction");
  $btnConfirmNewTransaction = $("#btn-confirm-new-transaction");
  $btnConfirmDelete         = $("#btn-confirm-delete");
  $btnConfirmProcess        = $("#btn-confirm-process");
  $btnConfirmBatchProcess   = $("#btn-confirm-batch-process");
  $message                  = $(".message");

  templateErrorList = $("#template-error-list").html();
};

var _loadCenterOptions  = function() {
  $selectCenter.html("");

  if(_centers.length > 0) {
    _centerId = _centers[0].id;

    for(var i = 0; i < _centers.length; i++) {
      $selectCenter.append(new Option(_centers[i].name, _centers[i].id));
    }
  }
};

var _fetchLoans = function() {
  $.ajax({
    method: 'GET',
    url: _urlLoans,
    data: {
      member_id: _memberId
    },
    success: function(response) {
      _loans  = response.loans;
      console.log("Loans:");
      console.log(_loans);

      $selectLoans.val(null).trigger('change');
      $selectLoans.empty();

      _loans.forEach(function(o, i) {
        $selectLoans.append(
          new Option(
            o.loan_product.name,
            o.id,
            false,
            false
          )
        ).trigger('change');
      });
    },
    error: function(response) {
      console.log("Error in fetching loans.");
      console.log(response);
    }
  });
};

var _bindEvents = function() {
  $selectCenter.on("change", function() {
    _centerId = $selectCenter.val();
  });

  $selectBranch.on("change", function() {
    $.ajax({
      method: 'GET',
      url: _urlCenters,
      data: {
        id: $selectBranch.val(),
        with_members: true
      },
      success: function(response) {
        _centers  = response.centers;

        if(_centers.length > 0) {
          _members  = _centers[0].members;
        }

        _loadCenterOptions();
      },
      error: function(response) {
        console.log(response);
        alert("Error in fetching centers");
      }
    });
  });

  $btnNewTransaction.on("click", function() {
    $modalNewTransaction.show();
  });

  $btnConfirmNewTransaction.on("click", function() {
    _branchId           = $selectBranch.val();
    _centerId           = $selectCenter.val();

    $btnConfirmNewTransaction.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);
   
    $message.html("Loading...");

    $.ajax({
      url: _urlCreate,
      method: "POST",
      data: {
        branch_id: _branchId,
        center_id: _centerId,
        authenticity_token: _authenticityToken
      },
      success: function(resonse) {
        $message.html(
          "Success! Redirecting..."
        );

        window.location.reload();
      },
      error: function(response) {
        var errors  = [];

        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors = ["Something went wrong"];
        } finally {
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmNewTransaction.prop("disabled", false);
          $selectBranch.prop("disabled", false);
          $selectCenter.prop("disabled", false);
        }
      }
    });
  });
};

export default { init: init };
