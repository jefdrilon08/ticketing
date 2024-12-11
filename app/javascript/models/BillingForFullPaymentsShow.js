import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";
import select2 from 'select2';
select2($);

var $modalDelete;
var $modalProcess;
var $modalBatchProcess;
var $modalRemovePayment;

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
var $btnAdd;
var $btnRemove;
var $btnConfirmRemove;

var $btnAddParticular;
var $inputParticular;
var $btnAddOr;
var $inputOrNumber;
var $btnAddAr;
var $inputArNumber;
var $selectBook;

var $message;
var templateErrorList;
var _authenticityToken;

var $inputBatchNumberOfDays;
var $selectBatchBranch;
var $inputDateInitializedCutOff;
var $batchStartDate;
var $batchEndDate;
var $batchAccruedType;

var $btnApproved;
var $modalApproved;
var $btnConfirmApproved;

var $btnChecked;
var $modalCheck;
var $btnConfirmCheck;

var $labelMemberName;
var $labeMemberLoanName;
var $labelMemberLoanProduct;
var $labelMemberLoanAmount;
 
var $btnSelectBook;

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
var _loanProductId;
var _loanId;


var _urlCreate        = "/api/v1/billing_for_full_payments/update_amount";
var _urlDelete        = "/api/v1/adjustments/accrued_interests/delete";
var _urlProcess       =  "#" // "/api/v1/adjustments/moratoriums/process";
var _urlProcess       = "/api/v1/adjustments/accrued_interests/process";
var _urlBatchProcess  = "/api/v1/adjustments/accrued_interests/batch_process";
var _urlCenters       = "/api/v1/branches/fetch_centers";
var _urlLoans         = "/api/v1/loans/fetch_by_member";
var _urlAddMember     = "/api/v1/billing_for_full_payments/add_member";
var _urlRemovePayment = "/api/v1/billing_for_full_payments/remove_payment_member";
var _urlAddParticular = "/api/v1/billing_for_full_payments/add_particular";
var _urlAddOr         = "/api/v1/billing_for_full_payments/add_or";
var _urlAddAr         = "/api/v1/billing_for_full_payments/add_ar";
var _urlApproved      = "/api/v1/billing_for_full_payments/approved";
var _urlChecked       = "/api/v1/billing_for_full_payments/checked";
var _urlUpdateBook    = "/api/v1/billing_for_full_payments/update_book";

