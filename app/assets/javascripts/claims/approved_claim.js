//= require jquery

var approvedClaim = (function() {

  var urlClaims               = "/api/v1/claims/approved";
  var $parameters;
  var id;
  var authenticityToken       = $("meta[name='csrf-token']").attr('content');
  var $errorsTemplate;

  var _cacheDom = function() {
    $approvedButton             = $("#approved-button");
    $parameters                 = $("#parameters");
    id                          = $parameters.data("id");

    $message                    = $(".message");
    $errorsTemplate             = $("#errors-template").html();
 }

  var _bindEvents = function() {
    $approvedButton.on('click', function(){
      var data = {
          id: id,
          authenticity_token: authenticityToken,
        }

      $.ajax({
          url: urlClaims,
          method: 'POST',
          data: data,
          success: function(responseContent) {
            $message.html("Success! Redirecting...");
            window.location.reload();
            window.location.href = "/claims/" + id;
          },
          error: function(responseContent) {
            console.log(responseContent);
            var  errors  = JSON.parse(responseContent.responseText).errors;
            console.log(errors);
            console.log(data);
            $message.html(
                Mustache.render(
                  $errorsTemplate,
                  { errors: errors }
                )
              );
          }
      });
     });

 
  }

  var init = function() {
    _cacheDom();
    _bindEvents();
  }

  return {
    init: init
  };
})();

$(document).ready(function() {
  approvedClaim.init();
});
