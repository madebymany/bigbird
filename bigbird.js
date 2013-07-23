(function() {

  "use strict";

  // Initial setup
  // -------------

  var BigBird = window.BigBird = {};

  BigBird.VERSION = "0.3.3";

  BigBird.Events = _.extend({}, Eventable);


  // BigBird Initializer
  // -------------------

  var initializerDefaults = {
    base: document.body,
    modules: {}
  };

  var Initializer = BigBird.Initializer = function(options) {
    this.options = _.extend(initializerDefaults, options);
    this.initialize.apply(this);
  };

  _.extend(Initializer.prototype, {

    initialize: function(options){
      this.base = $(this.options.base);
      this.setModuleAction("module");
      this.setModuleAction("action");
      this.application = this.options.modules;

      $(document.body).ready(_.bind(this.setup, this));
    },

    setModuleAction: function(name) {
      var value = this.base.attr("data-" + name);
      if (typeof value !== "string" || value === "") {
        throw name + " was not set";
      }
      this[name] = value.toLowerCase();
    },

    setup: function() {
      this.execute("common", "initialize");
      this.execute(this.module, "initialize");
      this.execute(this.module, this.action);
    },

    rerunAction: function() {
      return this.execute(this.module, this.action);
    },

    execute: function(module, action) {
      module = this.getModule(module);
      if (module === undefined) { return false; }

      if (module[action] === undefined || typeof module[action] !== "function") { return false; }

      module[action].apply();
    },

    getModule: function(moduleName) {
      if (this.application.hasOwnProperty(moduleName)) {
        return this.application[moduleName];
      }

      moduleName = capitalise(moduleName);
      if (this.application.hasOwnProperty(moduleName)) {
        return this.application[moduleName];
      }

      return undefined;
    }

  });


  // BigBird Module
  // --------------

  var Module = BigBird.Module = function(options) {
    this.options = options;

    _.each(options, function(v, option) {
      this[option] = v;
    }, this);

    if (this.el) { this.setElement(); }
    if (this.subscriptions) { this.subscribeToEvents(); }
    if (this.events) { this.delegateEvents(); }
    if (this.proxied) { this.proxyFunctions(); }

    this.initialize.apply(this, arguments);
  };

  Module.extend = extend;

  _.extend(Module.prototype, BigBird.Events, {

    publish: _.bind(BigBird.Events.trigger, BigBird.Events),
    subscribe: _.bind(BigBird.Events.on, BigBird.Events),

    $el: null,
    _$els: {},

    initialize: function() {
    },

    $: function(selector) {
      return this.$el.find(selector);
    },

    proxyFunctions: function() {
      _.each(this.proxied, function(method) {
        this[method] = _.bind(this[method], this);
      }, this);
    },

    subscribeToEvents: function() {
      _.each(this.subscriptions, function(method, name) {
        this.subscribe(name, this[method], this);
      }, this);
    },

    delegateEvents: function() {
      var method;
      var evt;

      _.each(this.events, function(m, e) {
        method = _.bind(this[m], this);
        evt = splitEvent(e);

        if (evt.selector) {
          this.$el.on(evt.kind, evt.selector, method);
          return;
        }

        this.$el.on(evt.kind, method);
      }, this);
    },

    destroy: function() {
      var target = this.$el;
      var evt;

      _.each(this.events, function(m, e) {
        evt = splitEvent(e);

        if (evt.selector) {
          target = this.$(evt.selector);
        }

        target.unbind(evt.kind);
      }, this);
    },

    setElement: function(element) {
      this.$el = $(element || this.el);
      this.el = this.$el[0];
      this.data = this.$el.data();
    },

    setElements: function() {
      _.each(this.$("[data-bb-el]"), this._setBBElement, this);
    },

    els: function(name, force) {
      return this._getBBElement(name, force || false)[0];
    },

    $els: function(name, force) {
      return this._getBBElement(name, force || false);
    },

    _getBBElement: function(name, force) {
      var el;

      if (!_.isUndefined(this._$els[name]) && !force) {
        el = this._$els[name];
      } else {
        el = this.$("[data-bb-el=" + name + "]");
        this._setBBElement(el);
      }

      return el;
    },

    _setBBElement: function(element) {
      var $element = element instanceof $ ? element : $(element);
      this._$els[$element.attr("data-bb-el")] = $element;
    }

  });


  // Helpers
  // -------

  function extend(protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && protoProps.hasOwnProperty("constructor")) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    _.extend(child, parent, staticProps);

    var Surrogate = function() { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (protoProps) {
      _.extend(child.prototype, protoProps);
    }

    child.__super__ = parent.prototype;

    return child;
  }

  function splitEvent(evt) {
    var match = evt.match(/^(\S+)\s*(.*)$/);
    return {
      "kind": match[1],
      "selector": match[2]
    }
  }

  function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (typeof define === "function" && define.amd) {
    define("bigbird", [], function() { return BigBird; });
  }

})();
