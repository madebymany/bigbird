(function() {

  "use strict";

  var BigBird = window.BigBird = {};
  var $body = $(document.body);

  BigBird.VERSION = "0.3.3";
  BigBird.Events = _.extend({}, Eventable);


  // Initializer
  // -----------

  var Initializer = BigBird.Initializer = function(options) {
    this.options = _.extend({
      base: $body,
      modules: {}
    }, options);

    this.initialize.apply(this);
  };

  _.extend(Initializer.prototype, {

    initialize: function(options) {
      this.base = this.options.base;
      this.application = this.options.modules;
      this.module = this.base.data("module");
      this.action = this.base.data("action");

      $body.ready(_.bind(this.setup, this));
    },

    setup: function() {
      this.execute("common", "initialize");
      this.execute(this.module, "initialize");
      this.execute(this.module, this.action);
    },

    rerunAction: function() {
      this.execute(this.module, this.action);
    },

    execute: function(moduleName, actionName) {
      var app = this.application;
      var module;
      var action;

      if (!moduleName || !actionName) {
        return;
      }

      module = app[moduleName] || app[capitalise(moduleName)];
      if (_.isUndefined(module)) {
        return;
      }

      action = module[actionName];
      if (_.isFunction(action)) {
        return action();
      }
    }

  });


  // Module
  // ------

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

    $el: $body,
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

        target.off(evt.kind);
      }, this);
    },

    setElement: function(el) {
      var element = el || this.el;
      this.$el = element instanceof $ ? element : $(element);
      this.el = this.$el[0];
      this.data = this.$el.data();
    },

    setElements: function() {
      _.each(this.$("[data-bb-el]"), this._setBBElement, this);
    },

    els: function(name, force) {
      return this._getBBElement(name, !!force)[0];
    },

    $els: function(name, force) {
      return this._getBBElement(name, !!force);
    },

    _getBBElement: function(name, force) {
      var element = this._$els[name];

      if (force || _.isUndefined(element)) {
        element = this.$("[data-bb-el=" + name + "]");
        this._setBBElement(element);
      }

      return element;
    },

    _setBBElement: function($el) {
      this._$els[$el.data("bbEl")] = $el;
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
      child = function() { parent.apply(this, arguments); };
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

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (_.isFunction(window.define) && define.amd) {
    define("bigbird", [], function() {
      return BigBird;
    });
  }

})();
