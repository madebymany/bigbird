describe("BigBird.View", function() {

  describe(".setElement", function() {
    var element = $("<div id='el'></div>"),
        v = BigBird.View.extend({ el: element }),
        viewInstance = new v();

    it("has a jQuery object with .$el", function() {
      expect(viewInstance.$el).toBe(jQuery);
    });

    it("has a plain dom object with .el", function() {
      expect(viewInstance.el).not.toBeNull();
    });
  });

  describe(".delegateEvents", function() {
    var element = $("<div id='el'><a href='#' class='btn'></a></div>"),
        view = BigBird.View.extend({
          el: element,
          i: 0,
          events: { "click": "elementClickHandler", "click .btn": "buttonClickHandler" },
          elementClickHandler: function() { this.i = 1; },
          buttonClickHandler: function() { this.i = 2; return false; }
        }),
        viewInstance = new view();

    it("can have an event with no selector, which defaults to the element", function() {
      element.click();
      expect(viewInstance.i).toBe(1);
    });

    it("can have an event with a selector", function() {
      element.find('.btn').click();
      expect(viewInstance.i).toBe(2);
    });
  });

  describe(".setOptions", function(){
    var element = $("<div id='el'></div>");
    var view = BigBird.View.extend({ el: element });
    var viewInstance = new view({ test: true, testFunction: function(){ this.test = false; } });

    it("sets options as variables on the object", function(){
      expect(viewInstance.test).toBe(true);
    });

    it("allows custom functions to be set", function(){
      expect(viewInstance.testFunction).not.toBeUndefined();
    });

    it("allows custom functions to be called", function(){
      viewInstance.testFunction();
      expect(viewInstance.test).toBe(false);
    });
  });

  describe(".subscribeToEvents", function() {
    var view = BigBird.View.extend({
      i: 0,
      subscriptions: { "/test" : "runTest" },
      runTest: function() {
        this.i = 1;
      }
    });
    var viewInstance = new view();

    it("can subscribe to events", function(){
      $.publish("/test");
      expect(viewInstance.i).toBe(1);
    });
  });
});