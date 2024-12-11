import Mustache from "mustache";
import $ from "jquery";

var authenticityToken;
var $inputPassword;
var $inputPasswordConfirmation;
var $btnSave;

var $message;
var templateErrorList;

var _cacheDom = function() {
  $btnSave          = $("#btn-save");
  $message          = $(".message");
  templateErrorList = $("#template-error-list").html();
 
  $inputPassword              = $("#input-password");
  $inputPasswordConfirmation  = $("#input-password-confirmation");
};

var _bindEvents = function() {
  $btnSave.on("click", function() {
    var password              = $inputPassword.val();
    var passwordConfirmation  = $inputPasswordConfirmation.val();

    $btnSave.prop("disabled", true);
    $inputPassword.prop("disabled", true);
    $inputPasswordConfirmation.prop("disabled", true);

    $.ajax({
      url: "/api/v1/change_password",
      method: "POST",
      data: {
        authenticity_token: authenticityToken,
        password: password,
        password_confirmation: passwordConfirmation
      },
      success: function(response) {
        $message.html("Success!");
        window.location.href = "/";
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

          $btnSave.prop("disabled", false);
          $inputPassword.prop("disabled", false);
          $inputPasswordConfirmation.prop("disabled", false);
        }
      }
    });
  });
};

var init  = function(config) {
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
