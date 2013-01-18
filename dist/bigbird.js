// Big Bird
// v0.1.0
// by @cjbell88, @ninjabiscuit & @callumj_
(function() {
  var BigBird = window.BigBird = {};

  var $ = jQuery;
  if (!$ && (typeof require !== 'undefined')) { $ = require('jquery'); }

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
    this.options = $.extend({}, InitializerDefaults, options || {});

    this.initialize.apply(this, arguments);
  };

  $.extend(Initializer.prototype, {
    initialize: function(){
      this.base = this.options.base;
      this.module = this.base.attr(this.options.module);
      this.action = this.base.attr(this.options.action);
      this.application = this.options.modules;

      if (this.module === undefined || this.action === undefined || this.application === undefined) {
        return false;
      }

      if (this.module) { this.module = this.module.toLowerCase(); }
      if (this.action) { this.action = this.action.toLowerCase(); }

      $(document.body).ready($.proxy(this.setup, this));
    },

    setup: function() {
      // Common module execution if it exists
      this.execute("common", "initialize");
      this.execute(this.module, "initialize");
      this.execute(this.module, this.action);
    },

    rerunAction: function() {
      return this.execute(this.module, this.action);
    },

    execute: function(module, action) {
      // Check existence of module
      module = this.getModule(module);
      if (module === undefined) { return false; }

      // Check existence of action on module
      if (module[action] === undefined || typeof module[action] !== "function") { return false; }

      module[action].apply();
    },

    getModule: function(moduleName) {
      if (this.application.hasOwnProperty(moduleName)) {
        return this.application[moduleName];
      }

      moduleName = capitaliseFirstLetter(moduleName);
      if (this.application.hasOwnProperty(moduleName)) {
        return this.application[moduleName];
      }

      return undefined;
    }

  });

  /*
    BigBird Base
    -
    Controller and View inherit from this
  */

  var Base = {
    publish : $.publish,
    subscribe : $.subscribe,

    initialize: function() {},

    subscribeToEvents: function() {
      for (var key in this.subscriptions) {
        var methodName = this.subscriptions[key];
        this.subscribe(key, $.proxy(this[methodName], this));
      }
    },

    eventSplitter: /^(\S+)\s*(.*)$/,

    _setOptions: function(options) {
      this.options = options;

      for (var key in this.options) {
        this[key] = this.options[key];
      }
    }
  };

  /*
    BigBird Controller
    -
    Rewrite of Andy Walker's (@ninjabiscuit) controller into more of a backbone / underscore style
  */

  var Controller = BigBird.Controller = function(options){
    this._setOptions(options || {});

    if (this.subscriptions) { this.subscribeToEvents(); }
    if (this.proxied) { this.proxyFunctions(); }

    this.initialize.apply(this, arguments);
  };

  $.extend(Controller.prototype, Base, {
    stateful: function(collection, state_machine){
      return state_machine ? state_machine.addCollection(collection) : new BigBird.StateMachine(collection);
    },

    proxyFunctions: function() {
      var len = this.proxied.length;
      for (len; len--;) {
        var methodName = this.proxied[len];
        if (typeof this[methodName] === "function") {
          this[methodName] = $.proxy(this[methodName], this);
        }
      }
    }
  });

  /*
    BigBird Simple State Machine
  */

  BigBird.StateMachine = function(collection){
    this.o = $({});

    if (collection) {
      this.addCollection(collection);
    }
  };

  BigBird.StateMachine.prototype = {
    publish : function(){
      this.o.trigger.apply( this.o, arguments );
    },

    subscribe : function(){
      this.o.bind.apply( this.o, arguments );
    },

    addCollection: function(items) {
      $.each(items, $.proxy(function(item){
        this.add(item);
      }, this));
    },

    add: function(item) {
      this.subscribe("change", function(e, current_item){
        return (current_item === item) ? item.activate() : item.deactivate();
      });

      item.active = $.proxy(function(){ this.publish("change", item); }, this);
    }
  };

  /*
    BigBird View
    -
  */

  var View = BigBird.View = function(options){
    this.setElement();
    this._setOptions(options || {});

    if (this.subscriptions) { this.subscribeToEvents(); }
    if (this.events) { this.delegateEvents(); }

    this.initialize.apply(this, arguments);
  };

  $.extend(View.prototype, Base, {
    $: function(selector) {
      return this.$el.find(selector);
    },

    delegateEvents: function() {
      for (var key in this.events) {
        var methodName = this.events[key];
        var method     = $.proxy(this[methodName], this);

        var match      = key.match(this.eventSplitter);
        var eventName  = match[1], selector = match[2];

        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    activate: function(){
      this.$el.addClass("active");
    },

    deactivate: function(){
      this.$el.removeClass("active");
    },

    setElement: function(element) {
      this.el = element || this.el;

      this.$el = this.el instanceof $ ? this.el : $(this.el);
      this.el = this.$el[0];
      this.data = this.$el.data();
    }
  });

  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    $.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) { $.extend(child.prototype, protoProps); }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  function capitaliseFirstLetter(string)
  {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  View.extend = Controller.extend = extend;

  if (typeof define !== "undefined" && typeof define === "function" && define.amd) {
    define( "bigbird", [], function () { return BigBird; } );
  }
})();