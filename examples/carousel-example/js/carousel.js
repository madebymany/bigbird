var Carousel = BigBird.Module.extend({

  el: $('#slider'),

  events: {
    "click li": "nextFrame"
  },

  proxied: ["animationEnd"],

  status_event: 'carousel-status',
  current_index: 0,
  next_frame: 0,
  timing_delay: 2000,
  timer: null,

  initialize: function() {
    this.$outer = this.$('.slidey-inner');
    this.$items = this.$outer.children();
    this.items_length = this.$items.length;
    this.items_width = (this.$items.eq(0).width() + 5);

    this.$items.css({ 'display': 'inline-block' });

    this.start();
  },

  start: function() {
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
      this.animationEnd
    );
  },

  animationEnd: function() {
    this.current_index = this.next_frame;
    this.start();
  },

  nextFrame: function(e) {
    var item = $(e.target);

    this.publish(this.status_event, "Frame clicked");

    this.animate(this.current_index + 1);

    return false;
  }

});