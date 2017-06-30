module.exports = function(grunt) {

  // Initialize config.
  grunt.initConfig({
    // Rename data.json file to yui.data.json.js and move it to ./generator
    rename: {
      main: {
        files: [
          {src: ['./data.json'], dest: './generator/yui.data.json.js'}
        ]
      }
    },
    // Prepend "var yuiDoc =" string to yui.data.json.js
    file_append: {
      default_options: {
        files: [
          {
            prepend: "var yuiDoc = ",
            input: './generator/yui.data.json.js'
          }
        ]
      }
    },
    // Start a server so we can generate the Tern def file in the browser
    connect: {
      server: {
        options: {
          port: 9001,
          base: './',
          keepalive: true,
          open: {
            target:'http://localhost:9001/generator/yui2tern.html'
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['rename', 'file_append', 'connect']);

  grunt.loadNpmTasks('grunt-rename-util');
  grunt.loadNpmTasks('grunt-file-append');
  grunt.loadNpmTasks('grunt-contrib-connect');

};
