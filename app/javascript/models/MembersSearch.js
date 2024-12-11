import Mustache from 'mustache';
import $ from "jquery";
import * as bootstrap from "bootstrap";

var $inputQ;
var $results;

var q       = "";
var results = [];
var templateMemberList;

var _urlSearch = "/api/v1/members/search";

var _cacheDom = function() {
  $inputQ   = $("#input-q");
  $results  = $("#results");

  templateMemberList = $("#template-member-list").html();
};

var _bindEvents = function() {
  $inputQ.on("keyup", function() {

    q = $inputQ.val();
    console.log("Search: " + q);

    if(q) {
      $.ajax({
        method: "GET",
        url: _urlSearch,
        data: {
          q: q
        },
        success: function(response) {
          console.log(response);
          $inputQ.focus();

          if(response.members.length > 0) {
            $results.html(
              Mustache.render(
                templateMemberList,
                { members: response.members }
              )
            );
          } else {
            $results.html(
              "No results found"
            )
          }
        },
        error: function(response) {
          console.log("Error in searching");
          $inputQ.focus();
        }
      });
    } else {
      $results.html(
        "No results found"
      );
    }
  });
};

var init = function(options) {
  _cacheDom();
  _bindEvents();
};

export default { init: init }
