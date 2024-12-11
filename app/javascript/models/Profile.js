import Mustache from "mustache";
import $ from "jquery";

var authenticityToken;
var $fileProfilePicture;
var $btnConfirmUpdate;

var $message;
var templateErrorList;

var _urlUpdateProfilePicture = "/api/v1/update_profile_picture";

var _cacheDom = function() {
  $fileProfilePicture   = $("#file-profile-picture");
  $btnConfirmUpdate     = $("#btn-confirm-update");
  $message              = $(".message");
  templateErrorList     = $("#template-error-list").html();
}

var _bindEvents = function() {
  $btnConfirmUpdate.on("click", () => {
    $message.html("");

    var errors = [];

    if($fileProfilePicture[0].files.length == 0) {
      errors.push("Profile picture required");

      $message.html("Profile picture required...");
    } else if(errors.length == 0) {
      var formData  = new FormData();

      formData.append("profile_picture", $fileProfilePicture[0].files[0]);

      $.ajax({
        url: _urlUpdateProfilePicture,
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function(response) {
          $message.html("Success! Reloading...");
          window.location.reload();
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

            $btnConfirmUpdate.prop("disabled", false);
          }
        }
      });

      $fileProfilePicture.prop("disabled", true);
      $btnConfirmUpdate.prop("disabled", true);
    } else {
      $fileProfilePicture.prop("disabled", false);
      $btnConfirmUpdate.prop("disabled", false);
    }
  });
}

var init  = function(config) {
  authenticityToken = config.authenticityToken;

  _cacheDom();
  _bindEvents();
};

export default { init: init };
