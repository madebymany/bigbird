describe("Big Bird module", function() {

  var cls;

  beforeEach(function() {
    cls = new (BigBird.Module.extend({

      el: $(_.template([
        "<div class=someElement>",
        "<div data-bb-el=someOtherElement>Some content</div>",
        "<div>"
      ].join(""))()),

      proxied: [
        "someMethod"
      ],

      events: {
        "click": "someMethod",
        "click [data-bb-el=someOtherElement]": "someMethod"
      },

      subscriptions: {
        "someSubscription": "someMethod"
      },

      someMethod: function() {
      }

    }))();
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

    it("binds methods within context of the module", function() {
      function maskContext(fn) {
        return fn();
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

    it("subscribes to events", function() {
      spyOn(cls, "subscribe");
      cls.subscriptions["someOtherSubscription"] = "someMethod";
      cls.subscribeToEvents();
      expect(cls.subscribe)
        .toHaveBeenCalledWith("someOtherSubscription", cls.someMethod, cls);
    });

  });

  describe("setElement", function() {

    var element, $element;

    beforeEach(function() {
      element = document.body;
      $element = $(element);
    });

    it("takes an element", function() {
      cls.setElement(element);
      expect(cls.$el).toBe($(element));
      expect(cls.el).toBe(element);
    });

    it("takes a jQuery-wrapped element", function() {
      cls.setElement($element);
      expect(cls.$el).toBe($(element));
      expect(cls.el).toBe(element);
    });

    it("assigns data attributes", function() {
      $element.data("someKey", "someValue");
      cls.setElement($element);
      expect(cls.data.someKey).toEqual("someValue");
    });

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
