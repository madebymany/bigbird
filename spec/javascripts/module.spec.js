describe("BigBird.Module", function() {

  describe(".setOptions", function(){
    var m = BigBird.Module.extend();
    var moduleInstance = new m({ test: true, testFunction: function(){ this.test = false; } });

    it("sets options as variables on the object", function(){
      expect(moduleInstance.test).toBe(true);
    });

    it("allows custom functions to be set", function(){
      expect(moduleInstance.testFunction).not.toBeUndefined();
    });

    it("allows custom functions to be called", function(){
      moduleInstance.testFunction();
      expect(moduleInstance.test).toBe(false);
    });
  });

  describe(".subscribeToEvents", function() {
    var m = BigBird.Module.extend({
      i: 0,
      subscriptions: { "/test" : "runTest" },
      runTest: function() {
        this.i = 1;
      }
    });
    var moduleInstance = new m();

    it("can subscribe to events", function(){
      $.publish("/test");
      expect(moduleInstance.i).toBe(1);
    });
  });

  describe(".proxyFunctions", function() {
    var element = $("<div id='el'></div>");

    var m = BigBird.Module.extend({
      i: 0,
      proxied: [ "test" ],

      initialize: function() { element.bind('click', this.test); },
      test: function() { this.i = 1; }
    });
    m = new m();

    it("should allow a proxied function to retain lexical scope", function() {
      element.click();
      expect(m.i).toBe(1);
    });

  });

  describe(".setElement", function() {
    var element = $("<div id='el'></div>"),
        m = BigBird.Module.extend({ el: element }),
        moduleInstance = new m();

    it("has a jQuery object with .$el", function() {
      expect(moduleInstance.$el).toBe(jQuery);
    });

    it("has a plain dom object with .el", function() {
      expect(moduleInstance.el).not.toBeNull();
    });

    it("can set another element at runtime", function(){
      var other_element = $("<div id='other-element'></div>");

      var original_element = moduleInstance.$el;

      moduleInstance.setElement(other_element);
      expect(moduleInstance.$el).not.toBe(original_element);
    });
  });

  describe(".delegateEvents", function() {
    var element = $("<div id='el'><a href='#' class='btn'></a></div>"),
        m = BigBird.Module.extend({
          el: element,
          i: 0,
          events: { "click": "elementClickHandler", "click .btn": "buttonClickHandler" },
          elementClickHandler: function() { this.i = 1; },
          buttonClickHandler: function() { this.i = 2; return false; }
        }),
        moduleInstance = new m();

    it("can have an event with no selector, which defaults to the element", function() {
      element.click();
      expect(moduleInstance.i).toBe(1);
    });

    it("can have an event with a selector", function() {
      element.find('.btn').click();
      expect(moduleInstance.i).toBe(2);
    });
  });

  describe("stateful functions", function(){
    var element = $("<div id='el'></div>");
    var m = BigBird.Module.extend({ el: element });
    var moduleInstance = new m();

    it("allows me to set the element as active", function(){
      moduleInstance.activate();
      expect(element.hasClass('active')).toBe(true);
    });

    it("allows me to set the element as deactive", function(){
      moduleInstance.activate();
      moduleInstance.deactivate();
      expect(element.hasClass('active')).toBe(false);
    });
  });

  describe(".destroy", function() {

    var element, m, moduleInstance;

    beforeEach(function(){
      element = $("<div id='el'><a href='#' class='btn'></a></div>"),
      m = BigBird.Module.extend({
        el: element,
        i: 0,
        events: { "click": "elementClickHandler", "click .btn": "buttonClickHandler" },
        elementClickHandler: function() { this.i = 1; },
        buttonClickHandler: function() { this.i = 2; return false; }
      }),
      moduleInstance = new m();

      moduleInstance.destroy();
    });

    it("should unbind events on the base element", function() {
      element.click();
      expect(moduleInstance.i).toBe(0);
    });

    it("should unbind events on the child element", function() {
      element.find('.btn').click();
      expect(moduleInstance.i).toBe(0);
    });
  });

  describe("merge", function(){
    var result;
    var merge = BigBird.Module.prototype.merge;
    it("can extend an object with the attributes of another", function() {
      expect(merge({}, {a:'b'}).a).toEqual('b');
    });
    it("properties in source override destination", function() {
      expect(merge({a:'x'}, {a:'b'}).a).toEqual('b');
    });
    it("properties not in source don't get overriden", function() {
      expect(merge({x:'x'}, {a:'b'}).x).toEqual('x');
    });
    it("can extend from multiple source objects", function() {
      result = merge({x:'x'}, {a:'a'}, {b:'b'});
      expect(result).toEqual({x:'x', a:'a', b:'b'});
    });
    it("extending from multiple source objects last property trumps", function() {
      result = merge({x:'x'}, {a:'a', x:2}, {a:'b'});
      expect(result).toEqual({x:2, a:'b'});
    });

    it("should not error on `null` or `undefined` sources", function() {
      result = {};
      merge(result, null, undefined, {a:1});
      expect(result.a).toEqual(1);
    });
  });

  describe("proxy", function(){
    var proxy = BigBird.Module.prototype.proxy;
    var context = {name : 'ninjabiscuit'};
    var func = function(arg) { return "name: " + (this.name || arg); };
    var bound = proxy(func, context);
    it("can bind a function to a context", function(){
      expect(bound()).toEqual('name: ninjabiscuit');
    });
  });

});