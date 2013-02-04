/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  
  grunt.initConfig({
    
    meta: {
      version: '0.1.1',
      banner: '// Big Bird\n// v<%= meta.version %>\n// by @cjbell88, @ninjabiscuit & @callumj_ all from @madebymany'
    },

    lint: {
      files: ['src/bigbird.js']
    },

    'jasmine' : {
      src : ['public/javascripts/*.js', 'bigbird.js'],
      specs : 'spec/**/*.spec.js',
      helpers : 'spec/javascripts/helpers/*.js',
      timeout : 10000,
      phantomjs : {
        'ignore-ssl-errors' : true
      }
    },
    'jasmine-server' : {
      browser : false
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/bigbird.js'],
        dest: 'bigbird.js'
      }
    },

    min: {
      standard: {
        src: ['<banner:meta.banner>', '<config:rig.build.dest>'],
        dest: 'bigbird.min.js'
      }
    },
    
    watch: {
      files: ['src/*.js', 'src/**/*.js'],
      tasks: 'default'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        require: true,
        define: true,
        console: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.loadNpmTasks('grunt-jasmine-runner');

  grunt.registerTask('travis', 'lint rig jasmine');

  grunt.registerTask('default', 'lint rig min');

};