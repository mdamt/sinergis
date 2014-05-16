var session = require ("koa-session-store");
var web = require (__dirname + "/web");
var favicon = require ("koa-favi");
var mount = require ("koa-mount");
var csrfy = require ("koa-csrf");
var qsify = require ("koa-qs");
var path = require ("path");
var koa = require ("koa");

module.exports = function (policy) {

  var policy = policy || {};
  var app = koa();
  csrfy(app);
  qsify(app);
  var server = app;

  // basic setups
  server.keys = policy.keys;
  server.use (session(policy));
  server.use (favicon(policy.favicon || __dirname + "/web/icon.png"));

  return function (mids, cb) {

    var statics = [];

    var i = mids.length;

    // api or apps -- we can have many apps, but we only have one main app
    while (i--) {
      var mid = mids[i];

      if (mid.mount) {

        // if main app
        if (mid.main) {
          policy.app = policy.app || {};
          policy.app.path = mid.path;
          server.use (web(policy));
        }

        server.use (mid.mount);

      } else {
        server.use (mount(mid));
      }

      if (mid.statics) {
        statics = statics.concat(mid.statics);
      }
    }

    i = statics.length;

    var files = {};

    while (i--) {
      server.middleware.unshift(statics[i]);
    }

    return server;
  }
}
