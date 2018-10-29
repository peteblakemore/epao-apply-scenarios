/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info("GOV.UK Prototype Kit - do not use for production");
}

$(document).ready(function() {
  window.GOVUKFrontend.initAll();

  $(".js-prerequisites, .js-no-results").hide();
  $("#standard-name").autocomplete({
    source: function(request, response) {
      $.getJSON("/public/javascripts/standards.json", function(data) {
        var array = $.map(data, function(standard) {
          const { value, name, requirements } = standard;
          return {
            value,
            name,
            requirements
          };
        });
        // Manually filter as we're not using a server to filter results
        response($.ui.autocomplete.filter(array, request.term));
        if ($.ui.autocomplete.filter(array, request.term).length === 0) {
          $(".js-no-results").show();
          $(".js-prerequisites, .js-choose-standard-button").hide();
        } else {
          $(".js-no-results").hide();
        }
      });
    },
    select: function(event, ui) {
      $(".js-standard-name").text(ui.item.name);
      $(".js-prerequisites ul").empty();
      if (ui.item.requirements) {
        ui.item.requirements.map(function(requirement, index) {
          $(".js-prerequisites ul").append("<li>" + requirement + "</li>");
        });
        $(".js-prerequisites, .js-choose-standard-button").show();
      } else {
        $(".js-prerequisites ul").empty();
        $(".js-prerequisites, .js-choose-standard-button").hide();
      }
      // Clear input on select.. if we do this
      // (or need to carry any other data accross) we'll need to user hidden form inputs
      // $(this).val('');
      // return false;
    }
  });
});

(function() {
  var PasswordToggler = function(element, field) {
    this.element = element;
    this.field = field;
    this.toggle();
  };

  PasswordToggler.prototype = {
    toggle: function() {
      var self = this;
      self.element.addEventListener(
        "change",
        function() {
          if (self.element.checked) {
            self.field.setAttribute("type", "text");
            self.element.labels[0].innerText = "Hide password";
          } else {
            self.field.setAttribute("type", "password");
            self.element.labels[0].innerText = "Show password";
          }
        },
        false
      );
    }
  };

  document.addEventListener("DOMContentLoaded", function() {
    var checkbox = document.querySelector("#show-password");
    var pwd = document.querySelector("#new-password");

    if (checkbox && pwd) {
      var toggler = new PasswordToggler(checkbox, pwd);
    }
  });
})();
