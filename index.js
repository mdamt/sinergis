var web = require (__dirname + "/web");
var session = require ("koa-session-store");
var path = require ("path");
var koa = require ("koa");
var qsified = require ("koa-qs");

var types = {
  API : "api",
  APP : "app"
}

module.exports = function (policy) {

  var policy = policy || {};

  var server = koa();

  // basic setups
  qsified(server);
  server.keys = policy.keys;
  server.use (session(policy));
  server.types = types;

  server.mount = function (mids, cb) {

    var statics = [];
    var connect;
    
    var i = mids.length;

    while (i--) {
      var mid = mids[i];

      // if an app
      // @todo stackable app
      if (mid.type == types.APP) {
        
        policy.app = policy.app || {};
        policy.app.path = mid.path;

      } else if (mid.type == types.API) {

        var root = mid.path + "/endpoints";
        var endpoints = require (path.resolve(root));
        var routes = endpoints().routes;

        policy.apiServer = mid;

        // Check policy.api existence first or just assume it's defined in the policy?
        //var apiEndpoints = policy.api.endpoints || {};

        /*for (var j = 0; j < routes.length ; j++) {
          // @todo put this to be via HTTP
          var route = routes[j];
          if (apiEndpoints[route.name]) {
            var data = apiEndpoints[route.name];
            if (data.model && data.policy) {
              var model = root + data.model;
              policy[data.policy] = require(path.resolve(model));
            }
          }
        }*/
      }
    }

    // add the webstack
    server.use (web(policy));
    
    i = mids.length; // bottom up!
    
    while (i--) {
      var mid = mids[i];
      if (mid.statics) {
        statics = statics.concat(mid.statics);
      }

      if (mid.connect) {
        connect = mid.connect;
      }

      server.use (mid.mount, policy);
    }

    i = statics.length;

    while (i--) {
      server.middleware.unshift(statics[i]);  
    }

    if (connect) {
      return connect(cb);
    }

    cb(new Error("no connection to db"));
  }

  return server;
}
