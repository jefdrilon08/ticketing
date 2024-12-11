import Mustache from "mustache";
import $ from "jquery";

var $searchBtn;
var $downloadBtn;
var $memberReportsSection;
var $memberReportsTemplate;
var accountClass;
var $data;
var $startDate;
var $endDate;
var $memberQuarterlyReportsSection;
var $memberQuarterlyReportsTemplate;
var memberQuarterlyReportsUrl  = "/api/v1/reports/member_quarterly_reports";
var $message;

var _cacheDom = function() {
  $startDate                      = $("#start-date");
  $endDate                        = $("#end-date");
  $searchBtn                      = $("#search-btn");
  $downloadBtn                    = $("#download-btn");
  $memberQuarterlyReportsSection  = $("#member-quarterly-reports-section");
  $memberQuarterlyReportsTemplate = $("#member-quarterly-reports-template").html();

  $message                        = $(".message");
}

var _loadDefaults = function() {
}

var _bindEvents = function() {
  $downloadBtn.on('click', function() {
    $downloadBtn.addClass('loading');
    $message.html("Loading...");

    var startDate  = $startDate.val();
    var endDate = $endDate.val();

    var params = {
      start_date: startDate,
      end_date: endDate
    };

    $.ajax({
      url: memberQuarterlyReportsUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $message.html("Success!");
        $memberQuarterlyReportsSection.html(Mustache.render($memberQuarterlyReportsTemplate, data));
        
        $downloadBtn.removeClass('loading');

        tempUrl = data.download_url;
        window.open(tempUrl, '_blank');

        // Make sticky
        // $(".sticky").stickyTableHeaders();
      },
      error: function(data) {
        $downloadBtn.removeClass('loading');
        $message.html("Error!");
      }
    });
  });

  $searchBtn.on('click', function() {
    $searchBtn.addClass('loading');
    $message.html("Loading...");  
    
    var startDate  = $startDate.val();
    var endDate = $endDate.val();

    var params = {
      start_date: startDate,
      end_date: endDate
    };

    $.ajax({
      url: memberQuarterlyReportsUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $message.html("Success!");
        $memberQuarterlyReportsSection.html(Mustache.render($memberQuarterlyReportsTemplate, data));

        $memberQuarterlyReportsSection.find(".curr").each(function() {
          $(this).html(numberWithCommas($(this).html()));
        });

        $searchBtn.removeClass('loading');

        // Make sticky
        // $(".sticky").stickyTableHeaders();
      },
      error: function(data) {
        $searchBtn.removeClass('loading');
        $message.html("Error!");
      }
    });
  });
}

var init = function() {
  _cacheDom();
  _loadDefaults();
  _bindEvents();
}

export default { init: init };
