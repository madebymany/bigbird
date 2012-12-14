// Big Bird
// v0.1.0
// by @cjbell88, @ninjabiscuit & @callumj_
(function($, _) {
  var BigBird = window.BigBird = {};

  /* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
   * http://benalman.com/
   * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */

  var o = $({});
  $.subscribe = function() { o.on.apply(o, arguments); };
  $.unsubscribe = function() { o.off.apply(o, arguments); };
  $.publish = function() { o.trigger.apply(o, arguments); };

  /*
    BigBird Initializer
    -
    Used for DOM ready execution of the application passed to it.
  */

  var InitializerDefaults = {
    base: $(document.body),
    module: "data-module",
    action: "data-action",
    modules: {}
  };

  var Initializer = BigBird.Initializer = function(options){
    this.options = _.extend({}, InitializerDefaults, options || {});

    this.initialize.apply(this, arguments);
  };

  _.extend(Initializer.prototype, {

    initialize: function(){
      this.base = this.options.base;
      this.module = this.base.attr(this.options.module);
      this.action = this.base.attr(this.options.action);
      this.application = this.options.modules;

      this.common = this.application.Common || null;

      $(document.body).ready(_.bind(this.setup, this));
    },

    setup: function() {
      // Common module execution if it exists
      if (!_.isNull(this.common)) {
        this.execute("Common", "initialize");
      }

      // Module execution
      this.execute(this.module, "initialize");
      this.execute(this.module, this.action);
    },

    rerunAction: function() {
      return this.execute(this.module, this.action);
    },

    execute: function(module, action) {
      // Check existence of module
      module = this.application[module];
      if (_.isUndefined(module)) { return false; }

      // Check existence of action on module
      if (_.isUndefined(module[action]) || !_.isFunction(module[action])) { return false; }

      module[action].apply();
    }

  });

  /*
    BigBird Controller
    -
    Rewrite of Andy Walker's (@ninjabiscuit) controller into more of a backbone / underscore style
  */

  var Controller = BigBird.Controller = function(options){
    this._setElement();
    this._setOptions(options || {});

    if (this.subscriptions) { this.subscribeToEvents(); }
    if (this.proxied) { this.proxyFunctions(); }
    if (this.events) { this.delegateEvents(); }

    this.initialize.apply(this, arguments);
  };

  _.extend(Controller.prototype, {

    $: function(selector) {
      return this.$el.find(selector);
    },

    publish : $.publish,
    subscribe : $.subscribe,

    initialize: function() {},

    subscribeToEvents: function() {
      for (var key in this.subscriptions) {
        var methodName = this.subscriptions[key];
        this.subscribe(key, _.bind(this[methodName], this));
      }
    },

    proxyFunctions: function() {
      var len = this.proxied.length;
      for (len; len--;) {
        var methodName = this.proxied[len];
        if (_.isFunction(this[methodName])) {
          this[methodName] = _.bind(this[methodName], this);
        }
      }
    },

    eventSplitter: /^(\S+)\s*(.*)$/,

    delegateEvents: function() {
      for (var key in this.events) {
        var methodName = this.events[key];
        var method     = _.bind(this[methodName], this);

        var match      = key.match(this.eventSplitter);
        var eventName  = match[1], selector = match[2];

        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    _setElement: function() {
      if (_.isUndefined(this.el)) { return false; }

      this.$el = this.el instanceof $ ? this.el : $(this.el);
      this.el = this.$el[0];
      this.data = this.$el.data();
    },

    _setOptions: function(options) {
      this.options = options;

      for (var key in this.options) {
        this[key] = this.options[key];
      }
    }
  });

  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) { _.extend(child.prototype, protoProps); }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  Controller.extend = extend;

})(jQuery, _);