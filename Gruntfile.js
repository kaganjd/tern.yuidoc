module.exports = function(grunt) {

  // Initialize config.
  grunt.initConfig({
    // Replace HTML formatting like <p> and \n in the data.json file
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /<\/?p[^>]*>/g,
              replacement: ''
            },
            // TODO: Figure out how to correctly replace \n data.json file
            // {
            //   match: /\n/g,
            //   replacement: ''
            // }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['../../docs/reference/data.json'], dest: 'temp/' }
        ]
      }
    },
    // Prepend "var yuiDoc =" string to temp/data.json
    file_append: {
      default_options: {
        files: [
          {
            prepend: "var yuiDoc = ",
            input: 'temp/data.json'
          }
        ]
      }
    },
    // Rename temp/data.json file to yui.data.json.js and move it to generator/
    rename: {
      main: {
        files: [
          {src: ['temp/data.json'], dest: 'generator/yui.data.json.js'}
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

  grunt.registerTask('default', ['replace', 'file_append', 'rename', 'connect']);


  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-file-append');
  grunt.loadNpmTasks('grunt-rename-util');
  grunt.loadNpmTasks('grunt-contrib-connect');

};
