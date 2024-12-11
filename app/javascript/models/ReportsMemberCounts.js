import Mustache from "mustache";
import $ from "jquery";

var $searchBtn;
var $downloadBtn;
var $data;
var $startDate;
var $endDate;
var $memberCountsSection;
var $memberCountsTemplate;
var $message;
var memberCountsUrl     = "/api/v1/reports/member_counts";

var _cacheDom = function() {
  $startDate            = $("#start-date");
  $endDate              = $("#end-date");
  $searchBtn            = $("#search-btn");
  $memberCountsSection  = $("#member-counts-section");
  $memberCountsTemplate = $("#member-counts-template").html();
  $message              = $(".message");
  $downloadBtn          = $("#download-btn");
}

var _loadDefaults = function() {
}

var _bindEvents = function() {
  $downloadBtn.on('click', function() {
    $downloadBtn.addClass('loading');

    var startDate  = $startDate.val();
    var endDate = $endDate.val();

    var params = {
      start_date: startDate,
      end_date: endDate
    };

    $.ajax({
      url: memberCountsUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $memberCountsSection.html(Mustache.render($memberCountsTemplate, data));
        
        $downloadBtn.removeClass('loading');

        tempUrl = data.download_url;
        window.open(tempUrl, '_blank');

        // Make sticky
        $(".sticky").stickyTableHeaders();
      },
      error: function(data) {
        $downloadBtn.removeClass('loading');
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
      url: memberCountsUrl,
      method: 'GET',
      dataType: 'json',
      data: params,
      success: function(data) {
        console.log(data);
        $memberCountsSection.html(Mustache.render($memberCountsTemplate, data));

        $memberCountsSection.find(".curr").each(function() {
          $(this).html(numberWithCommas($(this).html()));
        });

        $searchBtn.removeClass('loading');

        // Make sticky
        $(".sticky").stickyTableHeaders();
        $message.html(""); 
      },
      error: function(data) {
        $searchBtn.removeClass('loading');
        $message.html("Error!"); 
      }
    });

    // $message.html("");
  });
}

var init = function() {
  _cacheDom();
  _loadDefaults();
  _bindEvents();
}

export default { init: init };
