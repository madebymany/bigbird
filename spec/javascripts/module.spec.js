describe("Big Bird module", function() {

  var module;
  var cls;

  beforeEach(function() {
    module = BigBird.Module.extend({
      el: $("<div />").append($("<div class=someElement />")),
      proxied: ["someMethod"],
      events: {
        "click": "someMethod",
        "click .someElement": "someMethod"
      },
      subscriptions: { "someEvent": "someMethod" },
      someMethod: function() {}
    });

    cls = new module();
  });

  describe("constructor", function() {

    it("sets options", function() {
      cls.constructor({ someOption: true });
      expect(cls.someOption).toBeDefined();
    });

    it("calls setup methods", function() {
      spyOn(cls, "setElement");
      spyOn(cls, "proxyMethods");
      spyOn(cls, "attachEvents");
      spyOn(cls, "subscribeToEvents");
      cls.constructor();
      expect(cls.setElement).toHaveBeenCalled();
      expect(cls.proxyMethods).toHaveBeenCalled();
      expect(cls.attachEvents).toHaveBeenCalled();
      expect(cls.subscribeToEvents).toHaveBeenCalled();
    });

    it("calls initialize", function() {
      spyOn(cls, "initialize");
      cls.constructor();
      expect(cls.initialize).toHaveBeenCalled();
    });

  });

  describe("proxyMethods", function() {

    it("binds methods to the context of the module", function() {
      function maskContext(callback) {
        return callback();
      };

      cls.someOtherMethod = function() {
        return this;
      };

      expect(maskContext(cls.someOtherMethod)).not.toBe(cls);
      cls.proxied.push("someOtherMethod");
      cls.proxyMethods();
      expect(maskContext(cls.someOtherMethod)).toBe(cls);
    });

  });

  describe("attachEvents", function() {

    it("attaches events", function() {
      expect(cls.$el).not.toHandle("someEvent");
      cls.events["someEvent"] = "someMethod";
      cls.attachEvents();
      expect(cls.$el).toHandle("someEvent");
    });

  });

  describe("subscribeToEvents", function() {
  });

  describe("setElement", function() {
  });

  describe("setElements", function() {
  });

  describe("els", function() {
  });

  describe("$els", function() {
  });

  describe("$", function() {
  });

  describe("destroy", function() {
  });

  describe("getBBElement", function() {
  });

  describe("setBBElement", function() {
  });

});
