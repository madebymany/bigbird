describe("Big Bird initializer", function() {

  var modules = {
    common: {
      initialize: function() {}
    },
    home: {
      initialize: function() {},
      index: function() {}
    },
    About: {
      Index: function() {}
    }
  };

  var args = {
    modules: modules,
    module: "home",
    action: "index"
  };

  var cls = new BigBird.Initializer(args);

  describe("constructor", function() {

    it("sets modules, module and action", function() {
      expect(cls.modules).toBe(modules);
      expect(cls.module).toEqual("home");
      expect(cls.action).toEqual("index");
    });

    it("calls initialize when the document is ready", function() {
      spyOn(cls, "initialize");
      cls.constructor(args);
      expect(cls.initialize).toHaveBeenCalled();
    });

  });

  describe("initialize", function() {

    it("executes the common module", function() {
      spyOn(cls, "execute");
      cls.initialize();
      expect(cls.execute).toHaveBeenCalledWith("common", "initialize");
    });

    it("executes the specified module", function() {
      spyOn(cls, "execute");
      cls.initialize();
      expect(cls.execute).toHaveBeenCalledWith("home", "initialize");
      expect(cls.execute).toHaveBeenCalledWith("home", "index");
    });

  });

  describe("execute", function() {

    it("returns if the passed module or action names are falsy", function() {
      expect(cls.execute(null, undefined)).toBeUndefined();
    });

    it("returns if the passed module is undefined", function() {
      expect(cls.execute("settings", "index")).toBeUndefined();
    });

    it("executes a module", function() {
      spyOn(cls.modules.home, "index");
      cls.execute("home", "index");
      expect(cls.modules.home.index).toHaveBeenCalled();
    });

    it("executes a module with case insensitivity", function() {
      spyOn(cls.modules.About, "Index");
      cls.execute("about", "index")
      expect(cls.modules.About.Index).toHaveBeenCalled();
    });

  });

  describe("rerunAction", function() {

    it("calls the current action", function() {
      spyOn(cls.modules.home, "index");
      cls.rerunAction();
      expect(cls.modules.home.index).toHaveBeenCalled();
    });

  });

});
