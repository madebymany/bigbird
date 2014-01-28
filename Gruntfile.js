module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jasmine");

  grunt.initConfig({

    jshint: {
      all: ["bigbird.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    jasmine: {
      bigbird: {
        src: "bigbird.js",
        options: {
          specs: "spec/**/*.spec.js",
          helpers: "spec/javascripts/helpers/*.js",
          vendor: [
            "bower_components/jquery/jquery.js",
            "bower_components/underscore/underscore.js",
            "bower_components/Eventable/eventable.js"
          ],
          phantomjs: {
            "ignore-ssl-errors": true
          }
        }
      }
    },

    uglify: {
      standard: {
        files: {
          "bigbird.min.js": ["bigbird.js"]
        }
      }
    }

  });

  grunt.registerTask("travis", ["jasmine"]);
  grunt.registerTask("default", ["jshint", "jasmine", "uglify"]);

};
