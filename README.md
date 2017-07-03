Generates Tern def file for p5.js from source by using [yuidoc](https://github.com/yui/yuidoc/). A fork of @angelozerr's [tern.yuidoc](https://github.com/angelozerr/tern.yuidoc).
 
## Background info on the p5 Tern def project
[Here](https://gist.github.com/kaganjd/32c87c49fda5f61b78aa2b88993daca4)

## Use
1.  Clone the repository with `git clone git@github.com:kaganjd/tern.yuidoc.git`
2.  Install dependencies with `npm install`
3.  Put the p5.js data.json file in the project root
3.  Run grunt tasks with `grunt`
4.  One of the grunt tasks starts a local server. When the tasks are complete, manually kill the server with `ctrl + c`

## Grunt tasks
 * `grunt replace` matches and removes `<p>` and `</p>` tags in the data.json, then saves the updated file in temp/
 * `grunt file_append` prepends "var yuiDoc =" to temp/data.json
 * `grunt rename` moves temp/data.json to generator/ and renames it yui.data.json.js so it can be read by the generator script
 * `grunt connect` starts a server so we can generate the Tern def file in the browser. A script in the HTML file automatically downloads the generated file.


Running just `grunt` automatically runs all four tasks, but you can choose to run one at a time.

## Structure
The basic structure of the project is given in the following way:

* data.json in the project root is the starting file; you can get it at [https://p5js.org/reference/data.json](https://p5js.org/reference/data.json)
* `generator/` generates YUI tern plugin from yuidoc data.json by using HTML pages
* `lib/` scripts to transform yuidoc data.json to Tern def