var init  = function(options) {
  _authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {
  $modalProcess = new bootstrap.Modal(
    document.getElementById("modal-change-payment")
  );

  $modalRemovePayment = new bootstrap.Modal(
    document.getElementById("modal-remove-payment")
  );

  $modalCheck = new bootstrap.Modal(
    document.getElementById("modal-check")
  );

  $modalApproved = new bootstrap.Modal(
    document.getElementById("modal-approve")
  );

  $selectBranch                 = $("#select-branch");
  $selectCenter                 = $("#select-center");
  $selectProcessCenter          = $("#select-process-center");
  $inputNumberOfDays            = $(".amount_details");
  $inputStartDate               = $("#bookId");
  $inputEndDate                 = $("#input-end-date");
  $inputNumberOfMoratoriumDays  = $("#input-number-of-moratorium-days");
  $selectAccruedType            = $("#select-accrued-type");
  $inputReason                  = $("#input-reason");
  $btnNew                       = $(".undo");
  $btnRemove                    = $(".remove_amount");
  $btnDelete                    = $(".btn-delete");
  $btnProcess                   = $(".btn-process");
  $btnBatchProcess              = $("#btn-batch-process");
  $btnConfirmNew                = $("#btn-confirm-approve");
  $btnConfirmDelete             = $("#btn-confirm-delete");
  $btnConfirmProcess            = $("#btn-confirm-process");
  $btnConfirmBatchProcess       = $("#btn-confirm-batch-process");
  $message                      = $(".message");

  $inputBatchNumberOfDays       = $("#input-batch-number-of-moratorium-days");
  $selectBatchBranch            = $("#select-batch-branch");
  $inputDateInitializedCutOff   = $("#input-date-initialized-cut-off");
  $batchStartDate               = $("#batch-input-start-date");
  $batchEndDate                 = $("#batch-input-end-date");
  $batchAccruedType             = $("#select-batch-accrued-type");
  $inputCollectionDate          = $("#collection-date");
  $btnAdd                       = $("#btn-add");
  $selectMember                 = $("#select-member");
  $selectLoans                  = $("#select-loans");
  $btnConfirmRemove             = $("#btn-confirm-remove");

  $btnAddParticular         = $("#btn-add-particular");
  $inputParticular          = $("#particular");

  $btnAddOr         = $("#btn-add-or");
  $inputOrNumber          = $("#or_number");
  
  $btnAddAr         = $("#btn-add-ar");
  $inputArNumber          = $("#ar_number");

  $btnApproved      = $("#btn-approved")
  $btnConfirmApproved = $("#btn-confirm-approved")


  $btnChecked = $("#btn-checked");
  $btnConfirmCheck = $("#btn-confirm-check");


  $labelMemberName = $("#memberName");
  $labeMemberLoanName = $("#memberLoanName");
  $labelMemberLoanProduct = $("#memberLoanProduct");
  $labelMemberLoanAmount = $("#memberLoanAmount")
  
  $selectBook = $("#book_type");
  $btnSelectBook  = $("#btn-add-book");


  templateErrorList = $("#template-error-list").html();

  $selectLoans.select2({
    width: "auto",
    theme: "bootstrap-5"
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


var _bindEvents = function() {
  $selectMember.on("change", function() {
    _memberId = $(this).val();

    //_fetchLoans();
  });
 
  
  $btnSelectBook.on("click", function(){
    _dataStoreId = $(this).data("id");
    var new_book = $selectBook.val()
    $.ajax({
      url: _urlUpdateBook,
      method: "POST",
      data: {
        dataStoreid: _dataStoreId,
        selectBook: new_book
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        alert("Error in changing book!");
        $message.html("");
        $btnConfirmDelete.prop("disabled", false);
      }
    });
    //_urlUpdateBook
    //alert($selectBook.val())

  });



  $btnChecked.on("click", function() {
    
    _dataStoreId = $(this).data("data-store-id");
  
    $modalCheck.show();
  });


  $btnConfirmCheck.on("click", function() { //add or
  
    
    var dataStoreId = _dataStoreId    
  
    
    $.ajax({
      url: _urlChecked,
      method: "POST",
      data: {
        dataStoreid: dataStoreId
      },
      success: function(response) {
        $message.html("Success!");
        
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        alert("Error in adding particular!");
        $message.html("");
        $btnConfirmDelete.prop("disabled", false);
      }
    });
  });


  $btnApproved.on("click", function() {
    
    _dataStoreId = $(this).data("data-store-id");
  
    $modalApproved.show();
  });


  $btnConfirmApproved.on("click", function() { //add or
  
    //var dataStoreId = $(this).data('data-store-id')     
    
    
    $.ajax({
      url: _urlApproved,
      method: "POST",
      data: {
        dataStoreid: _dataStoreId
      },
      success: function(response) {
        $message.html("Processing!");
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



  $btnAddAr.on("click", function() { //add or
  
    
    var dataStoreId = $(this).data('data-store-id')     
    var txtAr = $inputArNumber.val()
    
    $.ajax({
      url: _urlAddAr,
      method: "POST",
      data: {
        dataStoreid: dataStoreId,
        txtAr: txtAr
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        alert("Error in adding particular!");
        $message.html("");
        $btnConfirmDelete.prop("disabled", false);
      }
    });
  });
  $btnAddOr.on("click", function() { //add or
  
    
    var dataStoreId = $(this).data('data-store-id')     
    var txtOr = $inputOrNumber.val()
  
    $.ajax({
      url: _urlAddOr,
      method: "POST",
      data: {
        dataStoreid: dataStoreId,
        txtOr: txtOr
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        alert("Error in adding particular!");
        $message.html("");
        $btnConfirmDelete.prop("disabled", false);
      }
    });
  });


  $btnAddParticular.on("click", function() { //add particular
  

    var dataStoreId = $(this).data('data-store-id')     
    var txtParticular = $inputParticular.val()
    $.ajax({
      url: _urlAddParticular,
      method: "POST",
      data: {
        dataStoreid: dataStoreId,
        txtParticular: txtParticular
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        console.log(response);
        alert("Error in adding particular!");
        $message.html("");
        $btnConfirmDelete.prop("disabled", false);
      }
    });
  });


  $btnAdd.on("click", function(){
    
    var member_id = $selectMember.val();
    var member_loan_id = $selectLoans.val();
    var dataStoreId = $(this).data('data-store-id')     

    //alert(dataStoreId)
    $.ajax({

      url: _urlAddMember,
      method: "POST",
      data: {
        member_id:          member_id,
        member_loan_id:     member_loan_id,
        data_store_id:      dataStoreId,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html("Success!");
        window.location.reload();
      },
      error: function(response) {
        
        var errors  = [];
        alert(JSON.parse(response.responseText).full_messages)
      
      }
    });
  });


//  $btnAddParticular.on("click", function() {
//    alert( $inputParticular.val())
  
//  });


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
    alert("jef")
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


  $btnConfirmRemove.on("click", function() {
  
    
    
    var loanProductId   = _loanProductId
    var memberId        = _memberId
    var memberAccountId = _memberAccountId
    var dataStoreId     = _dataStoreId   
    var loanId          = _loanId
    
    
    $.ajax({
      url: _urlRemovePayment,
      method: "POST",
      data: {
        id: _moratoriumId,
        loanProductId:    loanProductId,
        memberId:         memberId,
        memberAccountId:  memberAccountId,
        dataStoreId:      dataStoreId,
        loanId:          loanId
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
  



  $btnRemove.on("click", function(){
  
    var amount = $(this).data('amount')
    var loanProductId = $(this).data('loan-id')
    var memberId = $(this).data('member-id') 
    var memberAccountId = $(this).data('member-account-id')
    var dataStoreId = $(this).data('data-store-id')     
    var recordType = $(this).data('record-type')
    var loanId = $(this).data('loan-product-id')
    var loanProductName = $(this).data('loan-product-name')
    var memberAccountName = $(this).data('member-account-name')    
    $labeMemberLoanName.text(memberAccountName)
    $labelMemberLoanProduct.text(loanProductName)
    $labelMemberLoanAmount.text(amount)
    
    $inputStartDate.val(amount)
    
    
    


     _memberId          = memberId 
     _memberAccountId   = memberAccountId
     _dataStoreId       = dataStoreId
     _recordType        = recordType
     _loanProductId     = loanProductId
     _loanId            = loanId
    
  

    $modalRemovePayment.show();

  });


  $btnNew.on("click", function() {
  
    var amount = $(this).data('amount')
    var memberId = $(this).data('member-id') 
    var memberName = $(this).data('member-account-name') 
    var memberAccountId = $(this).data('member-account-id')
    var dataStoreId = $(this).data('data-store-id')     
    var recordType = $(this).data('record-type')
    $inputStartDate.val(amount)
    $labelMemberName.text(memberName)
    
    
     _memberId          = memberId 
     _memberAccountId   = memberAccountId
     _dataStoreId       = dataStoreId
     _recordType        = recordType
   


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

    console.log(_loanIds);

    $message.html("Loading...");

    $.ajax({
      url: _urlCreate,
      method: "POST",
      data: {
            member_id:          _memberId,
            member_account_id:  _memberAccountId,
            data_store_id:      _dataStoreId,
            record_type:        _recordType,
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
