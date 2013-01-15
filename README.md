# Big Bird 

[![Build Status](https://travis-ci.org/madebymany/bigbird.png?branch=master)](https://travis-ci.org/madebymany/bigbird/)

A stripped back JS framework built out of sensible patterns used here at Made by Many. We don't include a full blown MVC stack, so if you're looking for something that tracks state then go check out Backbone or Ember. What BigBird gives you is a controller & a simple view layer, coupled with a kind-of router. It fits in remarkably well when you're building a site that's predominantly written in a server-side language but you need to add some JS magic and don't want one big unmanageable JS file.   

View the [source of the example](https://github.com/madebymany/bigbird/blob/master/examples/index.html) to see more.

## Quick Start

To get up and running:

1. Grab the latest version from the ``/dist`` folder (either minified or unminified)
2. Include jQuery in your project 
3. Create 'modules' for your controller and actions, as described below
4. Instantiate the ``BigBird.Initializer`` with your modules passed in.

## The Initialiser

Modules tie JS functions inside named objects to controller methods / actions. So for example you might have a module like this:

```javascript
var Modules = {};

Modules.Pages = {
  initialize: function() {
    console.log('Called everytime Pages are loaded');
  },

  index: function() {
    console.log('Called when Pages index is viewed');
  }
};

new BigBird.Initializer({ modules: Modules });
```

And when the ``<body>`` tag contains the ``data-module="Pages"`` and ``data-action="index"`` then the ``Pages.index`` method will be called, along with the ``Pages.initialize`` function. 

In addition, you can also have 'generic' helper functions that get called on *every* request. These are defined in a ``Common`` module, as below:

```javascript
...
Modules.Common = {
  initialize: {
    console.log('Called on every page view');
  }
};
...
```

## The Controller 

The controller gives you:

- Event subscription using tiny pub/sub so you can publish an event and have a controller respond. Eg ```subscriptions: { "/test" : "runTest" }``` now running $.publish("/test") will invoke the ``runTest`` function
- Proxied functions to keep lexical scope

## The View

Think of the view as a controller with a few nice bits of functionality mixed in, because that's exactly what it is. The view gives you the following:

- The ability to specify an element eg ```el: $(".element")``` 
- Some nice shorthand methods for doing things to this element: ```this.$el```, ```this.el```, ```this.$(".query-inside-el")```
- The ability to specify events eg ```events: { "click .btn": "handleButtonClick" }``` which get automatically bound for you
- Event subscription (see controller)

## Motivations

You may think, why the hell have they written another JS framework? Well, technically this isn't a framework at all. All we're trying to provide is a really simple base that will get out of your way and give you some sensible defaults on your projects. 

We've grown this out of what we've built on projects such as ITV News and Sport and have found that we often repeat the same patterns in our application development.

## License

BigBird is released under the MIT license:

www.opensource.org/licenses/MIT
