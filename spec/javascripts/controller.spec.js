describe("BigBird.Controller", function() {

  it("should should set any options as variables on the controller object", function(){

    var c = BigBird.Controller.extend();
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

});