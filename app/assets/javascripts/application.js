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
        $.ui.autocomplete.filter(array, request.term).length === 0
          ? $(".js-no-results").show()
          : $(".js-no-results").hide();
      });
    },
    select: function(event, ui) {
      $(".js-standard-name").text(ui.item.name);
      $(".js-prerequisites ul").empty();
      if (ui.item.requirements) {
        ui.item.requirements.map(function(requirement, index) {
          $(".js-prerequisites ul").append("<li>" + requirement + "</li>");
        });
        $(".js-prerequisites").show();
      } else {
        $(".js-prerequisites ul").empty();
        $(".js-prerequisites").hide();
      }
      // Clear input on select.. if we do this
      // (or need to carry any other data accross) we'll need to user hidden form inputs
      // $(this).val('');
      // return false;
    }
  });
});
