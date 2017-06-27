// adapted from https://github.com/cowboy/wesbos/blob/master/Gruntfile.js
module.exports = function(grunt) {

  // Initialize config.
  grunt.initConfig({
    // Rename data.json file to yui.data.json.js and move it to ./generator/yui
    rename: {
      main: {
        files: [
          {src: ['./data.json'], dest: './generator/yui/yui.data.json.js'}
        ]
      }
    },
    // Prepend "var yuiDoc =" string to yui.data.json.js
    file_append: {
      default_options: {
        files: [
          {
            prepend: "var yuiDoc = ",
            input: './generator/yui/yui.data.json.js'
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['rename']);

  grunt.loadNpmTasks('grunt-rename-util');
  grunt.loadNpmTasks('grunt-file-append');

};
