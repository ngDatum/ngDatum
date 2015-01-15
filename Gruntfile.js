module.exports = function(grunt) {

  // Load multiple grunt tasks using globbing patterns
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/charts.js','src/**/*.js'],
        dest: 'dist/ngdatum.js'
      }
    },
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        browser: true,
        globals: {
          angular: true,
          d3: true,
          console: true
        },
    },
      dev: ['Gruntfile.js', 'src/**/*.js'],
      dist: ['dist/ngdatum.js']
    },
    ngAnnotate: {
      dist: {
        files: {
          'dist/ngdatum.annotated.js': ['dist/ngdatum.js']
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/ngdatum.min.js': ['dist/ngdatum.annotated.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          archive: 'dist/ngdatum.zip'
        },
        files: [
          { src: 'dist/ngdatum.js'},
          { src: 'dist/ngdatum.min.js'}
        ]
      }
    },
    watch: {
      dev: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['dev']
      }
    }
  });


  grunt.registerTask('default', ['jshint:dev', 'concat:dist', 'jshint:dist', 'ngAnnotate:dist', 'uglify:dist', 'compress:main' ]);


  grunt.registerTask('dev', ['jshint:dev']);
  
  // simple to task to test that grunt is working  
  grunt.registerTask('test', function(){
    console.log('Grunt is working');
  });

};