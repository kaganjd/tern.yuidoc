tern.yuidoc
===========

Generates Tern defs file for p5.js from source by using [yuidoc](https://github.com/yui/yuidoc/).
 
## How it works? 

Today tern def generation is done at hand. It should be very cool if grunt tasks will exists. 

[placeholder]

### data.json

Generates p5.js data.json with yuidoc.

[placeholder]

### data.json -> tern def

 * Copy you data.json to generator/yui for YUI
 * Rename it data.json to yui.data.json.js and add 'var yuiDoc = ' on the top of the file.
 * open yui2tern.html to generate tern def from the data.json in the textarea.

## Structure

The basic structure of the project is given in the following way:

* `generator/` generates YUI tern plugin from yuidoc data.json by using HTML pages.
* `lib/` lib to  transform yuidoc data.json to tern def.
