describe("Big Bird module", function() {

  var module = BigBird.Module.extend({

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
      "hover [data-bb-el=someOtherElement]": "someMethod"
    },

    subscriptions: {
      "someSubscription": "someMethod"
    },

    someMethod: function() {
    },

    someOtherMethod: function() {
    }

  });

  var cls;

  beforeEach(function() {
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

    var selector, element, $element;

    beforeEach(function() {
      selector = "body";
      element = document.getElementsByTagName(selector);
      $element = $(selector);
    });

    it("takes a selector", function() {
      cls.setElement(selector);
      expect(cls.$el).toBe($(element));
      expect(cls.el).toBe(element);
    });

    it("takes an element", function() {
      cls.setElement(element);
      expect(cls.$el).toBe($(element));
      expect(cls.el).toBe(element);
    });

    it("takes a jQuery element", function() {
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

    it("calls setBBElement for each element", function() {
      spyOn(cls, "_setBBElement");
      cls.setElements();
      expect(cls._setBBElement).toHaveBeenCalled();
    });

  });

  describe("els", function() {

    it("returns an element", function() {
      expect(cls.els("someOtherElement"))
        .toBe(cls.$el.find("[data-bb-el=someOtherElement]")[0]);
    });

  });

  describe("$els", function() {

    it("returns a jQuery element", function() {
      expect(cls.$els("someOtherElement"))
        .toBe("[data-bb-el=someOtherElement]");
    });

  });

  describe("$", function() {

    it("finds an element within the primary element", function() {
      expect(cls.$("[data-bb-el=someOtherElement]"))
        .toBe(cls.$el.find("[data-bb-el=someOtherElement]"));
    });

  });

  describe("destroy", function() {

    it("detaches event listeners", function() {
      expect(cls.$el).toHandle("click");
      cls.destroy();
      expect(cls.$el).not.toHandle("click");
    });

    it("detaches delegate event listeners", function() {
      expect(cls.$el).toHandle("hover");
      cls.destroy();
      expect(cls.$el).not.toHandle("hover");
    });

  });

  describe("getBBElement", function() {

    it("returns an element from the cache", function() {
      cls.setElements();
      spyOn(cls, "_setBBElement");
      expect(cls._getBBElement("someOtherElement").length).toBeTruthy();
      expect(cls._setBBElement).not.toHaveBeenCalled();
    });
  });

  describe("setBBElement", function() {

    it("adds an element to the cache", function() {
      cls.setElements();
      expect(_.size(cls._$els)).toEqual(1);
    });

  });

});
