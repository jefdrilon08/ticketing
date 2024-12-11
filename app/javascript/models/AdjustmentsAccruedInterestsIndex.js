import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';
select2($);

var $modalNew;
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
var $inputStartDate;
var $inputEndDate;
var $inputNumberOfMoratoriumDays;
var $selectAccruedType;
var $inputReason;
var $btnNew;
var $btnDelete;
var $btnProcess;
var $btnBatchProcess;
var $btnConfirmNew;
var $btnConfirmDelete;
var $btnConfirmProcess;
var $btnConfirmBatchProcess;
var $message;
var templateErrorList;
var _authenticityToken;

var $inputBatchNumberOfDays;
var $selectBatchBranch;
var $inputDateInitializedCutOff;
var $batchStartDate;
var $batchEndDate;
var $batchAccruedType;

var _centers  = [];
var _members  = [];
var _loans    = [];
var _loanIds  = [];

var _branchId;
var _centerId;
var _memberId;
var _moratoriumId;

var _urlCreate        = "/api/v1/adjustments/accrued_interests/create";
var _urlDelete        = "/api/v1/adjustments/accrued_interests/delete";
var _urlProcess       =  "#" // "/api/v1/adjustments/moratoriums/process";
var _urlProcess       = "/api/v1/adjustments/accrued_interests/process";
var _urlBatchProcess  = "/api/v1/adjustments/accrued_interests/batch_process";
var _urlCenters       = "/api/v1/branches/fetch_centers";
var _urlLoans         = "/api/v1/loans/fetch_by_member";

var init  = function(options) {
  _authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $modalNew = new bootstrap.Modal(
    document.getElementById("modal-new")
  );

  $modalDelete = new bootstrap.Modal(
    document.getElementById("modal-delete")
  );

  $modalProcess = new bootstrap.Modal(
    document.getElementById("modal-process")
  );

  $modalBatchProcess            = $("#modal-batch-process");
  $selectBranch                 = $("#select-branch");
  $selectCenter                 = $("#select-center");
  $selectMember                 = $("#select-member");
  $selectProcessCenter          = $("#select-process-center");
  $selectLoans                  = $("#select-loans");
  $inputDateInitialized         = $("#input-date-initialized");
  $inputNumberOfDays            = $("#input-number-of-days");
  $inputStartDate               = $("#input-start-date");
  $inputEndDate                 = $("#input-end-date");
  $inputNumberOfMoratoriumDays  = $("#input-number-of-moratorium-days");
  $selectAccruedType            = $("#select-accrued-type");
  $inputReason                  = $("#input-reason");
  $btnNew                       = $("#btn-new");
  $btnDelete                    = $(".btn-delete");
  $btnProcess                   = $(".btn-process");
  $btnBatchProcess              = $("#btn-batch-process");
  $btnConfirmNew                = $("#btn-confirm-new");
  $btnConfirmDelete             = $("#btn-confirm-delete");
  $btnConfirmProcess            = $("#btn-confirm-process");
  $btnConfirmBatchProcess       = $("#btn-confirm-batch-process");
  $message                      = $(".message");

  $inputBatchNumberOfDays       = $("#input-batch-number-of-moratorium-days");
  $selectBatchBranch       = $("#select-batch-branch");
  $inputDateInitializedCutOff = $("#input-date-initialized-cut-off");
  $batchStartDate             = $("#batch-input-start-date")
  $batchEndDate             = $("#batch-input-end-date")
  $batchAccruedType         = $("#select-batch-accrued-type")

  templateErrorList = $("#template-error-list").html();

  $selectLoans.select2({
    allowClear: true,
    width: "auto",
    theme: "bootstrap"
  });
};

