# Big Bird

[![Build Status](https://travis-ci.org/madebymany/bigbird.png?branch=master)](https://travis-ci.org/madebymany/bigbird/)

Big Bird is a JavaScript framework of sorts that's designed to help you write more maintainable, modular JavaScript. It fits perfectly when you don't need a full blown MVC framework like [Backbone](http://backbgonejs.org) or [Ember](http://emberjs.com). Big Bird is suited to situations where you are rendering on the server-side but need to progressively enhance your application with a sprinkling of JS magic and you're fed up with writing monolithic jQuery functions that are difficult to maintain.

## Getting started

We have an [example carousel](https://github.com/madebymany/bigbird/tree/master/examples/carousel/) written with Big Bird to give you a good starting point. It's heavily commented to show you some of the functionality of Big Bird.

The [source code](https://github.com/madebymany/bigbird/tree/master/bigbird.js) is also heavily commented, and there are a full suite of tests which help to illustrate the functionality provided.

## Change log

**0.3.4**
- Add CommonJS module support
- Refactor codebase

**0.3.3**
- ``setElements`` now uses this.$el to search for ``data-bb-el`` elements
- ``this.$els`` and ``this.els`` are now functions that accept a `name` and an optional `force` parameter to re-cache the element

**0.3.2**
- Added ``setElements`` method to dynamically assign ``data-bb-el="blah"`` elements in a template into a ``this.$els`` object

**0.3.0**
- Added underscore and eventable as dependencies
- Removed tiny pub sub in favour of eventable

**0.2.0**
- Tidied up initializer
- More compatible with other DOM libraries (although still relies on Tiny Pub Sub)
- Bower registered

**0.1.1**
- Refactoring controllers and views into one class called ``Module``.
- Added new ``destroy()`` method for tearing down views to unbind events.
- Added a carousel example to help people get started.
- Heavily commented the source code.

**0.1.0**
- Initial release

## Contributing

Big Bird is built with [grunt](https://github.com/gruntjs/grunt). Please make sure you have [npm](https://npmjs.org/) installed to get up and running.

1. Fork it, pull it down.
2. Run `npm install` to get the grunt modules required.
3. Make changes to the `src/bigbird.js` file.
4. **Run the tests** and build the source using the `grunt` && `grunt jasmine` tasks
5. Open a pull request, make sure the tests pass.

Big Bird is maintained by [cjbell88](http://github.com/cjbell88), [callum-](http://github.com/callum-) and [ninjabiscuit](http://github.com/ninjabiscuit).

## License

Big Bird is released under the MIT license:

www.opensource.org/licenses/MIT
