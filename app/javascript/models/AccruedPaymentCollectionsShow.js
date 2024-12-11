import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';
select2($);

var $modalDelete;
var $modalApproveTransaction;
var $modalProcess;
var $modalBatchProcess;
var $modalZeroOut;
var $selectBranch;
var $selectCenter;
var $selectMember;
var $selectProcessCenter;
var $selectLoans;
var $inputCollectionDate;
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

var $btnApprove;
var $btnZero;
var $btnConfirmZero;
var _id;

var $btnAddParticular;
var $inputParticular;
var $btnAddOr;
var $inputOrNumber;
var $btnAddAr;
var $inputArNumber;
var $btnAddBook;
var $inputBookType;

var $inputBatchNumberOfDays;
var $selectBatchBranch;
var $inputDateInitializedCutOff;
var $batchStartDate;
var $batchEndDate;
var $batchAccruedType;

var $labelMemberName;
var $labeMemberLoanName;


var _centers  = [];
var _members  = [];
var _loans    = [];
var _loanIds  = [];

var _branchId;
var _centerId;
var _memberId;
var _moratoriumId;

var _memberId;
var _memberAccountId;
var _dataStoreId;  
var _recordType;
var _loanAmount;

var _urlCreate        = "/api/v1/accrued_payment_collections/update_transaction";
var _urlDelete        = "/api/v1/accrued_payment_collections/delete";
var _urlProcess       =  "#" // "/api/v1/adjustments/moratoriums/process";
var _urlProcess       = "/api/v1/accrued_payment_collections/approve_transaction";
var _urlProcessZero   = "/api/v1/accrued_payment_collections/process_zero";
var _urlBatchProcess  = "/api/v1/adjustments/accrued_interests/batch_process";
var _urlCenters       = "/api/v1/branches/fetch_centers";
var _urlLoans         = "/api/v1/loans/fetch_by_member";
var _urlAddParticular = "/api/v1/accrued_payment_collections/add_particular";
var _urlAddOr     = "/api/v1/accrued_payment_collections/add_or";
var _urlAddAr     = "/api/v1/accrued_payment_collections/add_ar";
var _urlAddBookType     = "/api/v1/accrued_payment_collections/add_book_type";



