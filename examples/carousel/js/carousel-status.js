var CarouselStatus = BigBird.Module.extend({

  subscriptions: {
    'carousel-status': 'updateStatusMessage'
  },

  el: $('#status-message'),

  updateStatusMessage: function(e, status_message) {
    this.$el.text(status_message);
  }
  
});