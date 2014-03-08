/**
 * Module dependencies.
 */

var views = require("co-views");

// setup views mapping .html
// to the swig template engine
module.exports = function (dir) {
  dir = dir || __dirname + "/../views";
  return views (dir, {
    map : { html : "swig"},
    cache : "memory" // https://github.com/visionmedia/co-views/issues/8#issuecomment-36831312
  });
}