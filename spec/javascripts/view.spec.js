describe("BigBird.View", function() {

  it("should set the element, both as a jquery object and a plain dom object", function(){
    var element = $("<div id='el'></div>");

    var v = BigBird.View.extend({
      el: element
    });

    v = new v();

    expect(v.$el).toBe(jQuery);
    expect(v.el[0]).not.toBeNull();
    expect(v.$el.attr('id')).toEqual(v.el.id);
  });

  it("should allow me to bind events to functions and have them executed when being called", function(){
    var element = $("<div id='el'><a href='#' class='btn'></a></div>");

    var v = BigBird.View.extend({
      el: element,
      i: 0,
      events: { "click": "test", "click .btn": "testBtn" },
      test: function() { this.i = 1; },
      testBtn: function() { this.i = 2; return false; }
    });

    v = new v();

    expect(v.i).toBe(0);

    element.click();
    expect(v.i).toBe(1);

    element.find('.btn').click();
    expect(v.i).toBe(2);

  });

  it("should should set any options as variables on the view object", function(){
    var element = $("<div id='el'></div>");

    var v = BigBird.View.extend({ el: element });
    v = new v({ test: true });

    expect(v.test).toBe(true);
  });

  it("should allow me to set and call custom functions on the view", function(){
    var v = BigBird.View.extend({
      i: 0,
      test: function() { this.i = 1; }
    });
    v = new v();

    expect(v.i).toBe(0);
    v.test();

    expect(v.i).toBe(1);
  });

  it("should subscribe to events when a subscriptions array is passed", function(){
    var v = BigBird.View.extend({
      i: 0,
      subscriptions: { "/test" : "runTest" },
      runTest: function() {
        this.i = 1;
      }
    });

    v = new v();

    expect(v.i).toBe(0);

    // Publish event
    $.publish("/test");
    expect(v.i).toBe(1);
  });

});