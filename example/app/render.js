/**
 * Module dependencies.
 */

var views = require("co-views");

// setup views mapping .html
// to the swig template engine

module.exports = views(__dirname + "/dist/views", {
  map: { html: "swig"},
  cache : "memory" // https://github.com/visionmedia/co-views/issues/8#issuecomment-36831312
});