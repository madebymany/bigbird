describe("BigBird.Controller", function() {
  
  it("should set the element, both as a jquery object and a plain dom object", function(){
    var element = $("<div id='el'></div>");

    var c = BigBird.Controller.extend({
      el: element
    });

    c = new c();

    expect(c.$el).toBe(jQuery);
    expect(c.el[0]).not.toBeNull();
    expect(c.$el.attr('id')).toEqual(c.el.id);
  });

  it("should should set any options as variables on the controller object", function(){
    var element = $("<div id='el'></div>");

    var c = BigBird.Controller.extend({ el: element });
    c = new c({ test: true });

    expect(c.test).toBe(true);
  });

  it("should allow me to set and call custom functions on the controller", function(){
    var c = BigBird.Controller.extend({
      i: 0,
      test: function() { this.i = 1; }
    });
    c = new c();

    expect(c.i).toBe(0);
    c.test();

    expect(c.i).toBe(1);
  });

  it("should subscribe to events when a subscriptions array is passed", function(){
    var c = BigBird.Controller.extend({
      i: 0,
      subscriptions: { "/test" : "runTest" },
      runTest: function() {
        this.i = 1;
      }
    });

    c = new c();

    expect(c.i).toBe(0);

    // Publish event
    $.publish("/test");
    expect(c.i).toBe(1);
  });

  it("should all me to proxy functions to retain the controller scope", function(){
    var element = $("<div id='el'></div>");

    var c = BigBird.Controller.extend({
      i: 0,
      proxied: [ "test" ],

      initialize: function() { element.bind('click', this.test); },
      test: function() { this.i = 1; }
    });
    c = new c();

    expect(c.i).toBe(0);
  
    element.click();

    expect(c.i).toBe(1);
  });

  it("should allow me to bind events to functions and have them executed when being called", function(){
    var element = $("<div id='el'><a href='#' class='btn'></a></div>");

    var c = BigBird.Controller.extend({
      el: element,
      i: 0,
      events: { "click": "test", "click .btn": "testBtn" },
      test: function() { this.i = 1; },
      testBtn: function() { this.i = 2; return false; }
    });
    c = new c();

    expect(c.i).toBe(0);
  
    element.click();
    expect(c.i).toBe(1);

    element.find('.btn').click();
    expect(c.i).toBe(2);
  });
});