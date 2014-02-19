(function() {

  "use strict";

  var BigBird = {};

  BigBird.VERSION = "0.3.4";
  BigBird.Events = _.extend({}, Eventable);


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
      kind: match[1],
      selector: match[2]
    };
  }

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  // Initializer
  // -----------

  var Initializer = BigBird.Initializer = function(options) {
    var $base = options.base || $(document.body);

    _.extend(this, {
      modules: {},
      module: $base.data("module"),
      action: $base.data("action")
    }, options);

    this.initialize();
  };

  _.extend(Initializer.prototype, {

    initialize: function() {
      this.execute("common", "initialize");
      this.execute(this.module, "initialize");
      this.execute(this.module, this.action);
    },

    execute: function(moduleName, actionName) {
      var module;
      var action;

      if (!moduleName || !actionName) {
        return;
      }

      module = this.modules[moduleName] ||
               this.modules[capitalise(moduleName)];
      if (_.isUndefined(module)) {
        return;
      }

      action = module[actionName] ||
               module[capitalise(actionName)];
      if (_.isFunction(action)) {
        action();
      }
    },

    rerunAction: function() {
      this.execute(this.module, this.action);
    }

  });


  // Module
  // ------

  var Module = BigBird.Module = function(options) {
    _.extend(this, options);

    if (this.el) { this.setElement(); }
    if (this.proxied) { this.proxyMethods(); }
    if (this.events) { this.attachEvents(); }
    if (this.subscriptions) { this.subscribeToEvents(); }

    this.initialize.call(this);
  };

  Module.extend = extend;

  _.extend(Module.prototype, BigBird.Events, {

    publish: _.bind(BigBird.Events.trigger, BigBird.Events),
    subscribe: _.bind(BigBird.Events.on, BigBird.Events),

    $el: null,
    _$els: {},

    initialize: function() {
    },

    proxyMethods: function() {
      _.bindAll.apply(null, _.union(this, this.proxied));
    },

    attachEvents: function() {
      var method;
      var evt;

      _.each(this.events, function(m, e) {
        method = _.bind(this[m], this);
        evt = splitEvent(e);

        if (evt.selector) {
          this.$el.on(evt.kind, evt.selector, method);
        } else {
          this.$el.on(evt.kind, method);
        }
      }, this);
    },

    subscribeToEvents: function() {
      _.each(this.subscriptions, function(method, name) {
        this.subscribe(name, this[method], this);
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

    $: function(selector) {
      return this.$el.find(selector);
    },

    destroy: function() {
      var evt;

      _.each(this.events, function(m, e) {
        evt = splitEvent(e);

        if (evt.selector) {
          this.$el.off(evt.kind, evt.selector);
        } else {
          this.$el.off(evt.kind);
        }
      }, this);

      this.$el.remove();
    },

    _getBBElement: function(name, force) {
      var element = this._$els[name];

      if (force || _.isUndefined(element)) {
        element = this.$("[data-bb-el=" + name + "]");
        this._setBBElement(element);
      }

      return element;
    },

    _setBBElement: function(el) {
      var $el = $(el);
      this._$els[$el.data("bbEl")] = $el;
    }

  });

  if (typeof define === "function" && define.amd) {
    define(function () {
      return BigBird;
    });
  } else if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      exports = module.exports = BigBird;
    }
    exports.BigBird = BigBird;
  } else {
    window.BigBird = BigBird;
  }

})();
