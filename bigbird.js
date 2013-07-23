(function() {

  "use strict";

  // Initial setup
  // -------------

  var BigBird = window.BigBird = {};

  BigBird.VERSION = '0.3.3';

  var $ = window.jQuery || window.Zepto || window.ender || window.$;

  BigBird.Events = _.extend({}, Eventable);

  // BigBird Initializer
  // -------------------

  var InitializerDefaults = {
    base : document.body,
    modules: {}
  };

  var Initializer = BigBird.Initializer = function(options) {
    this.options = _.extend(InitializerDefaults, options);
    this.initialize.apply(this);
  };

  _.extend(Initializer.prototype, {

    initialize: function(options){

      this.base = $(this.options.base);

      this.set_module_action("module");
      this.set_module_action("action");

      this.application = this.options.modules;

      $(document.body).ready(_.bind(this.setup, this));
    },

    set_module_action : function(name) {
      var value = this.base.attr("data-" + name);
      if (typeof value !== "string" || value === "") {
        throw name + " was not set";
      }
      this[name] = value.toLowerCase();
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

  _.extend(Module.prototype, BigBird.Events, {

    merge : _.extend,

    proxy : _.bind,

    publish : _.bind(BigBird.Events.trigger, BigBird.Events),
    subscribe : _.bind(BigBird.Events.on, BigBird.Events),

    $el: null,

    initialize: function() {},

    $: function(selector) {
      if (this.$el === null) { return; }
      return this.$el.find(selector);
    },

    proxyFunctions: function() {
      var len = this.proxied.length;
      for (len; len--;) {
        var methodName = this.proxied[len];
        if (typeof this[methodName] === "function") {
          this[methodName] = this.proxy(this[methodName], this);
        }
      }
    },

    subscribeToEvents: function() {
      for (var key in this.subscriptions) {
        var methodName = this.subscriptions[key];
        this.subscribe(key, this[methodName], this);
      }
    },

    delegateEvents: function() {
      if (this.$el === null) { return; }

      for (var key in this.events) {
        var methodName = this.events[key];
        var method     = this.proxy(this[methodName], this);

        var match      = key.match(this.eventSplitter);
        var eventName  = match[1], selector = match[2];

        if (selector === '') {
          this.$el.on(eventName, method);
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

      this._$els = {};

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

    setElements: function() {
      _.each(this.$el.find('[data-bb-el]'), _.bind(this._setBBElement, this));
    },

    $els: function(name, force) {
      return this._getBBElement(name, force || false);
    },

    els: function(name, force) {
      return this._getBBElement(name, force || false)[0];
    },

    _getBBElement: function(name, force) {
      var el;

      if (!_.isUndefined(this._$els[name]) && !force) {
        el = this._$els[name];
      } else {
        el = this.$el.find('[data-bb-el="'+ name +'"]');
        this._setBBElement(el);
      }

      return el;
    },

    _setBBElement: function(element) {
      var $element = element instanceof $ ? element : $(element);
      this._$els[$element.attr('data-bb-el')] = $element;
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

  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    _.extend(child, parent, staticProps);

    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (protoProps) { _.extend(child.prototype, protoProps); }

    child.__super__ = parent.prototype;

    return child;
  };

  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  Module.extend = extend;

  if (typeof define !== "undefined" && typeof define === "function" && define.amd) {
    define( "bigbird", [], function () { return BigBird; } );
  }
})();
