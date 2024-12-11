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

var $inputBatchNumberOfDays;
var $selectBatchBranch;
var $inputDateInitializedCutOff;
var $batchStartDate;
var $batchEndDate;
var $batchAccruedType;


var $latitudeData;
var $longtitudeData;
var $btnApprove;
var $btnConfirmApprove;
var $modalApprove;

var $btnAdd;


var _centers  = [];
var _members  = [];
var _loans    = [];
var _loanIds  = [];

var _branchId;
var _centerId;
var _memberId;
var _moratoriumId;

var _urlCreate        = "/api/v1/members_project_types_controller/create";
var _urlDelete        = "/api/v1/members_project_types_controller/delete";
var _urlApprove        = "/api/v1/members_project_types_controller/approve";
var _urlProcess       =  "#" // "/api/v1/adjustments/moratoriums/process";
var _urlProcess       = "/api/v1/adjustments/accrued_interests/process";
var _urlBatchProcess  = "/api/v1/adjustments/accrued_interests/batch_process";
var _urlCenters       = "/api/v1/members_project_types_controller/fetch_project_type_category";
var _urlSave          = "/api/v1/members_project_types_controller/save";
var init  = function(options) {
  _authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
};

var _cacheDom = function() {

  $selectBranch                 = $("#select-project-type");
  $selectCenter                 = $("#select-project-type-category");
  $btnAdd                       = $("#btn-add");
  $selectMember                 = $("#select-member");
  $selectProcessCenter          = $("#select-process-center");
  $selectLoans                  = $("#select-loans");
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
  $inputCollectionDate      = $("#collection-date")
  templateErrorList = $("#template-error-list").html();

  $latitudeData =    $("#latitude-data");
  $longtitudeData =  $("#longtitude-data");
  $btnApprove = $("#btn-approve")
  $btnConfirmApprove = $("#btn-confirm-approve")
  
  $modalApprove = new bootstrap.Modal(
    document.getElementById("modal-approve")
  )

  $selectLoans.select2({
    allowClear: true,
    width: "auto",
    theme: "bootstrap"
  });
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


var _bindEvents = function() {
  
  $btnApprove.on("click", function(){
    $modalApprove.show();

  })


  $btnConfirmApprove.on("click", function(){
    
    _id = $(this).data("id")
  
    
    $.ajax({
      url: _urlApprove,
      method: "POST",
      data: {
        data_store_id: _id,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        alert("Successfully Approved")
        window.location.href="/data_stores/members_project_types/";
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
        }
      }
    });
  

  })


  $btnDelete.on("click", function(){
    
    _id = $(this).data("id")
    var data_index = $(this).data("data-index")
    $.ajax({
      url: _urlDelete,
      method: "POST",
      data: {
        data_store_id: _id  , 
        data_index: data_index,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
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
        }
      }
    });

  })


  $btnAdd.on("click", function(){
    
    _id = $(this).data("id");
    project_category = $selectBranch.val();
    project_type = $selectCenter.val()

    $.ajax({
      url: _urlSave,
      method: "POST",
      data: {
        data_store_id: _id  , 
        project_category_id: project_category,
        project_type_id: project_type,
        member_id: $selectMember.val(),
        latitude_data: $latitudeData.val(),
        longtitude_data: $longtitudeData.val(),
        authenticity_token: _authenticityToken
      },
      success: function(response) {
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
        }
      }
    });



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


  });

  $selectBranch.on("change", function() {
    //alert($selectBranch.val())
    $.ajax({
      method: 'GET',
      url: _urlCenters,
      data: {
        id: $selectBranch.val(),
        with_members: true
      },
      success: function(response) {
        _centers  = response.project_type_category;

        //if(_centers.length > 0) {
       //   _members  = _centers[0].members;
       // }

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


    

    $btnConfirmNew.prop("disabled", true);
    $selectBranch.prop("disabled", true);
    $selectCenter.prop("disabled", true);

    console.log(_loanIds);

    $message.html("Loading...");

    $.ajax({
      url: _urlCreate,
      method: "POST",
      data: {
        branch_id: _branchId,
        center_id: _centerId,
        authenticity_token: _authenticityToken
      },
      success: function(response) {
        $message.html(
          "Success! Redirecting..."
        );
        
        window.location.href="/data_stores/members_project_types/" + response.id;
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
