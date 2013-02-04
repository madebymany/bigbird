// Big Bird
// v0.1.1
// by @cjbell88, @ninjabiscuit & @callumj_ all from @madebymany
(function() {

  // Initial setup
  // -------------

  var BigBird = window.BigBird = {};

  // Current version of BigBird
  BigBird.VERSION = '0.1.1';

  // Use jQuery (our only dependency)
  // If it's not included and require is included then require it.
  var $ = jQuery;
  if (!$ && (typeof require !== 'undefined')) { $ = require('jquery'); }

  // Tiny Pub / Sub
  // Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL
  var o = $({});
  $.subscribe = function() { o.on.apply(o, arguments); };
  $.unsubscribe = function() { o.off.apply(o, arguments); };
  $.publish = function() { o.trigger.apply(o, arguments); };

  
  // BigBird Initializer
  // -------------------

  // Some basic defaults for the initializer. Using the body
  // and the data-module and data-action to select which module
  // and action to load.

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

  
  // BigBird Simple State Machine
  // ----------------------------

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

  
  // BigBird Module
  // --------------

  var Module = BigBird.Module = function(options) {
    this._setOptions(options || {});

    if (this.el) { this.setElement(this.el); }
    if (this.subscriptions) { this.subscribeToEvents(); }
    if (this.events) { this.delegateEvents(); }
    if (this.proxied) { this.proxyFunctions(); }

    this.initialize.apply(this, arguments);
  };

  $.extend(Module.prototype, {

    // Establish references to the pub /sub methods for convienience
    publish : $.publish,
    subscribe : $.subscribe,

    $el: null,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},

    // Scoped jQuery dom finds to the `$el`.
    // Allows for short hand selectors like `this.$('a')`
    $: function(selector) {
      if (this.$el === null) { return; }

      return this.$el.find(selector);
    },

    
    // Takes an array of functions `['foo', 'bar']`
    // and uses `$.proxy` to retain lexical scope for each.
    // this means you can call these later without fear of losing scope
    // especially useful in callbacks from events like `.bind(event, this.function)`
    proxyFunctions: function() {
      var len = this.proxied.length;
      for (len; len--;) {
        var methodName = this.proxied[len];
        if (typeof this[methodName] === "function") {
          this[methodName] = $.proxy(this[methodName], this);
        }
      }
    },

    // Set subscriptions with event and function pairs. `{ "/test": "testMethod" }`
    // methods are bound to the Module, so should correspond
    // to methods that you have defined.
    subscribeToEvents: function() {
      for (var key in this.subscriptions) {
        var methodName = this.subscriptions[key];
        this.subscribe(key, $.proxy(this[methodName], this));
      }
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function() {
      if (this.$el === null) { return; }

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

    eventSplitter: /^(\S+)\s*(.*)$/,

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
    },

    destroy: function() {
      if (this.$el === null) { return; }

      for (var key in this.events) {
        var match = key.match(this.eventSplitter);
        var eventName = match[1], selector = match[2];

        var target = (selector === '') ? this.$el : this.$el.find(selector);
        target.unbind(eventName);
      }
    },

    _setOptions: function(options) {
      this.options = options;
      for (var key in this.options) {
        this[key] = this.options[key];
      }
    }
  });

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  // From Backbone JS: https://github.com/documentcloud/backbone/blob/master/backbone.js

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

  // Capitilises the first letter of a string
  // Used within the Initialiser to make it case insensitive.
  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Setup inheritence for the Module, so we can do BigBird.Module.extend({})
  Module.extend = extend;

  // Setup BigBird as a module, if require is available
  if (typeof define !== "undefined" && typeof define === "function" && define.amd) {
    define( "bigbird", [], function () { return BigBird; } );
  }
})();