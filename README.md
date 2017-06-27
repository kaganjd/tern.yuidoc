Generates Tern def file for p5.js from source by using [yuidoc](https://github.com/yui/yuidoc/). A fork of @angelozerr's [tern.yuidoc](https://github.com/angelozerr/tern.yuidoc).
 
## Background info on the p5 Tern def project
[Here](https://gist.github.com/kaganjd/32c87c49fda5f61b78aa2b88993daca4)

## Grunt tasks
The crossed out tasks below are now handled by Grunt instead of manually.

 * ~~Copy you data.json to generator/yui for YUI~~
 * ~~Rename it data.json to yui.data.json.js and add 'var yuiDoc = ' on the top of the file.~~
 * open yui2tern.html to generate tern def from the data.json in the textarea.

## Structure
The basic structure of the project is given in the following way:

* `generator/` generates YUI tern plugin from yuidoc data.json by using HTML pages.
* `lib/` lib to  transform yuidoc data.json to tern def.
