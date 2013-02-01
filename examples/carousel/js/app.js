var App = {};

App.Carousel = {
  index: function(){
    new CarouselStatus();
    new Carousel();
  }
};

new BigBird.Initializer({ modules: App });