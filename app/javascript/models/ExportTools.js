import Mustsache from "mustache";
import $ from "jquery";

var $branch;
var $startDate;
var $endDate;
var $btnDownloadMember;
var $btnDownloadBeneficiary;
var $btnDownloadDependent;
var $btnDownloadMemberAccount;
var $btnDownloadAccountTransaction;
var $btnDownloadMemberPerBranch;
var $btnDownloadMembersWithBenefeciaries;

var urlExportMember                   = "/exports/members";
var urlExportBeneficiary              = "/exports/beneficiaries";
var urlExportLegalDependent           = "/exports/legal_dependents";
var urlExportMemberAccount            = "/exports/member_accounts";
var urlExportAccountTransaction       = "/exports/account_transactions";
var urlExportMemberPerBranch          = "/exports/members_per_branch_excel";
var urlExportMembersWithBeneficiaries = "/exports/members_with_beneficiaries_excel";

var encodeQueryData = function(data) {
  var ret = []
  for(var d in data) {
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  }

  return ret.join("&");
};

var _cacheDom = function() {
  $branch = $("#select-branch");
  $startDate = $("#filter-start-date");
  $endDate = $("#filter-end-date");
  $btnDownloadMember  = $("#export-member-segment-csv").find(".btn-download-members-csv");
  $btnDownloadBeneficiary  = $("#export-member-segment-csv").find(".btn-download-beneficiaries-csv");
  $btnDownloadDependent  = $("#export-member-segment-csv").find(".btn-download-dependents-csv");
  $btnDownloadMemberAccount  = $("#export-transaction-segment-csv").find(".btn-download-member-accounts-csv");
  $btnDownloadAccountTransaction  = $("#export-transaction-segment-csv").find(".btn-download-account-transactions-csv");
  $btnDownloadMemberPerBranch = $("#export-member-per-branch-segment").find(".btn-download-member-per-branch");
  $btnDownloadMembersWithBenefeciaries = $("#export-members-with-beneficiaries-segment").find(".btn-download-members-with-beneficiaries");
};

var init  = function() {
  _cacheDom();

  $btnDownloadMembersWithBenefeciaries.on('click', function() {
    var params    = {
      start_date:  $startDate.val(),
      end_date:  $endDate.val(),
      branch: $branch.val()
    }

    window.location = urlExportMembersWithBeneficiaries + "?" + encodeQueryData(params);
  });

  $btnDownloadMemberPerBranch.on('click', function() {      
    var params    = {
      start_date:  $startDate.val(),
      end_date:  $endDate.val(),
      branch_id: $branch.val()
    }

    window.location = urlExportMemberPerBranch + "?" + encodeQueryData(params);
  });

  $btnDownloadBeneficiary.on('click', function() {
    var params    = {
      start_date:  $startDate.val(),
      end_date:  $endDate.val(),
      branch: $branch.val()
    }

    window.location = urlExportBeneficiary + "?" + encodeQueryData(params);
  });

  $btnDownloadDependent.on('click', function() {
    var params    = {
      start_date:  $startDate.val(),
      end_date:  $endDate.val(),
      branch: $branch.val()
    }

    window.location = urlExportLegalDependent + "?" + encodeQueryData(params);
  });


  $btnDownloadMemberAccount.on('click', function() {
    var params    = {
      start_date:  $startDate.val(),
      end_date:  $endDate.val(),
      branch: $branch.val()
    }

    window.location = urlExportMemberAccount + "?" + encodeQueryData(params);
  });


  $btnDownloadAccountTransaction.on('click', function() {
    var params    = {
      start_date:  $startDate.val(),
      end_date:  $endDate.val(),
      branch: $branch.val()
    }

    window.location = urlExportAccountTransaction + "?" + encodeQueryData(params);
  });

  $btnDownloadMember.on('click', function() {
    var params    = {
      start_date:  $startDate.val(),
      end_date:  $endDate.val(),
      branch: $branch.val()
    }

    window.location = urlExportMember + "?" + encodeQueryData(params);
  });

};

export default { init: init };
