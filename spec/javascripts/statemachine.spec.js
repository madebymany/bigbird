describe("BigBird.StateMachine", function(){

  describe("#new", function(){
    it("can be created", function(){
      var sm = new BigBird.StateMachine();
      expect(sm).not.toBeNull();
    });

    it("can have a collection of objects passed to it", function(){
      var objects = [{},{}];
      var sm = new BigBird.StateMachine(objects);
      expect(sm).not.toBeNull();
    });
  });

  describe("addCollection", function(){
    var sm;

    beforeEach(function() {
      sm = new BigBird.StateMachine();
      spyOn(sm, 'add');
    });

    it("will call the add method for every object added", function(){
      var objects = [{}, {}];
      sm.addCollection(objects);
      expect(sm.add.calls.length).toEqual(2);
    });
  });

  describe("add", function(){
    var sm;

    beforeEach(function() {
      sm = new BigBird.StateMachine();
    });

    it("will add an active method to the object passed in", function(){
      var object = {};
      sm.add(object);
      expect(object.active).not.toBeUndefined();
    });

    it("will add a subscription for the new item", function(){
      spyOn(sm, 'subscribe');
      sm.add({});
      expect(sm.subscribe).toHaveBeenCalled();
    });
  });

  describe("active", function(){
    var sm;

    beforeEach(function() {
      sm = new BigBird.StateMachine();
    });

    it("will call the publish function on calling active", function(){
      var object = { activate: function(){} };

      sm.add(object);

      spyOn(sm, 'publish');
      object.active();

      expect(sm.publish).toHaveBeenCalled();
    });

    it("will call the activate method on the object", function(){
      var object = { activate: function(){} };

      sm.add(object);

      spyOn(object, 'activate');
      object.active();

      expect(object.activate).toHaveBeenCalled();
    });

    it("will call the deactivate method on the object that is the one being marked as active", function(){
      var object_one = { activate: function(){} };
      var object_two = { deactivate: function(){} };

      spyOn(object_two, 'deactivate');

      sm.add(object_one);
      sm.add(object_two);

      object_one.active();
      expect(object_two.deactivate).toHaveBeenCalled();
    });
  });

});