var _loadCenterOptions  = function() {
  $selectCenter.html("");
  $selectMember.html("");

  if(_centers.length > 0) {
    _centerId = _centers[0].id;

    for(var i = 0; i < _centers.length; i++) {
      $selectCenter.append(new Option(_centers[i].name, _centers[i].id));
    }
  }

  if(_members.length > 0) {
    _memberId = _members[0].id;

    for(var i = 0; i < _members.length; i++) {
      $selectMember.append(new Option(_members[i].full_name, _members[i].id));
    }

    $selectMember.val(_memberId);

    _fetchLoans();
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
  $selectMember.on("change", function() {
    _memberId = $(this).val();

    _fetchLoans();
  });

  $btnBatchProcess.on("click", function() {
  
    $modalBatchProcess.show();
  });

  $btnConfirmBatchProcess.on("click", function() {
  
   var batchnumberOfDays    = $inputBatchNumberOfDays.val();
   var selectBatchBranch    = $selectBatchBranch.val();
   var inputDateInitializedCutOff =  $inputDateInitializedCutOff.val()
    
  var batchStartDate = $batchStartDate.val()       
  var batchEndDate = $batchEndDate.val()  
  var batchAccruedType = $batchAccruedType.val()

  
    $message.html("Loading...");
    $btnConfirmBatchProcess.prop("disabled", true);


    $.ajax({
      url: _urlBatchProcess,
      method: "POST",
      data: {
        branch_id:  selectBatchBranch,
        batchnumberOfDays: batchnumberOfDays,
        inputDateInitializedCutOff: inputDateInitializedCutOff,
        batchStartDate: batchStartDate,
        batchEndDate: batchEndDate,  
        batchAccruedType: batchAccruedType
    
      },
      success: function(response) {
        $message.html("Success!");
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

          $btnConfirmBatchProcess.prop("disabled", false);
        }
      }
    });
  });

  $btnProcess.on("click", function() {
    _moratoriumId = $(this).data("id");
    $modalProcess.show();
  });

  $btnConfirmProcess.on("click", function() {
    $message.html("Loading...");
    $btnConfirmProcess.prop("disabled", true);

    $.ajax({
      url: _urlProcess,
      method: "POST",
      data: {
        id: _moratoriumId,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Success!");
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

          $btnConfirmProcess.prop("disabled", false);
        }
      }
    });
  });

  $btnDelete.on("click", function() {
    _moratoriumId = $(this).data("id");
    $modalDelete.show();
  });

  $btnConfirmDelete.on("click", function() {
    $message.html("Loading...");
    $btnConfirmDelete.prop("disabled", true);

    $.ajax({
      url: _urlDelete,
      method: "POST",
      data: {
        id: _moratoriumId
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        alert("Error in deleting record!");
        $message.html("");
        $btnConfirmDelete.prop("disabled", false);
      }
    });
  });

  $selectCenter.on("change", function() {
    _centerId = $selectCenter.val();

    _members  = _centers.find(c => c.id === _centerId).members;

    $selectMember.html("");
    for(var i = 0; i < _members.length; i++) {
      $selectMember.append(new Option(_members[i].full_name, _members[i].id));
    }

    if(_members.length > 0) {
      _memberId = _members[i].id;

      _fetchLoans();
    }
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

  $btnNew.on("click", function() {
    $modalNew.show();
  });

  $btnConfirmNew.on("click", function() {
    _branchId           = $selectBranch.val();
    _centerId           = $selectCenter.val();
    _memberId           = $selectMember.val();
    _loanIds            = $selectLoans.val();

    var dateInitialized = $inputDateInitialized.val();
    var numberOfDays    = $inputNumberOfDays.val();
    var reason          = $inputReason.val();
    var startDate       = $inputStartDate.val();
    var endDate         = $inputEndDate.val();
    var inputNumberOfMoratoriumDays =  $inputNumberOfMoratoriumDays.val();
    var selectAccruedType = $selectAccruedType.val();

    

    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);
    $selectMember.prop("disabled", true);
    $selectLoans.prop("disabled", true);
    $inputDateInitialized.prop("disabled", true);
    $inputNumberOfDays.prop("disabled", true);
    $inputReason.prop("disabled", true);
    $inputStartDate.prop("disabled", true);
    $inputEndDate.prop("disabled", true);

    console.log(_loanIds);

    $message.html("Loading...");

    $.ajax({
      url: _urlCreate,
      method: "POST",
      data: {
        branch_id: _branchId,
        center_id: _centerId,
        member_id: _memberId,
        loan_ids: _loanIds,
        date_initialized: dateInitialized,
        number_of_days: numberOfDays,
        start_date: startDate,
        end_date: endDate,
        input_number_of_moratorium_days: inputNumberOfMoratoriumDays,
        select_accrued_type: selectAccruedType, 
        reason: reason,
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

          $btnConfirmNew.prop("disabled", false);
          $selectBranch.prop("disabled", false);
          $selectCenter.prop("disabled", false);
          $selectMember.prop("disabled", false);
          $selectLoans.prop("disabled", false);
          $inputDateInitialized.prop("disabled", false);
          $inputReason.prop("disabled", false);
          $inputNumberOfDays.prop("disabled", false);
        }
      }
    });
  });
};

export default { init: init };