var init  = function(options) {
  _authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $modalApproveTransaction = new bootstrap.Modal(
    document.getElementById("modal-approve-transaction")
  )

  $modalDelete = new bootstrap.Modal(
    document.getElementById("modal-delete")
  )

  $modalProcess = new bootstrap.Modal(
    document.getElementById("modal-update-transaction")
  )

  $modalZeroOut = new bootstrap.Modal(
    document.getElementById("modal-zero-out")
  )

  $selectBranch                 = $("#select-branch");
  $selectCenter                 = $("#select-center");
  $selectMember                 = $("#select-member");
  $selectProcessCenter          = $("#select-process-center");
  $selectLoans                  = $("#select-loans");
  $inputNumberOfDays            = $(".amount_details");
  $inputStartDate               = $("#bookId");
  $inputEndDate                 = $("#input-end-date");
  $inputNumberOfMoratoriumDays  = $("#input-number-of-moratorium-days");
  $selectAccruedType            = $("#select-accrued-type");
  $inputReason                  = $("#input-reason");
  $btnNew                       = $(".undo");
  $btnDelete                    = $("#btn-delete");
  $btnProcess                   = $(".btn-process");
  $btnBatchProcess              = $("#btn-batch-process");
  $btnConfirmNew                = $("#btn-confirm-approve");
  $btnConfirmDelete             = $("#btn-confirm-delete");
  $btnConfirmProcess            = $("#btn-confirm-process");
  $btnConfirmBatchProcess       = $("#btn-confirm-batch-process");
  $message                      = $(".message");

  $btnApprove			= $("#btn-approve");
  $btnZero			= $("#btn-zero");
  $btnConfirmZero		= $("#btn-confirm-zero");

  $btnAddParticular         = $("#btn-add-particular");
  $inputParticular          = $("#particular");
  $btnAddOr         = $("#btn-add-or");
  $inputOrNumber     = $("#or_number");
  
  $btnAddAr         = $("#btn-add-ar");
  $inputArNumber          = $("#ar_number");
  $btnAddBook         = $("#btn-add-book");
  $inputBookType          = $("#book_type");


  $labelMemberName = $("#memberName");
  $labeMemberLoanName = $("#memberLoanName");
 

  $inputBatchNumberOfDays       = $("#input-batch-number-of-moratorium-days");
  $selectBatchBranch       = $("#select-batch-branch");
  $inputDateInitializedCutOff = $("#input-date-initialized-cut-off");
  $batchStartDate             = $("#batch-input-start-date")
  $batchEndDate             = $("#batch-input-end-date")
  $batchAccruedType         = $("#select-batch-accrued-type")
  $inputCollectionDate      = $("#collection-date")
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

  $btnAddParticular.on("click", function() {
    var txtParticular = $inputParticular.val()
    _id = $(this).data("id");	  
    $.ajax({	    
      url: _urlAddParticular,
      method: "POST",
      data: {
	id: _id,
	txtParticular: txtParticular,
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

          $btnAddParticular.prop("disabled", false);
        }
      }
    });
  });

  $btnAddBook.on("click", function() {
   var txtBookType = $inputBookType.val()	  
   _id = $(this).data("id");	  
    $.ajax({	    
      url: _urlAddBookType,
      method: "POST",
      data: {
	id: _id,
	txtBookType:  txtBookType,
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

          $btnAddBook.prop("disabled", false);
        }
      }
    });
 
  });

  $btnProcess.on("click", function() {
    alert("jef")
    _moratoriumId = $(this).data("id");
    $modalProcess.show();
  });
  
  $btnAddOr.on("click", function() {
    var txtOr = $inputOrNumber.val()
    _id = $(this).data("id");	  
    $.ajax({	    
      url: _urlAddOr,
      method: "POST",
      data: {
	id: _id,
	txtOr: txtOr,
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

          $btnAddOr.prop("disabled", false);
        }
      }
    });
 
  });
  
  $btnAddAr.on("click", function() {
    var txtAr = $inputArNumber.val()
    _id = $(this).data("id");	  
    $.ajax({	    
      url: _urlAddAr,
      method: "POST",
      data: {
	id: _id,
	txtAr: txtAr,
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

          $btnAddAr.prop("disabled", false);
        }
      }
    });
 
  });



  $btnZero.on("click", function() {
     _id = $(this).data("id");
	  //alert(_id);
     $modalZeroOut.show();
  });
  $btnConfirmZero.on("click", function() {
    $message.html("Loading..."); 
    $btnConfirmZero.prop("disabled", true);

    $.ajax({
      url: _urlProcessZero,
      method: "POST",
      data: {
        id: _id,
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

          $btnConfirmZero.prop("disabled", false);
        }
      }
    });

  });
 
   
   $btnApprove.on("click", function() {
     _id = $(this).data("id");
	  //alert(_id);
    $modalApproveTransaction.show();
  });


  $btnConfirmProcess.on("click", function() {	  	  
    $message.html("Loading...");
    $btnConfirmProcess.prop("disabled", true);

    $.ajax({
      url: _urlProcess,
      method: "POST",
      data: {
        id: _id,
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
    _id = $(this).data("id");
    $modalDelete.show();
  });

  $btnConfirmDelete.on("click", function() {
    $message.html("Loading...");
    $btnConfirmDelete.prop("disabled", true);

    $.ajax({
      url: _urlDelete,
      method: "POST",
      data: {
        id: _id
      },
      success: function(response) {
        $message.html("Success!");
	      //window.location.reload();
	      window.location.href="/accrued_payment_collections"

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
  
	  var amount = $(this).data('amount')
	  var memberId = $(this).data('member-data-id') 
	  var memberName = $(this).data('member-account-name')
	  var memberAccountId = $(this).data('loan-data-id')
	  var dataStoreId = $(this).data('collection-id')     
	  //var recordType = $(this).data('record-type')
	  $inputStartDate.val(amount)
	  $labelMemberName.text(memberName)
    
	  //alert (amount);
    
    
	  _memberId          = memberId 
	  _memberAccountId   = memberAccountId
	  _dataStoreId       = dataStoreId
	  //_recordType        = recordType
	  //alert(_dataStoreId);
    $modalProcess.show();
  });

  $btnConfirmNew.on("click", function(e) {
    
     _loanAmount = $inputStartDate.val()
    
  

    _branchId           = $selectBranch.val();
    _centerId           = $selectCenter.val();

    var inputCollectionDate  = $inputCollectionDate.val();
    var numberOfDays    = $inputNumberOfDays.val();
    var reason          = $inputReason.val();
    var startDate       = $inputStartDate.val();
    var endDate         = $inputEndDate.val();
    var inputNumberOfMoratoriumDays =  $inputNumberOfMoratoriumDays.val();
    var selectAccruedType = $selectAccruedType.val();
	
    

    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);
	  //alert(_memberAccountId);
    console.log(_loanIds);
    $message.html("Loading...");

    $.ajax({
      url: _urlCreate,
      method: "POST",
      data: {
            member_id:          _memberId,
            member_account_id:  _memberAccountId,
            data_store_id:      _dataStoreId,
	      //record_type:        _recordType,
            loan_amount:        _loanAmount
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
          $inputReason.prop("disabled", false);
          $inputNumberOfDays.prop("disabled", false);
        }
      }
    });
  });
};

export default { init: init };
