import Mustache from "mustache";
import $ from "jquery";
import * as bootstrap from "bootstrap";

var authenticityToken;
var $message;
var $btnNew;
var $btnConfirm;
var $selectBranch;
var $modalNew;

var _cacheDom = function() {
    $message = $(".message");
    $btnNew = $("#btn-new");
    $btnConfirm = $("#btn-confirm-new");
    $selectBranch = $("#branch-select");
    $modalNew = new bootstrap.Modal(document.getElementById("modal-new"));
};

var _bindEvents = function() {
    $btnNew.on("click", function() {
        $modalNew.show();
    });

    $btnConfirm.on("click", function() {
        var branchh = $selectBranch.val();
        var data = {
            branch_id: branchh,
            authenticity_token: authenticityToken
            
        };

        $.ajax({
            url: "/api/v1/data_stores/written_off_report/generate",
            method: 'POST',
            data: data,
            success: function(response) {
                window.location.reload();
            },
            error: function(response) {
                let errors = [];
                try {
                    errors = JSON.parse(response.responseText).full_messages;
                } catch (err) {
                    errors.push("Something went wrong");
                    console.log(response);
                }
                $message.html(
                    Mustache.render(
                        templateErrorList,
                        { errors: errors }
                    )
                );
            }
        });
    });
};

var init = function(config) {
    authenticityToken = config.authenticityToken;
    _cacheDom();
    _bindEvents();
};

export default { init: init };
