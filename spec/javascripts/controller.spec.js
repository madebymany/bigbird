describe("BigBird.Controller", function() {

  describe(".setOptions", function(){
    var c = BigBird.Controller.extend();
    var controllerInstance = new c({ test: true, testFunction: function(){ this.test = false; } });

    it("sets options as variables on the object", function(){
      expect(controllerInstance.test).toBe(true);
    });

    it("allows custom functions to be set", function(){
      expect(controllerInstance.testFunction).not.toBeUndefined();
    });

    it("allows custom functions to be called", function(){
      controllerInstance.testFunction();
      expect(controllerInstance.test).toBe(false);
    });
  });

  describe(".subscribeToEvents", function() {
    var c = BigBird.Controller.extend({
      i: 0,
      subscriptions: { "/test" : "runTest" },
      runTest: function() {
        this.i = 1;
      }
    });
    var controllerInstance = new c();

    it("can subscribe to events", function(){
      $.publish("/test");
      expect(controllerInstance.i).toBe(1);
    });
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

    element.click();
    expect(c.i).toBe(1);
  });

});