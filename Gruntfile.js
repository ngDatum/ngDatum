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
    }
  });



  // grunt.registerTask('concat-test', [concat:test]);
  // simple to task to test that grunt is working  
  grunt.registerTask('test', function(){
    console.log('Grunt is working');
  });

};