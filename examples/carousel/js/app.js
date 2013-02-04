// Initialise the application
// Setup our App object
var App = {};

// Setup the carousel. Not how this relates to the
// data-module and data-action on the body tag in the
// index.html file
App.Carousel = {
  index: function(){
    // Create our status object (carousel-status.js)
    new CarouselStatus();
    // Create our carousel (carousel.js)
    new Carousel();
  }
};

// Bind the App modules to fire when the dom is ready
new BigBird.Initializer({ modules: App });