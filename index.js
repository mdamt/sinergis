var web = require (__dirname + "/web");
var session = require ("koa-session-store");
var koa = require ("koa");

var types = {
  API : "api",
  APP : "app"
}

module.exports = function (policy) {

  var policy = policy || {};

  var server = koa();

  // basic setups
  server.keys = policy.keys;
  server.use (session(policy));
  server.types = types;

  server.mount = function (mids) {
    
    var i = mids.length;
    while (i--) {
      var mid = mids[i];

      // if an app
      if (mid.type == types.APP) {
        policy.app = policy.app || {};
        policy.app.path = mid.path;  
      }

      // if an api
      // @todo setup altering policy to be implemented in web stack
    };

    // add the webstack
    server.use (web(policy));
    
    i = mids.length; // bottom up!
    while (i--) {
      var mid = mids[i];
      server.use (mid.mount, policy);
    }
  }

  return server;
}