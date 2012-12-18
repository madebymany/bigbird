describe("BigBird.Initializer", function() {

  it("Should find the appropriate methods on the application object using the execute function", function(){
    var base = $("<div data-module='test' data-action='index' />");

    var o = {
      'Test' : { initialize: function() {} }
    };

    var b = new BigBird.Initializer({ base: base, modules: o });

    expect(b.execute("Test", "initialize")).not.toBe(false);
    expect(b.execute("Test", "index")).toBe(false);
    expect(b.execute("Common", "initialize")).toBe(false);
  });

  it("Should execute the requested action on the module specified", function(){
    var base = $("<div data-module='test' data-action='index' />");

    var o = {
      'Test' : { initialize: function() {}, index: function(){} }
    };

    spyOn(o.Test, 'initialize');
    spyOn(o.Test, 'index');

    var b = new BigBird.Initializer({ base: base, modules: o });

    expect(o.Test.initialize.callCount).toEqual(1);
    expect(o.Test.index.callCount).toEqual(1);
  });

  it("Should find the common object and execute it on DOMready", function() {
    var base = $("<div data-module='test' data-action='index' />");

    var o = {
      'Common' : {
        initialize: function() {}
      },
      'Other': {
        initialize: function(){}
      }
    };

    spyOn(o.Common, 'initialize');

    var b = new BigBird.Initializer({ base: base, modules: o });
    expect(o.Common.initialize.callCount).toEqual(1);
  });

  it("Should gracefully fail trying to call execute on functions that don't exist", function(){
    var o = {};
    var b = new BigBird.Initializer({ modules: o });
    expect(b.execute("Common", "initialize")).toBe(false);
  });

  it("Should find the module and action based on what's available on the base tag provided", function() {
    var base = $("<div data-module='Test' data-action='index' />");

    var b = new BigBird.Initializer({ base: base });

    expect(b.module).toBe("test");
    expect(b.action).toBe("index");
  });

  it("Can rerun an action after initialisation", function() {
    var base = $("<div data-module='test' data-action='index' />");

    var o = {
      'Test': {
        index: function() {}
      }
    };

    spyOn(o.Test, 'index');

    var b = new BigBird.Initializer({ base: base, modules: o });
    b.rerunAction();

    expect(o.Test.index.callCount).toEqual(2);
  });

  it("Should be case insensitive for the module name", function(){
    var o = {
      'Test': {
        index: function() {}
      }
    };

    var base = $("<div data-module='test' data-action='index' />");
    var b = new BigBird.Initializer({ base: base, modules: o });

    expect(b.module).toBe("test");
    expect(b.getModule("Test")).not.toBe(undefined);
    expect(b.getModule("test")).not.toBe(undefined);
  });

});