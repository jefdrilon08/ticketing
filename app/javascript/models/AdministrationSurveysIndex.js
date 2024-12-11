import Mustache from "mustache";
import $ from "jquery";

var $btnNew;
var $btnConfirmNew;
var $inputName;
var $modalNew;
var $message;

var templateErrorList;

var authenticityToken;

var urlNew  = "/api/v1/administration/surveys/save";

var _cacheDom = function() {
  $btnNew         = $("#btn-new");
  $btnConfirmNew  = $("#btn-confirm-new");
  $inputName      = $("#input-name");
  $modalNew       = $("#modal-new");

  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnNew.on("click", function() {
    $modalNew.show();
    $message.html("");
  });

  $btnConfirmNew.on("click", function() {
    var name  = $inputName.val();

    $btnConfirmNew.prop("disabled", true);
    $inputName.prop("disabled", true);

    $.ajax({
      url: urlNew,
      method: 'POST',
      data: {
        authenticity_token: authenticityToken,
        name: name
      },
      success: function(response) {
        $message.html("Success! Redirecting...");
        window.location.href = "/administration/surveys/" + response.id;
      },
      error: function(response) {
        console.log(response);
        var errors  = [];
        try {
          errors  = JSON.parse(response.responseText).full_messages;
        } catch(err) {
          errors  = ["Something went wrong"];
          console.log(err);
        } finally {
          console.log(errors);
          $message.html(
            Mustache.render(
              templateErrorList,
              { errors: errors }
            )
          );

          $btnConfirmNew.prop("disabled", false);
          $inputName.prop("disabled", false);
        }
      }
    });
  });
}

var init  = function(options) {
  authenticityToken = options.authenticityToken;

  _cacheDom();
  _bindEvents();
}

export default { init: init };
