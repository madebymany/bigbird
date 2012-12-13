# Big Bird 

A stripped back JS framework built out of sensible patterns used here at Made By Many. Out of the box we include:

1. Paul Irish's DOM Ready Execution, wrapped up in a delightful package.
2. A ultra simple controller, ready to be extended
3. Tiny Pub / Sub by Ben Alman 

## Quick Start

To get up and running:

1. Grab the latest version from the ``/dist`` folder (either minified or unminified)
2. Include ``jQuery`` and ``underscore`` in your project too
3. Create 'modules' for your controller and actions, as described below
4. Instantiate the ``BigBird.Initializer`` with your modules passed in.

## Intialising modules

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

## Where does this fit?

Big Bird ties in really well with an MVC framework like Rails. All you'll have to do is output your controller name and action onto the body tag with the data attributes ``data-module`` and ``data-action`` and you're good to go!

## Motivations

You make think, why the hell have they written another JS framework? Well, technically this isn't a framework at all. All we're trying to provide is a really simple base that will get out of your way and give you some sensible defaults on your projects. 

We've grown this out of what we've built on projects such as ITV News and Sport and have found that we often repeat the same patterns in our application development.


