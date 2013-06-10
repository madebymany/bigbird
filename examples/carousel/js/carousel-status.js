;(function(global, $, BigBird) {
  'use strict';

  // Define the carousel status module.
  // It's responsibility is to display the current status
  // of the carousel at the current moment.

  // Extend the BigBird.Module to create our new module.
  global.CarouselStatus = BigBird.Module.extend({

    // Subscribe to the 'carousel status' event
    // Call the updateStatusMessage function when new data comes in
    subscriptions: {
      'carousel-status': 'updateStatusMessage'
    },

    // The element we're going to use to display our status message
    el: $('#status-message'),

    updateStatusMessage: function(status_message) {
      this.$el.text(status_message);
    }
  });

})(this, jQuery, BigBird);