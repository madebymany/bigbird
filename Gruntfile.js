/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.initConfig({

    meta: {
      version: '0.3.2',
      banner: '// Big Bird\n// v<%= meta.version %>\n// by @cjbell88, @ninjabiscuit & @callumj_ all from @madebymany'
    },

    'jasmine' : {
      'bigbird' : {
        src : [
          'components/underscore/underscore.js',
          'components/Eventable/eventable.js',
          'public/javascripts/jquery-1.9.1.js',
          'bigbird.js'
        ],
        options : {
          specs : 'spec/**/*.spec.js',
          helpers : 'spec/javascripts/helpers/*.js',
          timeout : 10000,
          phantomjs : {
            'ignore-ssl-errors' : true
          }
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      standard: {
        files :{
          'bigbird.min.js' : ['<banner:meta.banner>', 'bigbird.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/*.js', 'src/**/*.js'],
        tasks: 'default'
      }
    },

    jshint: {
      all: ['bigbird.js'],
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
        jasmine : false,
        describe : false,
        beforeEach : false,
        expect : false,
        it : false,
        spyOn : false,
        jQuery: true,
        console: true,
        URL:true,
        webkitURL:true
      }
    }
  });

  grunt.registerTask('travis', ['jasmine']);
  grunt.registerTask('default', ['uglify', 'jasmine']);

};
