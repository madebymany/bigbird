!function(global, $, BigBird) {
  'use strict';

  // Super simple carousel module
  // Extend BigBird.Module to create our own Carousel module
  global.Carousel = BigBird.Module.extend({

    // The element to use. Thid could also be passed in on
    // instansiation of the Carousel like `new Carousel({ el: $(".slider") });`
    el: $('#slider'),

    // Setup our events, where the `'li'` is a child within the $el and
    // nextFrame refers to the function `this.nextFrame` on the object
    events: {
      "click li": "nextFrame"
    },

    // Proxied functions retain lexical scope, so the `'this'` object
    // will still refer to the current Carousel instance.
    proxied: ["animationEnd"],

    // Setup variables to use via `'this.variable_name'`
    status_event: 'carousel-status',
    current_index: 0,
    next_frame: 0,
    timing_delay: 2000,
    timer: null,

    // Our initialize function gets called when we create a new instance
    // of a `'Carousel'`.
    initialize: function() {
      this.$outer = this.$('.slidey-inner');
      this.$items = this.$outer.children();
      this.items_length = this.$items.length;
      this.items_width = (this.$items.eq(0).width() + 5);

      this.$items.css({ 'display': 'inline-block' });

      this.start();
    },

    start: function() {
      // Publish an event that our `'CarouselStatus'` will be listening for
      this.publish(this.status_event, "Carousel is ready");

      this.timer = window.setTimeout($.proxy(function(){
        this.animate(this.current_index + 1);
      }, this), this.timing_delay);
    },

    stop: function() {
      this.publish(this.status_event, "Carousel has stopped");

      window.clearTimeout(this.timer);
      this.timer = null;
    },

    animate: function(next_frame) {
      this.stop();
      this.next_frame = (next_frame < this.items_length - 1) ? next_frame : 0;

      this.publish(this.status_event, "Carousel is animating");

      this.$outer.animate(
        { 'margin-left': -(next_frame * this.items_width) + 'px' },
        300,
        this.animationEnd // Proxed animationEnd function
      );
    },

    // Our function we proxied earlier. Ensures that even when used
    // in a callback it will retain reference to `'this'`
    animationEnd: function() {
      this.current_index = this.next_frame;
      this.start();
    },

    // Called when an li is clicked. See the event binding at the top of the Carousel.
    nextFrame: function(e) {
      var item = $(e.target);

      this.publish(this.status_event, "Frame clicked");

      this.animate(this.current_index + 1);

      return false;
    }

  });

}(this, jQuery, BigBird);