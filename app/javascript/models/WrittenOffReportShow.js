import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;
var $message;


var _cacheDom = function() {
    $search_name = $("#search-name");
    $btnSearch = $("#search-button");
};

var _bindEvents = function() {
    $btnSearch.on("click", function() {
        var name = $search_name.val()
        _id = $(this).data("id")
        var data = {
            name: name,
            data_store_id: _id,
            authenticity_token: authenticityToken
        }
    });
};

var init = function(config) {
    authenticityToken = config.authenticityToken;
    _cacheDom();
    _bindEvents();
};

export default { init: init };
