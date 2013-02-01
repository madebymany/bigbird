# Big Bird 

[![Build Status](https://travis-ci.org/madebymany/bigbird.png?branch=master)](https://travis-ci.org/madebymany/bigbird/)

Big Bird is a Javascript framework of sorts that's designed to help you write more maintainable modular Javascript. It fits perfectly when you don't need a full blown MVC framework like [Backbone](http://backbgonejs.org) or [Ember](http://emberjs.com). Big Bird is suited to situations where you are rendering on the server-side but need to progressively enhance your application with a sprinkling of JS magic and you're fed up of writing monolithic jQuery functions that are difficult to maintain. 

## Getting started

We have an [example carousel](https://github.com/madebymany/bigbird/tree/master/examples/carousel/) written with BigBird to give you a good starting point. The Big Bird source code is alos heavily commented and provides a good way to understand what Big Bird does. 

## Change log

__0.1.1__
- Refactoring controllers and views into one class called ``Module``.
- Added new ``destroy()`` method for tearing down views to unbind events.
- Added a carousel example to help people get started.
- Heavily commented the source code.

__0.1.0__
- Initial release

## License

BigBird is released under the MIT license:

www.opensource.org/licenses/MIT