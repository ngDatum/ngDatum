module.exports = function(grunt) {

  // Load multiple grunt tasks using globbing patterns
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    concat: {
      test: {
        src: ['src/chart.js','src/**/*.js'],
        dest: 'dist/test.js'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js']
    },
    watch: {
      dev: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['dev']
      }
    }
  });


  grunt.registerTask('dev', ['jshint:all']);
  
  // simple to task to test that grunt is working  
  grunt.registerTask('test', function(){
    console.log('Grunt is working');
  });

};